import React, { useState } from "react";
import { useDispatch } from "react-redux";
import AdminLayout from "../../../layout/AdminLayout/AdminLayout";
import Chart from "../Chart/Chart";
import ApproveArtisan from "../ApproveArtisan/ApproveArtisan";
import ViewStudent from "../ViewStudent/ViewStudent";
import { logoutAdmin } from "../../../features/admin/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("chart");
  const dispatch = useDispatch();

     const navigate = useNavigate();
  

  const handleLogout = () => {
    dispatch(logoutAdmin());
     navigate("/admin", { replace: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "chart":
        return <Chart />;
      case "approve":
        return <ApproveArtisan />;
      case "students":
        return <ViewStudent />;
      default:
        return <Chart />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;
