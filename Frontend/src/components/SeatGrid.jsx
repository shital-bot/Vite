function SeatGrid({ seats, selectedSeats, onToggleSeat }) {
  const statusClass = (status) => {
    if (status === "available") return "seat available";
    if (status === "reserved") return "seat reserved";
    return "seat booked";
  };

  return (
    <div className="seat-grid">
      {seats.map((seat) => {
        const isSelected = selectedSeats.includes(seat.seatNumber);
        return (
          <button
            key={seat._id}
            className={`${statusClass(seat.status)} ${isSelected ? "selected" : ""}`}
            disabled={seat.status !== "available"}
            onClick={() => onToggleSeat(seat.seatNumber)}
          >
            {seat.seatNumber}
          </button>
        );
      })}
    </div>
  );
}

export default SeatGrid;