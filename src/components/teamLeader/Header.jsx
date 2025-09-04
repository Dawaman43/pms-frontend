import styles from "../../pages/TeamLeaderDashboard.module.css";

const Header = ({ leader, isMobile, toggleSidebar }) => {
  return (
    <header
      className={styles.header}
      style={{ backgroundColor: "#1a365d", color: "white" }}
    >
      <div className={styles.headerContent}>
        <div className={styles.headerLeft}>
          {isMobile && (
            <button className={styles.mobileMenuButton} onClick={toggleSidebar}>
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
            </button>
          )}
          <div className={styles.systemTitle}>
            <h1>Performance Management System - Team Leader</h1>
            <p>Adama Science & Technology University</p>
          </div>
        </div>
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{leader.name}</span>
            <span className={styles.userRole}>{leader.role}</span>
          </div>
          <div className={styles.avatarContainer}>
            <img
              src={leader.avatar || "/placeholder.svg"}
              alt="Leader Avatar"
              className={styles.userAvatar}
            />
            <div className={styles.statusIndicator}></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
