import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBookingsByArtisan,
  updateBookingStatus,
} from "../../../features/booking/bookingThunks";
import "./Booking.css";

const Booking = () => {
  const dispatch = useDispatch();

  const { bookings, loading, error } = useSelector((state) => state.booking || {});

  useEffect(() => {
    dispatch(getBookingsByArtisan());
  }, [dispatch]);


  const handleStatusChange = (bookingId, status) => {
    dispatch(updateBookingStatus({ bookingId, status }));
  };

  if (loading) return <p className="loading">Loading bookings...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!bookings || bookings.length === 0)
    return <p className="no-bookings">No bookings yet.</p>;

  return (
    <div className="booking-container">
      <h1 className="title">My Bookings</h1>
      <div className="table-wrapper">
        <table className="booking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Info</th>
              <th>Job Details</th>
              <th>Scheduled Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>
                <td>
                  {booking.student?.name || "Unknown"} <br />
                  <span className="subtext">
                    Email: {booking.student?.email} <br />
                    Phone: {booking.student?.phone} <br />
                    {/* Department: {booking.student?.department} <br />
                    Faculty: {booking.student?.faculty} */}
                  </span>
                </td>
                <td>{booking.jobDetails}</td>
                <td>
                  {booking.scheduledDate
                    ? new Date(booking.scheduledDate).toLocaleDateString()
                    : "Not scheduled"}
                </td>
                <td className={`status ${booking.status}`}>{booking.status}</td>
                <td>
                  {booking.status === "pending" && (
                    <>
                      <button
                        className="btn-accept"
                        onClick={() =>
                          handleStatusChange(booking._id, "accepted")
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() =>
                          handleStatusChange(booking._id, "cancelled")
                        }
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {booking.status === "accepted" && (
                    <button
                      className="btn-complete"
                      onClick={() =>
                        handleStatusChange(booking._id, "completed")
                      }
                    >
                      Mark as Completed
                    </button>
                  )}

                  {booking.status === "completed" && <span>✅ Done</span>}
                  {booking.status === "cancelled" && <span>❌ Cancelled</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;
