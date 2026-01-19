// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import "./Chart.css";

// const Chart = ({ analytics }) => {
//   if (!analytics) return <p>No analytics data available</p>;

//   const chartData = [
//     { name: "Total Artisans", value: analytics.artisanCount || 0 },
//     { name: "Total Students", value: analytics.studentCount || 0 },
//     { name: "Approved Artisans", value: analytics.approvedArtisanCount || 0 },
//     { name: "Pending Artisans", value: analytics.pendingArtisanCount || 0 },
//     { name: "Bookings", value: analytics.bookingCount || 0 },
//   ];

//   return (
//     <div className="chart-container">
//       <h2 className="chart-title">Admin Dashboard Analytics</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 5 }}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis allowDecimals={false} />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="value" fill="#28a745" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default Chart;
import React from 'react'

const Chart = () => {
  return (
    <div>
      
    </div>
  )
}

export default Chart
