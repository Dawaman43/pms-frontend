import api from "../../api";
import styles from "../../pages/TeamLeaderDashboard.module.css";

const Reports = ({ setError, setSuccess }) => {
  const handleGenerateReport = async () => {
    setError("");
    setSuccess("");
    try {
      const report = await api.generatePerformanceReport();
      setSuccess("Team performance report generated successfully!");
      console.log("Performance Report:", report);
    } catch (error) {
      setError(error.message || "Failed to generate report");
    }
  };

  return (
    <section className={styles.reportsSection}>
      <h3 className={styles.sectionTitle}>Performance Reports</h3>
      <button className={styles.submitButton} onClick={handleGenerateReport}>
        Generate Team Report
      </button>
    </section>
  );
};

export default Reports;
