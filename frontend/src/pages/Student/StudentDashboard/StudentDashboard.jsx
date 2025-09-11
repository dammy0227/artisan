import React, { useState } from "react";
import { useDispatch } from "react-redux";
import StudentLayout from "../../../layout/StudentLayout/StudentLayout";
import Bookings from "../Bookings/Bookings";
import Profile from "../Profile/Profile";
import Reviews from "../Reviews/Reviews";
import BookArtisan from "../BookArtisan/BookArtisan";
import { logoutStudent } from "../../../features/student/studentSlice";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookArtisan"); // ✅ match sidebar default
  const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutStudent());
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "bookArtisan":
        return <BookArtisan />;
      case "bookings":
        return <Bookings />;
      case "profile":
        return <Profile />;
      case "reviews":
        return <Reviews />;
      default:
        return <BookArtisan />;
    }
  };

  return (
    <StudentLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
    >
      {renderContent()}
    </StudentLayout>
  );
};

export default StudentDashboard;
