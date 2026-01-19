import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAnalytics,
  getAllArtisans,
  approveArtisan,
  rejectArtisan,
} from "../../../features/admin/adminThunks";
import { clearAdminMessages } from "../../../features/admin/adminSlice";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  FaUserTie,
  FaUserGraduate,
  FaCalendarCheck,
} from "react-icons/fa";

import "./AdminBoard.css";

const AdminBoard = () => {
  const dispatch = useDispatch();
  const { analytics, artisans = [], loading, successMessage, error } =
    useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAnalytics());
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

  if (loading) return <p className="loading-text">Loading dashboard...</p>;

  const percent = (value, total) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  // Filter pending artisans
  const pendingArtisans = artisans.filter(
    (artisan) => artisan.status === "pending"
  );

  // ================= Chart Data =================
  const chartData = analytics
    ? [
        { name: "Artisans", value: analytics.artisanCount || 0, color: "#22c55e" },
        { name: "Students", value: analytics.studentCount || 0, color: "#0ea5e9" },
        { name: "Approved", value: analytics.approvedArtisanCount || 0, color: "#10b981" },
        { name: "Pending", value: analytics.pendingArtisanCount || 0, color: "#f59e0b" },
        { name: "Bookings", value: analytics.bookingCount || 0, color: "#ef4444" },
      ]
    : [];

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

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-title">
            <h1>Admin Dashboard</h1>
            <p>Overview of user and artisan activities</p>
      </div>
      {/* ================= KPI CARDS ================= */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Artisans"
          value={analytics?.artisanCount || 0}
          icon={<FaUserTie />}
          iconColor="#22c55e"
        />

        <KpiCard
          title="Total Students"
          value={analytics?.studentCount || 0}
          icon={<FaUserGraduate />}
          iconColor="#0ea5e9"
        />

        <KpiCard
          title="Approved Artisans"
          value={analytics?.approvedArtisanCount || 0}
          percent={percent(
            analytics?.approvedArtisanCount,
            analytics?.artisanCount
          )}
          color="#10b981"
        />

        <KpiCard
          title="Pending Artisans"
          value={analytics?.pendingArtisanCount || 0}
          percent={percent(
            analytics?.pendingArtisanCount,
            analytics?.artisanCount
          )}
          color="#f59e0b"
        />

        <KpiCard
          title="Total Bookings"
          value={analytics?.bookingCount || 0}
          icon={<FaCalendarCheck />}
          iconColor="#ef4444"
        />
      </div>

      {/* ================= COLUMN CHART ================= */}
      <div className="dashboard-section">
        <h2 className="chart-title">Analytics Column Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="value" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= ARTISAN APPROVAL TABLE ================= */}
      <div className="dashboard-section">
        <h3 className="chart-title">Artisan Approvals</h3>
        {pendingArtisans.length === 0 ? (
          <p>No pending artisan requests.</p>
        ) : (
          <div className="table-wrapper">
            <table className="artisan-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingArtisans.map((artisan) => (
                  <tr key={artisan._id}>
                    <td>{artisan.fullName || artisan.name}</td>
                    <td>{artisan.email}</td>
                    <td>{artisan.phoneNumber || "-"}</td>
                    <td>
                      <button
                        className="approve-btn"
                        onClick={() => handleApprove(artisan._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleReject(artisan._id)}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        Decline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= KPI CARD ================= */
const KpiCard = ({
  title,
  value,
  percent,
  color = "#22c55e",
  icon,
  iconColor = "#22c55e",
}) => (
  <div className="kpi-card">
    {percent !== undefined ? (
      <div className="progress-wrapper">
        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: "#111827",
            trailColor: "#e5e7eb",
            textSize: "26px",
          })}
        />
      </div>
    ) : (
      <div className="kpi-icon" style={{ color: iconColor }}>
        {icon}
      </div>
    )}

    <div className="kpi-info">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  </div>
);

export default AdminBoard;
