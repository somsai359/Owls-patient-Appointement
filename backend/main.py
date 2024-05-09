from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel
from typing import List, Optional
from typing import List
import stripe  # Import the Stripe module

stripe.api_key = "sk_test_51PEFQnSD3lsheG7Rz75tYsjQ5D1z9uANpnx3EOMMRohSG7xTBbGfJPtCpoEAJh02S7hz7nyOuSjk89ez3kDUSwIB00ArgZKkSe"
# MongoDB connection
client = MongoClient("mongodb+srv://root:root@cluster0.cjrjjex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.get_database("Data")  # Replace "your_database_name" with your actual database name
patient_collection = db.get_collection("patients")

app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define models for patient
class Patient(BaseModel):
    id: str
    name: str
    email: str
    phone: str

# Create a new patient
@app.post("/patients/", response_model=Patient)
async def create_patient(patient: Patient):
    patient_dict = patient.dict()
    result = patient_collection.insert_one(patient_dict)
    patient.id = str(result.inserted_id)
    return patient

# Get all patients
@app.get("/patients/", response_model=List[Patient])
async def get_patients():
    patients = []
    for patient in patient_collection.find():
        patient_obj = Patient(
            id=str(patient['_id']),
            name=patient['name'],
            email=patient['email'],
            phone=patient['phone']
        )
        patients.append(patient_obj)
    return patients

# Get a single patient by ID with linked appointments
@app.get("/patients/{patient_id}/detail", response_model=Patient)
async def get_patient_detail(patient_id: str):
    patient = patient_collection.find_one({"_id": ObjectId(patient_id)})
    if patient:
        patient_obj = Patient(**patient)
        # Retrieve linked appointments for the patient
        patient_appointments_cursor = patient_collection.find({"_id": ObjectId(patient_id)}, {"appointments": 1})
        appointments = [Appointment(**app) for app in patient_appointments_cursor[0].get("appointments", [])]
        patient_obj.appointments = appointments
        return patient_obj
    raise HTTPException(status_code=404, detail="Patient not found")



@app.get("/patients/search/", response_model=List[Patient])
async def search_patients(name: str):
    patients = []
    # Perform case-insensitive search by name
    cursor = patient_collection.find({"name": {"$regex": name, "$options": "i"}})
    for patient in cursor:
        patient_obj = Patient(
            id=str(patient['_id']),
            name=patient['name'],
            email=patient['email'],
            phone=patient['phone']
        )
        patients.append(patient_obj)
    return patients
# Modify the Patient model to include appointments
class Appointment(BaseModel):
    id: str
    datetime: str  # Modify this field as needed
    details: str

class Patient(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    appointments: Optional[List[Appointment]] = []

# Create an endpoint to create appointments for a patient
@app.post("/patients/{patient_id}/appointments/", response_model=Patient)
async def create_appointment(patient_id: str, appointment: Appointment):
    # Find the patient by ID
    patient = patient_collection.find_one({"_id": ObjectId(patient_id)})
    if patient:
        # Check if the 'appointments' field exists, if not, initialize it as an empty list
        appointments = patient.get('appointments', [])
        # Append the new appointment to the patient's list of appointments
        appointments.append(appointment.dict())
        # Update the patient document in the database with the updated 'appointments' field
        patient_collection.update_one({"_id": ObjectId(patient_id)}, {"$set": {"appointments": appointments}})
        return Patient(**patient)
    raise HTTPException(status_code=404, detail="Patient not found")

class PaymentRequest(BaseModel):
    amount: float
    description: str

# Define an endpoint to test the generate_payment_link function
@app.post("/test/payment-link/", response_model=str)
async def test_generate_payment_link(payment_request: PaymentRequest):
    try:
        # Call the generate_payment_link function with the provided data
        client_secret = generate_payment_link(payment_request.amount, payment_request.description)
        return client_secret
    except HTTPException as e:
        return e.detail

# Function to generate payment link using Stripe API
def generate_payment_link(amount: float, description: str) -> str:
    try:
        # Create a PaymentIntent to get a payment link
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # Amount should be in cents
            currency="usd",
            description=description
        )
        return intent.client_secret
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate payment link")


# Delete a patient by ID
@app.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str):
    result = patient_collection.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient deleted successfully"}

# Update a patient by ID
@app.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, patient: Patient):
    patient_dict = patient.dict()
    result = patient_collection.update_one({"_id": ObjectId(patient_id)}, {"$set": patient_dict})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient.id = patient_id
    return patient
