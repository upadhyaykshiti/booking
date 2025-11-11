from fastapi import FastAPI, HTTPException
from datetime import datetime, timedelta
from uuid import uuid4
from typing import List
from models import Patient, AvailabilitySlot, AvailabilityResponse, BookingRequest, BookingResponse
from chroma_utils import add_patient_note, search_notes
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Doctor Appointment API with ChromaDB")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Doctor schedule ---
WORKING_HOURS = {"start": "09:00", "end": "17:00"}
APPOINTMENT_DURATIONS = {
    "consultation": 30,
    "followup": 15,
    "physical": 45,
    "specialist": 60
}

# In-memory bookings
bookings = {}

# Helper: generate time slots
def generate_time_slots(date: str, appointment_type: str) -> List[AvailabilitySlot]:
    duration = APPOINTMENT_DURATIONS[appointment_type]
    start_hour, start_minute = map(int, WORKING_HOURS["start"].split(":"))
    end_hour, end_minute = map(int, WORKING_HOURS["end"].split(":"))

    start_dt = datetime.fromisoformat(f"{date}T{start_hour:02d}:{start_minute:02d}")
    end_dt = datetime.fromisoformat(f"{date}T{end_hour:02d}:{end_minute:02d}")

    slots = []
    current = start_dt
    while current + timedelta(minutes=duration) <= end_dt:
        start_str = current.strftime("%H:%M")
        end_str = (current + timedelta(minutes=duration)).strftime("%H:%M")
        is_available = not any(
            b["date"] == date and b["start_time"] == start_str
            for b in bookings.values()
        )
        slots.append(AvailabilitySlot(
            start_time=start_str,
            end_time=end_str,
            available=is_available
        ))
        current += timedelta(minutes=duration)
    return slots

# --- Endpoints ---

@app.get("/api/calendly/availability", response_model=AvailabilityResponse)
def get_availability(date: str, appointment_type: str):
    if appointment_type not in APPOINTMENT_DURATIONS:
        raise HTTPException(status_code=400, detail="Invalid appointment type")
    slots = generate_time_slots(date, appointment_type)
    return {"date": date, "available_slots": slots}

@app.post("/api/calendly/book", response_model=BookingResponse)
def book_appointment(request: BookingRequest):
    slots = generate_time_slots(request.date, request.appointment_type)
    matching_slot = next((s for s in slots if s.start_time == request.start_time), None)
    if not matching_slot or not matching_slot.available:
        raise HTTPException(status_code=400, detail="Slot not available")

    booking_id = f"APPT-{str(uuid4())[:8]}"
    confirmation_code = str(uuid4())[:6].upper()

    bookings[booking_id] = {
        "date": request.date,
        "start_time": request.start_time,
        "appointment_type": request.appointment_type,
        "patient": request.patient.dict(),
        "reason": request.reason,
        "note": request.note,
        "confirmation_code": confirmation_code
    }

    if request.note:
        add_patient_note(booking_id, request.note)

    return {
        "booking_id": booking_id,
        "status": "confirmed",
        "confirmation_code": confirmation_code
    }

# @app.get("/api/patient/search")
# def search_patient_notes(query: str):
#     results = search_notes(query)
#     return {"results": results}

@app.get("/api/patient/search")
def search_patient_notes(query: str):
    """Search stored patient notes using ChromaDB semantic search."""
    try:
        results = search_notes(query)
        formatted = {
            "ids": results.get("ids", [[]])[0],
            "metadatas": results.get("metadatas", [[]])[0],
        }
        print(f"🔍 Search query '{query}' returned {len(formatted['ids'])} results")
        return {"results": formatted}
    except Exception as e:
        print(f"❌ Search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed")