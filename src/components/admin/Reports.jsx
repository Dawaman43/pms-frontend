import styles from "./pagesAdminDashboard.module.css"

const Reports = ({ handleGenerateReport, error, success }) => {
  return (
    <div className={styles.reportsContent}>
      <div className={styles.reportsHeader}>
        <h2>Reports</h2>
        <p>Generate and view performance reports</p>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Generate Performance Report</h3>
        </div>
        <div className={styles.reportActions}>
          <button
            className={styles.submitButton}
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default Reports
