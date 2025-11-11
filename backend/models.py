from pydantic import BaseModel
from typing import List, Literal

class Patient(BaseModel):
    name: str
    email: str
    phone: str

class AvailabilitySlot(BaseModel):
    start_time: str
    end_time: str
    available: bool

class AvailabilityResponse(BaseModel):
    date: str
    available_slots: List[AvailabilitySlot]

class BookingRequest(BaseModel):
    appointment_type: Literal["consultation","followup","physical","specialist"]
    date: str
    start_time: str
    patient: Patient
    reason: str
    note: str = ""  # optional patient note

class BookingResponse(BaseModel):
    booking_id: str
    status: str
    confirmation_code: str
