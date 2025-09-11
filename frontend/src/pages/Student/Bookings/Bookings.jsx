// src/pages/Student/Bookings.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsByStudent } from "../../../features/booking/bookingThunks";
import './Bookings.css';

const Bookings = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state) => state.booking || {});

  useEffect(() => {
    dispatch(getBookingsByStudent());
  }, [dispatch]);

  if (loading) return <p className="loading">Loading your bookings...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!bookings || bookings.length === 0)
    return <p className="no-bookings">You have no bookings yet.</p>;

  return (
    <div className="booking-container">
      <h1 className="title">My Bookings</h1>
      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Artisan Name</th>
              <th>Job Details</th>
              <th>Scheduled Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>
                  {booking.artisan?.fullName || "Unknown"} <br />
                  <span className="subtext">
                    Skill: {booking.artisan?.skillCategory} <br />
                    Location: {booking.artisan?.location} <br />
                    Rating: {booking.artisan?.rating || "N/A"}
                  </span>
                </td>
                <td>{booking.jobDetails}</td>
                <td>
                  {booking.scheduledDate
                    ? new Date(booking.scheduledDate).toLocaleDateString()
                    : "Not scheduled"}
                </td>
                <td className={`status ${booking.status}`}>
                  {booking.status === "pending" && "⏳ Pending"} 
                  {booking.status === "accepted" && "✅ Accepted"} 
                  {booking.status === "completed" && "🏁 Completed"} 
                  {booking.status === "cancelled" && "❌ Cancelled"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
