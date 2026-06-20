import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import SeatGrid from "../components/SeatGrid";
import { getGuestId } from "../utils/guestId";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reservation, setReservation] = useState(null); // { _id, expiresAt }
  const [timeLeft, setTimeLeft] = useState(0);
  const [actionError, setActionError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchEvent = () => {
    api.get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data.event);
        setSeats(res.data.seats);
      })
      .catch(() => setError("Failed to load event"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvent(); }, [id]);

  // Countdown timer tied to the active reservation
  useEffect(() => {
    if (!reservation) return;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(reservation.expiresAt) - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        setReservation(null);
        setActionError("Your reservation expired. Please select seats again.");
        fetchEvent();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  const toggleSeat = (seatNumber) => {
    if (reservation) return; // lock selection while a reservation is active
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };


  
  const handleReserve = async () => {
    setActionError("");
    setBusy(true);
    try {
      const res = await api.post("/reserve", {
        eventId: id,
        seatNumbers: selectedSeats,
        userId: getGuestId(),
      });
      setReservation(res.data);
    } catch (err) {
      setActionError(err.response?.data?.message || "Failed to reserve seats");
      fetchEvent(); // refresh in case some seats were taken by someone else
      setSelectedSeats([]);
    } finally {
      setBusy(false);
    }
  };

  const handleConfirmBooking = async () => {
    setActionError("");
    setBusy(true);
    try {
      await api.post("/bookings", { reservationId: reservation._id });
      setBookingSuccess(true);
      setReservation(null);
      setSelectedSeats([]);
      fetchEvent();
    } catch (err) {
      setActionError(err.response?.data?.message || "Booking failed");
      fetchEvent();
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="event-detail">
      <div className="event-header">
        <h1>{event.name}</h1>
        <p>{event.venue} — {new Date(event.dateTime).toLocaleString()}</p>
      </div>

      <div className="seat-legend">
        <span><i className="legend-dot available"></i>Available</span>
        <span><i className="legend-dot reserved"></i>Reserved</span>
        <span><i className="legend-dot booked"></i>Booked</span>
      </div>

      <SeatGrid seats={seats} selectedSeats={selectedSeats} onToggleSeat={toggleSeat} />

      {actionError && <p className="error-msg">{actionError}</p>}
      {bookingSuccess && <p className="success-msg">Booking confirmed! Enjoy the show.</p>}

      {!reservation ? (
        <div className="action-bar">
          <p>Selected: <strong>{selectedSeats.join(", ") || "none"}</strong></p>
          <button disabled={selectedSeats.length === 0 || busy} onClick={handleReserve}>
            {busy ? "Reserving..." : "Reserve Selected Seats"}
          </button>
        </div>
      ) : (
        <div className="action-bar">
          <p>Reservation expires in <strong className="timer">{formatTime(timeLeft)}</strong></p>
          <button disabled={busy} onClick={handleConfirmBooking}>
            {busy ? "Confirming..." : "Confirm Booking"}
          </button>
        </div>
      )}
    </div>
  );
}

export default EventDetail;