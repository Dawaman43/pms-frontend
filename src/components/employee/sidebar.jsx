"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ user, isSidebarOpen, toggleSidebar }) => {
  const [activePopout, setActivePopout] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
          <circle
            cx="9"
            cy="7"
            r="4"
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
      title: "Team",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 21V19C17 17.94 16.58 16.92 15.83 16.17C15.08 15.42 14.06 15 13 15H5C3.94 15 2.92 15.42 2.17 16.17C1.42 16.92 1 17.94 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C22.99 18.12 22.62 17.27 21.95 16.65C21.28 16.03 20.37 15.66 19.5 15.66"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="17"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/team",
      active: location.pathname === "/team",
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
      title: "Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12.22 2C12.84 2.67 13.29 3.62 14.05 4.18C14.46 4.49 14.95 4.66 15.44 4.67C16.67 4.7 17.84 5.23 18.76 5.99C19.47 6.57 19.95 7.33 20.18 8.18C20.38 8.92 20.38 9.7 20.38 10.47C20.38 11.76 20.84 12.99 21 14.24C21.14 15.18 21.05 16.13 20.73 17.02C20.37 18.04 19.75 18.94 19.02 19.67C18.29 20.4 17.39 21.02 16.37 21.38C15.45 21.7 14.5 21.79 13.56 21.65C12.31 21.49 11.08 21.03 9.83 20.88C9.05 20.78 8.27 20.78 7.5 20.97C6.65 21.2 5.89 21.68 5.31 22.39C4.55 23.31 4.02 24.48 3.99 25.71C3.98 25.85 3.97 26 3.94 26.14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
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
      className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
    >
      <div className={styles.sidebarHeader}>
        {isSidebarOpen && (
          <div className={styles.sidebarLogo}>
            <img
              src="/astu_logo.svg"
              alt="ASTU Logo"
              className={styles.sidebarLogoImage}
            />
            <div className={styles.sidebarTitle}>
              <h3>Employee PMS</h3>
              <p>ASTU</p>
            </div>
          </div>
        )}
        <button
          className={styles.sidebarToggle}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
      <nav className={styles.sidebarNav}>
        <ul>
          {navLinks.map((link, index) => (
            <li key={index} className={styles.navItem}>
              <div className={styles.navLinkWrapper}>
                <Link
                  to={link.link}
                  className={`${styles.navLink} ${
                    link.active ? styles.active : ""
                  }`}
                  onClick={() => {
                    if (isMobile) toggleSidebar();
                    togglePopout(link.title);
                  }}
                >
                  <div className={styles.navIcon}>{link.icon}</div>
                  {isSidebarOpen && (
                    <span className={styles.navText}>{link.title}</span>
                  )}
                  {isSidebarOpen && (
                    <svg
                      className={styles.chevronIcon}
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
                  <div className={styles.popoutMenu}>
                    <Link
                      to={`${link.link}/details`}
                      className={styles.popoutItem}
                    >
                      View Details
                    </Link>
                    <Link
                      to={`${link.link}/settings`}
                      className={styles.popoutItem}
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
      <div className={styles.sidebarFooter}>
        {isSidebarOpen ? (
          <div className={styles.userInfo}>
            <img
              src={user?.avatar || "/default-avatar.svg"}
              alt="User Avatar"
              className={styles.userAvatar}
              onError={(e) => {
                e.target.src = "/default-avatar.svg";
              }}
            />
            <div className={styles.userDetails}>
              <h4>{user?.name?.split(" ")[0] || "Guest"}</h4>
              <p>{user?.role || "User"}</p>
            </div>
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Log out</span>
            </button>
          </div>
        ) : (
          <div className={styles.userInfoCollapsed}>
            <img
              src={user?.avatar || "/default-avatar.svg"}
              alt="User Avatar"
              className={styles.userAvatar}
              onError={(e) => {
                e.target.src = "/default-avatar.svg";
              }}
            />
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
