// src/pages/Admin/Chart/Chart.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAnalytics } from "../../../features/admin/adminThunks";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Chart.css";

const Chart = () => {
  const dispatch = useDispatch();
  const { analytics, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAnalytics());
  }, [dispatch]);

  const chartData = analytics
    ? [
        { name: "Total Artisans", value: analytics.artisanCount || 0 },
        { name: "Total Students", value: analytics.studentCount || 0 },
        { name: "Approved Artisans", value: analytics.approvedArtisanCount || 0 },
        { name: "Pending Artisans", value: analytics.pendingArtisanCount || 0 },
        { name: "Bookings", value: analytics.bookingCount || 0 },
      ]
    : [];

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!analytics) return <p>No analytics data available</p>;

  return (
    <div className="chart-container">
      <h2 className="chart-title">Admin Dashboard Analytics</h2>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#28a745" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
