import styles from "./pagesAdminDashboard.module.css";

const Overview = ({ systemStats = {}, recentActivities = [] }) => {
  const {
    totalEmployees = 0,
    activeTeams = 0,
    pendingRegistrations = 0,
    evaluationsThisMonth = 0,
  } = systemStats;

  return (
    <div className={styles.overviewContent}>
      {/* ==== Stats Grid ==== */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Total Employees</h3>
            <p>{totalEmployees.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Active Teams</h3>
            <p>{activeTeams.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Pending Registrations</h3>
            <p>{pendingRegistrations.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statContent}>
            <h3>Evaluations This Month</h3>
            <p>{evaluationsThisMonth.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ==== Recent Activities ==== */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Recent Team Activities</h3>
        </div>
        <div className={styles.activitiesList}>
          {recentActivities && recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className={styles.activityContent}>
                  <p>{activity.description || "No description available"}</p>
                  <span className={styles.activityTime}>
                    {activity.time || "Unknown time"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>No recent activities</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
