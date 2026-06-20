# Event Ticket Booking System

A full-stack event ticket booking application built as part of the SortMyScene Full Stack Developer Hiring Assignment.

## Overview

This application allows users to:

* Browse available events
* View event details and seat availability
* Reserve multiple seats for a limited time
* Complete seat booking before reservation expiry
* Prevent double booking through backend validation and atomic operations
* Receive clear success and error feedback during the booking flow

## Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

---

## Features

### Event Listing

* Displays all available events
* Shows event name, venue, date, and time
* Allows navigation to event details

### Event Details

* Displays selected event information
* Fetches live seat availability from the backend

### Interactive Seat Grid

* Color-coded seat statuses:

  * Available
  * Reserved
  * Booked
* Supports selecting multiple seats
* Prevents selection of unavailable seats

### Seat Reservation

* Reserve selected seats for 10 minutes
* Calls backend reservation API
* Creates a temporary reservation record

### Reservation Countdown Timer

* Displays remaining reservation time
* Automatically expires when the reservation period ends
* Prevents booking after expiration

### Booking Confirmation

* Confirms reserved seats
* Marks seats as booked
* Displays success or failure messages

### Authentication

* Guest user identification using guestId
* JWT token support
* Automatic token attachment using Axios interceptor

### Error Handling

* Handles expired reservations
* Handles seat conflicts
* Handles network failures
* Displays user-friendly error messages

---

## Backend Design Decisions

### Preventing Double Booking

The application prevents double booking by:

1. Checking seat availability before reservation.
2. Updating seat status atomically.
3. Rejecting reservation requests if seats are already reserved or booked.
4. Validating reservation expiry before booking.
5. Marking seats as booked only after successful booking confirmation.

### Reservation Expiry

Each reservation contains:

* User ID
* Event ID
* Reserved Seat Numbers
* Expiration Timestamp

Expired reservations cannot be used for booking.

---

## Project Structure

Frontend/

├── src/

│ ├── components/

│ ├── pages/

│ ├── services/

│ ├── hooks/

│ └── App.jsx

├── public/

└── package.json

---

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd Frontend
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## API Endpoints Used

### Events

```http
GET /api/events
GET /api/events/:id
```

### Reservation

```http
POST /api/reserve
```

### Booking

```http
POST /api/bookings
```

---

## User Flow

1. Open application.
2. View list of events.
3. Select an event.
4. Choose available seats.
5. Click Reserve.
6. Reservation timer starts.
7. Click Confirm Booking.
8. Seats become permanently booked.
9. Success message displayed.

---

## Assumptions

* A user is identified through guestId or JWT token.
* Reservation duration is 10 minutes.
* Booked seats cannot be modified.
* Expired reservations are automatically invalidated.
* MongoDB is running locally or through a configured cloud instance.

---

## Assignment Requirements Covered

* Event listing
* Event details
* Seat selection
* Seat reservation
* Reservation expiry
* Booking confirmation
* Double-booking prevention
* Error handling
* Authentication support
* Responsive React UI
* REST API integration

---

