import { useState } from "react";
import api from "../../api";
import styles from "../../pages/TeamLeaderDashboard.module.css";

const TeamMembers = ({
  teamMembers,
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  itemsPerPage,
  navigate,
  setError,
  setSuccess,
}) => {
  const [evaluationData, setEvaluationData] = useState({
    userId: "",
    formId: "",
    scores: [],
  });

  const handleEvaluationSubmit = async (e, memberId) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.submitEvaluation({
        ...evaluationData,
        userId: memberId,
      });
      setSuccess("Evaluation submitted successfully!");
      setEvaluationData({ userId: "", formId: "", scores: [] });
    } catch (error) {
      setError(error.message || "Failed to submit evaluation");
    }
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  return (
    <section className={styles.usersSection}>
      <h3 className={styles.sectionTitle}>Team Members</h3>
      <div className={styles.usersHeader}>
        <input
          type="text"
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Job Title</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.map((member) => (
              <tr key={member.id}>
                <td>{member.name}</td>
                <td>{member.jobTitle || "N/A"}</td>
                <td>{member.email}</td>
                <td>{member.status || "active"}</td>
                <td>
                  <button
                    className={styles.editButton}
                    onClick={() => navigate(`/employee/${member.id}`)}
                  >
                    View
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() =>
                      setEvaluationData({
                        ...evaluationData,
                        userId: member.id,
                      })
                    }
                  >
                    Evaluate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
      {evaluationData.userId && (
        <div className={styles.formCard}>
          <h4>Evaluate Member</h4>
          <form
            onSubmit={(e) => handleEvaluationSubmit(e, evaluationData.userId)}
          >
            <div className={styles.formGroup}>
              <label>Form ID *</label>
              <input
                type="text"
                value={evaluationData.formId}
                onChange={(e) =>
                  setEvaluationData({
                    ...evaluationData,
                    formId: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Scores (JSON format) *</label>
              <textarea
                value={JSON.stringify(evaluationData.scores)}
                onChange={(e) =>
                  setEvaluationData({
                    ...evaluationData,
                    scores: JSON.parse(e.target.value || "[]"),
                  })
                }
                placeholder='[{"criterionId": 1, "value": 5}]'
                required
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Submit Evaluation
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default TeamMembers;
