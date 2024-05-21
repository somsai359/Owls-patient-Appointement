from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List
import stripe
import requests

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

class Appointment(BaseModel):
    datetime: str
    details: str
    amount: float
    description: str

class AppointmentResponse(BaseModel):
    appointment: Appointment
    payment_link: str

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

class PatientDetail(BaseModel):
    name: str
    email: str
    phone: str

# Endpoint to retrieve patient detail by phone number
@app.get("/patients/{phone}/detail", response_model=PatientDetail)
async def get_patient_detail(phone: str):
    # Query the patient in the database by phone number
    patient = patient_collection.find_one({"phone": phone})

    if patient:
        # If patient found, return its detail
        return {
            "name": patient['name'],
            "email": patient['email'],
            "phone": patient['phone']
        }
    else:
        # If patient not found, raise an HTTPException with 404 status code
        raise HTTPException(status_code=404, detail="Patient not found")

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

# Modify the endpoint to return both appointment data and payment link
@app.post("/patients/{patient_phone}/appointments/", response_model=AppointmentResponse)
async def create_appointment(patient_phone: str, amount: float = Form(...), description: str = Form(...)):
    try:
        # Query the patient in the database by phone number
        patient = patient_collection.find_one({"phone": patient_phone})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # You can use the amount and description provided from the form directly
        appointment = Appointment(
            amount=amount,
            description=description
        )

        # Append the appointment to the patient's appointments list
        appointment_dict = appointment.dict()
        appointment_id = appointment_dict.pop('_id', None)
        appointment_dict['_id'] = appointment_id if appointment_id else str(ObjectId())
        patient_collection.update_one(
            {"phone": patient_phone},
            {"$push": {"appointments": appointment_dict}}
        )

        # Generate the payment link using Stripe API
        payment_link = generate_payment_link(appointment.amount, appointment.description)

        # Return the appointment data and payment link
        return AppointmentResponse(appointment=appointment, payment_link=payment_link)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid phone number format")

