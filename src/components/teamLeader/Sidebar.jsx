import styles from "../../pages/TeamLeaderDashboard.module.css";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  leader,
}) => {
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
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
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
            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
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
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 2V8H20"
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
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
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
      tabKey: "reports",
      active: activeTab === "reports",
    },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <img
            src="/astu_logo.svg"
            alt="ASTU Logo"
            className={styles.sidebarLogoImage}
          />
          {isSidebarOpen && (
            <div className={styles.sidebarTitle}>
              <h3>Team Leader PMS</h3>
              <p>ASTU</p>
            </div>
          )}
        </div>
        <button className={styles.sidebarToggle} onClick={toggleSidebar}>
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
                d="M4 12H20M20 12L13 5M20 12L13 19"
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
        {isSidebarOpen && (
          <div className={styles.userInfo}>
            <img
              src={leader.avatar || "/placeholder.svg"}
              alt="Leader Avatar"
              className={styles.userAvatar}
            />
            <div className={styles.userDetails}>
              <h4>{leader.name.split(" ")[0]}</h4>
              <p>{leader.role}</p>
            </div>
          </div>
        )}
        {!isSidebarOpen && (
          <div className={styles.userInfoCollapsed}>
            <img
              src={leader.avatar || "/placeholder.svg"}
              alt="Leader Avatar"
              className={styles.userAvatar}
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
