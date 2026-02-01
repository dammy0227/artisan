import React, { useEffect, useState } from "react";
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
  Legend,
  LineChart,
  Line,
} from "recharts";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  FaUserTie,
  FaUserGraduate,
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaUsers,
  FaExclamationTriangle,
  FaFilter,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSearch
} from "react-icons/fa";

import "./AdminBoard.css";

const AdminBoard = () => {
  const dispatch = useDispatch();
  const { analytics, artisans = [], loading, successMessage, error } =
    useSelector((state) => state.admin);

  const [timeFilter, setTimeFilter] = useState("monthly");
  const [sortBy, setSortBy] = useState("date");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    dispatch(getAnalytics());
    dispatch(getAllArtisans());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const toast = document.createElement('div');
      toast.className = 'toast-notification success';
      toast.textContent = successMessage;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      dispatch(clearAdminMessages());
    }
    if (error) {
      const toast = document.createElement('div');
      toast.className = 'toast-notification error';
      toast.textContent = error;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      dispatch(clearAdminMessages());
    }
  }, [successMessage, error, dispatch]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading dashboard data...</p>
    </div>
  );

  const percent = (value, total) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

  // Filter pending artisans
  const pendingArtisans = artisans.filter(
    (artisan) => artisan.status === "pending"
  );

  // ================= Chart Data =================
  const barChartData = analytics
    ? [
        { name: "Artisans", value: analytics.artisanCount || 0, color: "#22c55e" },
        { name: "Students", value: analytics.studentCount || 0, color: "#0ea5e9" },
        { name: "Approved", value: analytics.approvedArtisanCount || 0, color: "#10b981" },
        { name: "Pending", value: analytics.pendingArtisanCount || 0, color: "#f59e0b" },
        { name: "Bookings", value: analytics.bookingCount || 0, color: "#8b5cf6" },
      ]
    : [];

  // Additional data for line chart (mock growth data based on time filter)
  const getGrowthData = () => {
    const baseData = {
      daily: [
        { period: '9 AM', artisans: 25, students: 80, bookings: 40 },
        { period: '12 PM', artisans: 35, students: 95, bookings: 55 },
        { period: '3 PM', artisans: 45, students: 110, bookings: 70 },
        { period: '6 PM', artisans: 40, students: 90, bookings: 65 },
        { period: '9 PM', artisans: 30, students: 75, bookings: 50 },
      ],
      weekly: [
        { period: 'Mon', artisans: 45, students: 120, bookings: 80 },
        { period: 'Tue', artisans: 52, students: 135, bookings: 92 },
        { period: 'Wed', artisans: 61, students: 148, bookings: 105 },
        { period: 'Thu', artisans: 73, students: 162, bookings: 118 },
        { period: 'Fri', artisans: 85, students: 178, bookings: 132 },
        { period: 'Sat', artisans: 95, students: 190, bookings: 145 },
        { period: 'Sun', artisans: 80, students: 175, bookings: 130 },
      ],
      monthly: [
        { period: 'Jan', artisans: 45, students: 120, bookings: 80 },
        { period: 'Feb', artisans: 52, students: 135, bookings: 92 },
        { period: 'Mar', artisans: 61, students: 148, bookings: 105 },
        { period: 'Apr', artisans: 73, students: 162, bookings: 118 },
        { period: 'May', artisans: 85, students: 178, bookings: 132 },
        { period: 'Jun', artisans: analytics?.artisanCount || 98, students: analytics?.studentCount || 195, bookings: analytics?.bookingCount || 145 },
      ],
    };
    return baseData[timeFilter] || baseData.monthly;
  };

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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="label">{label}</p>
          <p className="value">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-title">
        <h1>Welcome back Admin</h1>
        <p>Comprehensive overview of platform analytics and management</p>
      </div>

     

      <div className="dashboard-content">
        {/* ================= KPI CARDS ================= */}
        <div className="kpi-grid">
          <KpiCard
            title="Total Artisans"
            value={analytics?.artisanCount || 0}
            icon={<FaUserTie />}
            iconColor="#22c55e"
            iconBg="#dcfce7"
            trend={`${timeFilter === 'daily' ? 'Today' : timeFilter === 'weekly' ? 'This Week' : 'This Month'}`}
          />

          <KpiCard
            title="Total Students"
            value={analytics?.studentCount || 0}
            icon={<FaUserGraduate />}
            iconColor="#0ea5e9"
            iconBg="#e0f2fe"
            trend={`${timeFilter === 'daily' ? '+8% Today' : timeFilter === 'weekly' ? '+15% This Week' : '+25% This Month'}`}
          />

          <KpiCard
            title="Approval Rate"
            value={analytics?.approvedArtisanCount || 0}
            percent={percent(
              analytics?.approvedArtisanCount,
              analytics?.artisanCount
            )}
            color="#10b981"
            iconBg="#dcfce7"
          />

          <KpiCard
            title="Pending Review"
            value={analytics?.pendingArtisanCount || 0}
            percent={percent(
              analytics?.pendingArtisanCount,
              analytics?.artisanCount
            )}
            color="#f59e0b"
            iconBg="#fef3c7"
          />

          <KpiCard
            title="Total Bookings"
            value={analytics?.bookingCount || 0}
            icon={<FaCalendarCheck />}
            iconColor="#8b5cf6"
            iconBg="#f3e8ff"
            trend={`${timeFilter === 'daily' ? '+12% Today' : timeFilter === 'weekly' ? '+18% This Week' : '+30% This Month'}`}
          />
        </div>

         {/* ================= FILTERS SECTION ================= */}
      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">
            <FaFilter /> Dashboard Filters
          </h3>
        </div>
        
        <div className="filters-row">
          {/* Time Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <FaCalendarAlt /> Time Period
            </label>
            <div className="filter-options">
              <button 
                className={`filter-option-btn ${timeFilter === 'daily' ? 'active' : ''}`}
                onClick={() => setTimeFilter('daily')}
              >
                Daily
              </button>
              <button 
                className={`filter-option-btn ${timeFilter === 'weekly' ? 'active' : ''}`}
                onClick={() => setTimeFilter('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`filter-option-btn ${timeFilter === 'monthly' ? 'active' : ''}`}
                onClick={() => setTimeFilter('monthly')}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Sort Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <FaSortAmountDown /> Sort By
            </label>
            <div className="filter-options">
              <button 
                className={`filter-option-btn ${sortBy === 'date' ? 'active' : ''}`}
                onClick={() => setSortBy('date')}
              >
                Date
              </button>
              <button 
                className={`filter-option-btn ${sortBy === 'name' ? 'active' : ''}`}
                onClick={() => setSortBy('name')}
              >
                Name
              </button>
              <button 
                className={`filter-option-btn ${sortBy === 'status' ? 'active' : ''}`}
                onClick={() => setSortBy('status')}
              >
                Status
              </button>
            </div>
          </div>

          {/* Chart Type Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <FaChartLine /> Chart Type
            </label>
            <div className="filter-options">
              <button 
                className={`filter-option-btn ${chartType === 'bar' ? 'active' : ''}`}
                onClick={() => setChartType('bar')}
              >
                Bar Chart
              </button>
              <button 
                className={`filter-option-btn ${chartType === 'line' ? 'active' : ''}`}
                onClick={() => setChartType('line')}
              >
                Line Chart
              </button>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="search-group">
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search artisans, students, or bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

        {/* ================= DASHBOARD GRID ================= */}
        <div className="dashboard-grid">
          {/* Main Chart */}
          <div className="dashboard-section">
            <div className="chart-header">
              <h2 className="chart-title">
                <FaChartLine /> Platform Metrics ({timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)})
              </h2>
              <div className="chart-subtitle">
                Showing data for {timeFilter} period
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis 
                      allowDecimals={false}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Count" 
                      radius={[8, 8, 0, 0]}
                      barSize={40}
                    >
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <LineChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis 
                      allowDecimals={false}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#28a745" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Count"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="dashboard-section">
            <h2 className="chart-title">
              <FaUsers /> Quick Stats
            </h2>
            <div className="stats-summary">
              <div className="stat-card">
                <div className="label">Active Today</div>
                <div className="value">
                  {Math.floor((analytics?.studentCount || 0) * 0.3)}
                </div>
                <div className="trend">Users</div>
              </div>
              <div className="stat-card">
                <div className="label">Avg. Rating</div>
                <div className="value">4.7</div>
                <div className="trend">/ 5.0</div>
              </div>
              <div className="stat-card">
                <div className="label">Response Time</div>
                <div className="value">2.4</div>
                <div className="trend">Hours</div>
              </div>
            </div>

            {/* Growth Chart */}
            <h3 className="chart-title" style={{ marginTop: '2rem' }}>
              Growth Trend ({timeFilter})
            </h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={getGrowthData()} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="artisans" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Artisans"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Bookings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ================= ARTISAN APPROVAL TABLE ================= */}
        <div className="dashboard-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className="chart-title">
              <FaExclamationTriangle /> Pending Approvals ({pendingArtisans.length})
            </h3>
            {pendingArtisans.length > 0 && (
              <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
                Requires immediate attention
              </div>
            )}
          </div>
          
          {pendingArtisans.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FaCheckCircle />
              </div>
              <p>All artisan requests have been processed</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="artisan-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Specialty</th>
                    <th>Applied Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingArtisans.map((artisan) => (
                    <tr key={artisan._id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>
                          {artisan.fullName || artisan.name}
                        </div>
                      </td>
                      <td>{artisan.email}</td>
                      <td>{artisan.phoneNumber || "-"}</td>
                      <td>
                        <span style={{
                          backgroundColor: '#f1f5f9',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#475569'
                        }}>
                          {artisan.specialty || "General"}
                        </span>
                      </td>
                      <td>
                        {artisan.createdAt 
                          ? new Date(artisan.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(artisan._id)}
                          >
                            <FaCheckCircle /> Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handleReject(artisan._id)}
                          >
                            Decline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
  iconBg = "#f1f5f9",
  trend,
}) => (
  <div className="kpi-card" style={{ '--accent-color': color }}>
    {percent !== undefined ? (
      <div className="progress-wrapper">
        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: "#1e293b",
            trailColor: "#f1f5f9",
            textSize: '28px',
            pathTransitionDuration: 0.5,
          })}
        />
      </div>
    ) : (
      <div className="kpi-icon" style={{ '--icon-color': iconColor, '--icon-bg': iconBg }}>
        {icon}
      </div>
    )}

    <div className="kpi-info">
      <h4>{title}</h4>
      <p>{value.toLocaleString()}</p>
      {trend && (
        <div className="kpi-trend">
          <span>{trend}</span>
        </div>
      )}
    </div>
  </div>
);

export default AdminBoard;