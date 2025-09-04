import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  leader,
}) => {
  const navigate = useNavigate();

  const navLinks = [
    {
      title: "Overview",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
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
      tabKey: "overview",
      active: activeTab === "overview",
    },
    {
      title: "Team Management",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 19V21"
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
      tabKey: "team-management",
      active: activeTab === "team-management",
    },
    {
      title: "Team Members",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="8.5"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      tabKey: "team-members",
      active: activeTab === "team-members",
    },
    {
      title: "Evaluation Forms",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 10H7M21 6H3M21 14H3M21 18H7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      tabKey: "evaluation-forms",
      active: activeTab === "evaluation-forms",
    },
    {
      title: "Reports",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="18"
            y1="20"
            x2="18"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="20"
            x2="12"
            y2="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="6"
            y1="20"
            x2="6"
            y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      tabKey: "reports",
      active: activeTab === "reports",
    },
    {
      title: "Edit Profile",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      tabKey: "edit-profile",
      active: activeTab === "edit-profile",
    },
  ];

  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
              <h3>Team Leader PMS</h3>
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
              <button
                className={`${styles.navLink} ${
                  link.active ? styles.active : ""
                }`}
                onClick={() => setActiveTab(link.tabKey)}
                title={isSidebarOpen ? "" : link.title}
                aria-label={link.title}
              >
                <div className={styles.navIcon}>{link.icon}</div>
                {isSidebarOpen && (
                  <span className={styles.navText}>{link.title}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.sidebarFooter}>
        {isSidebarOpen ? (
          <div className={styles.userInfo}>
            <img
              src={leader.avatar || "/assets/avatar-placeholder.png"}
              alt="Leader Avatar"
              className={styles.userAvatar}
              onError={(e) => {
                e.target.src = "/assets/avatar-placeholder.png";
              }}
            />
            <div className={styles.userDetails}>
              <h4>{leader.name.split(" ")[0]}</h4>
              <p>{leader.role}</p>
            </div>
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
            >
              <svg
                width="20"
                height="20"
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
              src={leader.avatar || "/assets/avatar-placeholder.png"}
              alt="Leader Avatar"
              className={styles.userAvatar}
              onError={(e) => {
                e.target.src = "/assets/avatar-placeholder.png";
              }}
            />
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              title="Log out"
              aria-label="Log out"
            >
              <svg
                width="20"
                height="20"
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
