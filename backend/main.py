from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import uuid4
import stripe

stripe.api_key = "sk_test_51PEFQnSD3lsheG7Rz75tYsjQ5D1z9uANpnx3EOMMRohSG7xTBbGfJPtCpoEAJh02S7hz7nyOuSjk89ez3kDUSwIB00ArgZKkSe"

# MongoDB connection
client = MongoClient("mongodb+srv://root:root@cluster0.cjrjjex.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client.get_database("Data")
patient_collection = db.get_collection("patients")

app = FastAPI()

# Add middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Specify allowed HTTP methods
    allow_headers=["*"],
)

class Patient(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    email: str
    phone: str

# Create a new patient
@app.post("/patients/", response_model=Patient)
async def create_patient(patient: Patient):
    patient_dict = patient.dict()
    # Insert the patient into the database
    result = patient_collection.insert_one(patient_dict)
    
    # Retrieve the inserted patient from the database to get the generated ID
    inserted_id = result.inserted_id
    inserted_patient = patient_collection.find_one({"_id": inserted_id})
    
    if inserted_patient:
        # Update the patient's id field with the generated _id from MongoDB
        inserted_patient["_id"] = str(inserted_id)
        return inserted_patient
    else:
        raise HTTPException(status_code=500, detail="Failed to create patient")

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

# Define a response model for the patient detail
class PatientDetail(BaseModel):
    id: str
    name: str
    email: str
    phone: str

# Endpoint to retrieve patient detail by ID
@app.get("/patients/{patient_id}/detail", response_model=PatientDetail)
async def get_patient_detail(patient_id: str):
    # Convert the patient_id to ObjectId for MongoDB query
    try:
        object_id = ObjectId(patient_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid patient ID")

    # Query the patient in the database by ID
    patient = patient_collection.find_one({"_id": object_id})

    if patient:
        # If patient found, return its detail
        return {
            "id": str(patient['_id']),
            "name": patient['name'],
            "email": patient['email'],
            "phone": patient['phone']
        }
    else:
        # If patient not found, raise an HTTPException with 404 status code
        raise HTTPException(status_code=404, detail="Patient not found")

class Appointment(BaseModel):
    id: str
    datetime: str
    details: str

# Endpoint to create appointments for a patient
@app.post("/patients/{patient_id}/appointments/", response_model=Appointment)
async def create_appointment(patient_id: str, appointment_data: Appointment):
    try:
        # Convert the patient_id to ObjectId for MongoDB query
        object_id = ObjectId(patient_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid patient ID")
    
    # Query the patient in the database by ID to ensure the patient exists
    patient = patient_collection.find_one({"_id": object_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Generate an ID for the appointment
    appointment_id = str(uuid4())
    
    # Create the appointment object with the generated ID
    appointment = Appointment(id=appointment_id, **appointment_data.dict())
    
    # Add the appointment data to the patient's record
    result = patient_collection.update_one(
        {"_id": object_id},
        {"$push": {"appointments": appointment.dict()}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to create appointment")

    # Return the created appointment data
    return appointment

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
