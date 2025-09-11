import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllArtisans,
  approveArtisan,
  rejectArtisan,
} from "../../../features/admin/adminThunks";
import { clearAdminMessages } from "../../../features/admin/adminSlice";
import "./ApproveArtisan.css";

const ApproveArtisan = () => {
  const dispatch = useDispatch();
  const { artisans = [], loading, error, successMessage } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getAllArtisans());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(clearAdminMessages());
    }
    if (error) {
      alert(error);
      dispatch(clearAdminMessages());
    }
  }, [successMessage, error, dispatch]);

  const handleApprove = (id) => {
    if (window.confirm("Are you sure you want to approve this artisan?")) {
      dispatch(approveArtisan(id));
    }
  };

  const handleReject = (id) => {
    if (window.confirm("Are you sure you want to reject this artisan?")) {
      dispatch(rejectArtisan(id));
    }
  };

  if (loading) return <p>Loading artisans...</p>;
  if (!artisans.length) return <p>No artisans found.</p>;

  return (
    <div className="approve-artisan-container">
      <h2>Artisan Approvals</h2>
      <div className="table-wrapper">
        <table className="artisan-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Skill</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artisans.map((artisan) => {
              const isApproved = artisan.status === "approved";
              const isRejected = artisan.status === "rejected";

              return (
                <tr key={artisan._id}>
                  <td>{artisan.fullName}</td>
                  <td>{artisan.email}</td>
                  <td>{artisan.skillCategory}</td>
                  <td>{artisan.location}</td>
                  <td
                    style={{
                      color: isApproved
                        ? "green"
                        : isRejected
                        ? "red"
                        : "orange",
                    }}
                  >
                    {artisan.status || "pending"}
                  </td>
                  <td>
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(artisan._id)}
                      disabled={isApproved}
                    >
                      {isApproved ? "Approved" : "Approve"}
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(artisan._id)}
                      disabled={isRejected}
                    >
                      {isRejected ? "Rejected" : "Reject"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApproveArtisan;
