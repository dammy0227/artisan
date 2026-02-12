import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ArtisanLayout from "../../../layout/ArtisanLayout/Artisan";
import Booking from "../Booking/Booking";
import UpdatingProfile from "../UpdateProfile/UpdatingProfile";
import ReviewRating from "../ReviewRating/ReviewRating";
import Post from "../Post/Post";
import { logoutArtisan } from "../../../features/artisan/artisanSlice";
import { useNavigate } from "react-router-dom";

const ArtisanDashboard = () => {
  const [activeTab, setActiveTab] = useState("booking");
  const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogout = () => {
      dispatch(logoutArtisan());
        navigate("/", { replace: true });
    };
  

  const renderContent = () => {
    switch (activeTab) {
      case "booking":
        return <Booking />;
      case "updateProfile":
        return <UpdatingProfile />;
      case "reviewRating":
        return <ReviewRating />;
      case "Post":
        return <Post />;
      default:
      return <Booking />;
    }
  };

  return (
    <ArtisanLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
    >
      {renderContent()}
    </ArtisanLayout>
  );
};

export default ArtisanDashboard;
