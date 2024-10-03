import React, { useEffect, useState } from "react";
import "./Topbar.scss";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        {/* <img src={appLogo} alt="App Logo" className="app-logo" /> */}
        <h2 className="greeting">Welcome, {user ? user.name : 'Guest'}!</h2>
      </div>
      <div className="topbar-right">
        <img
          src={user && user.profilePicture ? user.profilePicture : "https://picsum.photos/200"}
          alt="Profile"
          className="profile-pic"
        />
        <button className="logout-button" onClick={handleLogout}>
          {/* <img src={logoutIcon} alt="Logout" /> */}
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;
