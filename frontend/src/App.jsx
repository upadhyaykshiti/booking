// import React, { useState } from "react";
// import axios from "axios";

// export default function App() {
//   const [date, setDate] = useState("2025-11-11");
//   const [appointmentType, setAppointmentType] = useState("consultation");
//   const [slots, setSlots] = useState([]);
//   const [patient, setPatient] = useState({ name: "", email: "", phone: "" });
//   const [reason, setReason] = useState("");
//   const [note, setNote] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [bookingResponse, setBookingResponse] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

// //   const fetchAvailability = async () => {
// //     try {
// //       const res = await axios.get("http://localhost:8000/api/calendly/availability", {
// //         params: { date, appointment_type: appointmentType }
// //       });
// //       setSlots(res.data.available_slots);
// //       setBookingResponse(null);
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error fetching availability");
// //     }
// //   };
// const fetchAvailability = async () => {
//   if (!date || !appointmentType) {
//     alert("Please select date and appointment type");
//     return;
//   }

//   try {
//     const res = await axios.get("http://localhost:8000/api/calendly/availability", {
//       params: { date, appointment_type: appointmentType },
//     });

//     if (res.data?.available_slots) {
//       setSlots(res.data.available_slots);
//       setBookingResponse(null);
//     } else {
//       setSlots([]);
//       alert("No slots returned from server");
//     }
//   } catch (err) {
//     console.error("API error:", err);
//     alert("Error fetching availability");
//   }
// };


//   const bookAppointment = async () => {
//     if (!selectedTime) {
//       alert("Select a time slot");
//       return;
//     }
//     try {
//       const res = await axios.post("http://localhost:8000/api/calendly/book", {
//         appointment_type: appointmentType,
//         date,
//         start_time: selectedTime,
//         patient,
//         reason,
//         note
//       });
//       setBookingResponse(res.data);
//     } catch (err) {
//       console.error(err);
//       alert("Booking failed: " + err.response.data.detail);
//     }
//   };

//   const searchNotes = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/patient/search", {
//         params: { query: searchQuery }
//       });
//       setSearchResults(res.data.results);
//     } catch (err) {
//       console.error(err);
//       alert("Search failed");
//     }
//   };

//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>Doctor Appointment Booking</h1>
      
//       <div>
//         <label>Date: </label>
//         <input type="date" value={date} onChange={e => setDate(e.target.value)} />
//         <label>Appointment Type: </label>
//         <select value={appointmentType} onChange={e => setAppointmentType(e.target.value)}>
//           <option value="consultation">Consultation</option>
//           <option value="followup">Follow-up</option>
//           <option value="physical">Physical Exam</option>
//           <option value="specialist">Specialist</option>
//         </select>
//         <button onClick={fetchAvailability}>Check Availability</button>
//       </div>

//       {slots.length > 0 && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Available Slots:</h3>
//           {slots.map(s => (
//             <div key={s.start_time}>
//               <input
//                 type="radio"
//                 name="slot"
//                 value={s.start_time}
//                 disabled={!s.available}
//                 onChange={() => setSelectedTime(s.start_time)}
//               />
//               <label>
//                 {s.start_time} - {s.end_time} {s.available ? "" : "(Booked)"}
//               </label>
//             </div>
//           ))}
//         </div>
//       )}

//       {slots.length > 0 && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Patient Details</h3>
//           <input placeholder="Name" value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} />
//           <input placeholder="Email" value={patient.email} onChange={e => setPatient({ ...patient, email: e.target.value })} />
//           <input placeholder="Phone" value={patient.phone} onChange={e => setPatient({ ...patient, phone: e.target.value })} />
//           <input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} />
//           <input placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />
//           <button onClick={bookAppointment}>Book Appointment</button>
//         </div>
//       )}

//       {bookingResponse && (
//         <div style={{ marginTop: "20px", color: "green" }}>
//           <h3>Booking Confirmed!</h3>
//           <p>ID: {bookingResponse.booking_id}</p>
//           <p>Confirmation Code: {bookingResponse.confirmation_code}</p>
//         </div>
//       )}

//       <div style={{ marginTop: "40px" }}>
//         <h2>Search Patient Notes</h2>
//         <input placeholder="Enter query" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//         <button onClick={searchNotes}>Search</button>
//         <ul>
//           {searchResults?.ids?.map((id, i) => (
//             <li key={id}>{id}: {searchResults.metadatas[i].note}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [date, setDate] = useState("2025-11-11");
  const [appointmentType, setAppointmentType] = useState("consultation");
  const [slots, setSlots] = useState([]);
  const [patient, setPatient] = useState({ name: "", email: "", phone: "" });
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingResponse, setBookingResponse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // ✅ Fetch available slots
  const fetchAvailability = async () => {
    if (!date || !appointmentType) {
      alert("Please select date and appointment type");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/calendly/availability", {
        params: { date, appointment_type: appointmentType },
      });

      if (res.data?.available_slots) {
        setSlots(res.data.available_slots);
        setBookingResponse(null);
      } else {
        setSlots([]);
        alert("No slots returned from server");
      }
    } catch (err) {
      console.error("API error:", err);
      alert("Error fetching availability");
    }
  };

  // ✅ Book appointment with validation
  const bookAppointment = async () => {
    if (!selectedTime) {
      alert("Please select a time slot");
      return;
    }
    if (!patient.name.trim()) {
      alert("Please enter patient name");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(patient.email)) {
      alert("Please enter a valid email address");
      return;
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(patient.phone)) {
      alert("Please enter a valid phone number (10–15 digits)");
      return;
    }
    if (!reason.trim()) {
      alert("Please enter reason for appointment");
      return;
    }

    const payload = {
      appointment_type: appointmentType,
      date,
      start_time: selectedTime,
      patient,
      reason,
      note,
    };

    try {
      const res = await axios.post("http://localhost:8000/api/calendly/book", payload);
      setBookingResponse(res.data);
      alert("✅ Appointment booked successfully!");
    } catch (err) {
      console.error("❌ Booking error:", err);
      const detail = err.response?.data?.detail || "Unknown error";
      alert("Booking failed: " + detail);
    }
  };

  // ✅ Search patient notes (ChromaDB)
  const searchNotes = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query");
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/patient/search", {
        params: { query: searchQuery },
      });

      if (res.data?.results?.ids?.length) {
        setSearchResults(res.data.results);
      } else {
        setSearchResults({ ids: [], metadatas: [] });
        alert("No matching notes found.");
      }
    } catch (err) {
      console.error(err);
      alert("Search failed — please check backend connection.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#2563eb" }}>Doctor Appointment Booking</h1>

      {/* Date + Type */}
      <div style={{ marginBottom: "20px" }}>
        <label>Date: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <label>Appointment Type: </label>
        <select
          value={appointmentType}
          onChange={(e) => setAppointmentType(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="consultation">Consultation (30m)</option>
          <option value="followup">Follow-up (15m)</option>
          <option value="physical">Physical Exam (45m)</option>
          <option value="specialist">Specialist (60m)</option>
        </select>
        <button onClick={fetchAvailability}>Check Availability</button>
      </div>

      {/* Slots */}
      {slots.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Available Slots:</h3>
          {slots.map((s) => (
            <div key={s.start_time}>
              <input
                type="radio"
                name="slot"
                value={s.start_time}
                disabled={!s.available}
                onChange={() => setSelectedTime(s.start_time)}
              />
              <label style={{ marginLeft: "8px" }}>
                {s.start_time} - {s.end_time}{" "}
                {!s.available && <span style={{ color: "red" }}>(Booked)</span>}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Patient Form */}
      {slots.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Patient Details</h3>
          <input
            placeholder="Full Name"
            value={patient.name}
            onChange={(e) => setPatient({ ...patient, name: e.target.value })}
            style={{ display: "block", margin: "5px 0", width: "250px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={patient.email}
            onChange={(e) => setPatient({ ...patient, email: e.target.value })}
            style={{ display: "block", margin: "5px 0", width: "250px" }}
          />
          <input
            type="tel"
            placeholder="Phone (10–15 digits)"
            value={patient.phone}
            onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
            style={{ display: "block", margin: "5px 0", width: "250px" }}
          />
          <input
            placeholder="Reason for Visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ display: "block", margin: "5px 0", width: "250px" }}
          />
          <input
            placeholder="Additional Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ display: "block", margin: "5px 0", width: "250px" }}
          />
          <button onClick={bookAppointment} style={{ marginTop: "10px" }}>
            Book Appointment
          </button>
        </div>
      )}

      {/* Booking Confirmation */}
      {bookingResponse && (
        <div style={{ marginTop: "20px", color: "green" }}>
          <h3>Booking Confirmed!</h3>
          <p>
            <strong>ID:</strong> {bookingResponse.booking_id}
          </p>
          <p>
            <strong>Confirmation Code:</strong> {bookingResponse.confirmation_code}
          </p>
        </div>
      )}

      {/* Search Section */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ color: "#2563eb" }}>Search Patient Notes</h2>
        <input
          placeholder="Enter keyword (e.g., fever, chest pain)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginRight: "10px", width: "300px" }}
        />
        <button onClick={searchNotes}>Search</button>

        {searchResults?.ids?.length > 0 && (
          <ul style={{ marginTop: "15px" }}>
            {searchResults.ids.map((id, i) => (
              <li key={id}>
                <strong>{id}</strong>: {searchResults.metadatas[i]?.note || "(no note)"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
