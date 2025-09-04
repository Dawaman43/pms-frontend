"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import HomePageStyles from "../../pages/HomePage.module.css";
import api from "../../api";

const Sidebar = ({ user, isSidebarOpen, toggleSidebar }) => {
  const [activePopout, setActivePopout] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopout = (item) => {
    setActivePopout(activePopout === item ? null : item);
  };

  const navLinks = [
    {
      title: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9L12 2L21 9V20C21 20.53 20.79 21.04 20.41 21.41C20.04 21.79 19.53 22 19 22H5C4.47 22 3.96 21.79 3.58 21.41C3.21 21.04 3 20.53 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/home",
      active: location.pathname === "/home" || location.pathname === "/",
    },
    {
      title: "Self Assessment",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8V12L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/self-assessment",
      active: location.pathname === "/self-assessment",
    },
    {
      title: "Peer Evaluation",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 21V19C17 17.94 16.58 16.92 15.83 16.17C15.08 15.42 14.06 15 13 15H5C3.94 15 2.92 15.42 2.17 16.17C1.42 16.92 1 17.94 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11C11.21 11 13 9.21 13 7C13 4.79 11.21 3 9 3C6.79 3 5 4.79 5 7C5 9.21 6.79 11 9 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C23 18.11 22.7 17.25 22.16 16.55C21.62 15.85 20.86 15.35 20 15.13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.86 3.35 17.62 3.85 18.17 4.55C18.71 5.25 19.01 6.12 19.01 7C19.01 7.89 18.71 8.76 18.17 9.46C17.62 10.16 16.86 10.66 16 10.88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/peer-evaluation",
      active: location.pathname === "/peer-evaluation",
    },
    {
      title: "Reports",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 3H3V21H21V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 8H15V12H9V8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 16H7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 12H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/reports",
      active: location.pathname === "/reports",
    },
    {
      title: "Profile",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20C6 17.79 7.79 16 10 16H14C16.21 16 18 17.79 18 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/profile",
      active: location.pathname === "/profile",
    },
  ];

  return (
    <aside
      className={`${HomePageStyles.sidebar} ${
        isSidebarOpen ? HomePageStyles.sidebarOpen : ""
      }`}
      style={{
        transition: isMobile ? "transform 0.3s ease" : "width 0.3s ease",
      }}
    >
      {/* Sidebar Header */}
      <div className={HomePageStyles.sidebarHeader}>
        {isSidebarOpen && (
          <div className={HomePageStyles.sidebarLogo}>
            <img
              src="/astu_logo.svg"
              alt="ASTU Logo"
              className={HomePageStyles.sidebarLogoImage}
            />
            <div className={HomePageStyles.sidebarTitle}>
              <h3>ASTU Portal</h3>
              <p>Management System</p>
            </div>
          </div>
        )}
        <button
          className={HomePageStyles.sidebarToggle}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isSidebarOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={HomePageStyles.sidebarNav}>
        <ul>
          {navLinks.map((link, index) => (
            <li key={index}>
              <div className={HomePageStyles.navItemContainer}>
                <Link
                  to={link.link}
                  className={`${HomePageStyles.navLink} ${
                    link.active ? HomePageStyles.active : ""
                  }`}
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                    togglePopout(link.title);
                  }}
                >
                  <div className={HomePageStyles.navIcon}>{link.icon}</div>
                  <span>{link.title}</span>
                  {isSidebarOpen && (
                    <svg
                      className={HomePageStyles.chevronIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </Link>
                {isSidebarOpen && activePopout === link.title && (
                  <div className={HomePageStyles.popoutMenu}>
                    <Link
                      to={`${link.link}/details`}
                      className={HomePageStyles.popoutItem}
                    >
                      View Details
                    </Link>
                    <Link
                      to={`${link.link}/settings`}
                      className={HomePageStyles.popoutItem}
                    >
                      Settings
                    </Link>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={HomePageStyles.sidebarFooter}>
        <div className={HomePageStyles.userInfo}>
          <img
            src={user?.avatar || "/default-avatar.svg"}
            alt="User Avatar"
            className={HomePageStyles.userAvatar}
          />
          {isSidebarOpen && (
            <div>
              <h4>{user?.name?.split(" ")[0] || "Guest"}</h4>
              <p>{user?.role || "User"}</p>
            </div>
          )}
        </div>

        {isSidebarOpen && (
          <button
            className={HomePageStyles.logoutButton}
            onClick={() => api.logout()}
            aria-label="Logout"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 17L21 12L16 7M21 12H9M13 5V3H5V21H13V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Logout</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
