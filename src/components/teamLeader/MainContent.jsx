import TeamManagement from "./TeamManagement";
import TeamMembers from "./TeamMembers";
import EvaluationForms from "./EvaluationForms";
import Reports from "./Reports";
import styles from "../../pages/TeamLeaderDashboard.module.css";

const MainContent = ({
  activeTab,
  teamMembers,
  teams,
  evaluations,
  teamStats,
  departments,
  error,
  setError,
  success,
  setSuccess,
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  navigate,
}) => {
  return (
    <main className={styles.mainContent}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      {activeTab === "overview" && (
        <section className={styles.overviewSection}>
          <h2 className={styles.sectionTitle}>Team Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Total Team Members</h3>
              <p>{teamStats.totalMembers}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Evaluations Completed</h3>
              <p>{teamStats.evaluationsCompleted}</p>
            </div>
            <div className={styles.statCard}>
              <h3>Average Team Score</h3>
              <p>{teamStats.averageTeamScore}%</p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "team-management" && (
        <TeamManagement
          teams={teams}
          departments={departments}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}

      {activeTab === "team-members" && (
        <TeamMembers
          teamMembers={teamMembers}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          itemsPerPage={itemsPerPage}
          navigate={navigate}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}

      {activeTab === "evaluation-forms" && (
        <EvaluationForms
          evaluations={evaluations}
          departments={departments}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}

      {activeTab === "reports" && (
        <Reports setError={setError} setSuccess={setSuccess} />
      )}
    </main>
  );
};

export default MainContent;
