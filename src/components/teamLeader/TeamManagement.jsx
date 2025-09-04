import { useState } from "react";
import api from "../../api";
import styles from "../../pages/TeamLeaderDashboard.module.css";

const TeamManagement = ({ teams, departments, setError, setSuccess }) => {
  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
    leader_id: "",
    department_id: "",
    memberIds: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);

  const handleTeamFormChange = (e) => {
    const { name, value } = e.target;
    setTeamForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTeamEdit = (team) => {
    setIsEditing(true);
    setEditTeamId(team.id);
    setTeamForm({
      name: team.name || "",
      description: team.description || "",
      leader_id: team.leader_id || "",
      department_id: team.department_id || "",
      memberIds: team.members ? team.members.map((m) => m.id).join(",") : "",
    });
  };

  const handleTeamUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (!teamForm.name || !teamForm.leader_id) {
        setError("Team name and leader ID are required");
        return;
      }
      const teamData = {
        ...teamForm,
        memberIds: teamForm.memberIds
          ? teamForm.memberIds
              .split(",")
              .map(Number)
              .filter((id) => !isNaN(id))
          : [],
      };
      await api.updateTeam(editTeamId, teamData);
      setSuccess("Team updated successfully!");
      setIsEditing(false);
      setEditTeamId(null);
      setTeamForm({
        name: "",
        description: "",
        leader_id: "",
        department_id: "",
        memberIds: [],
      });
    } catch (error) {
      setError(error.message || "Failed to update team");
    }
  };

  const handleTeamDelete = async (teamId) => {
    setError("");
    setSuccess("");
    try {
      await api.deleteTeam(teamId);
      setSuccess("Team deleted successfully!");
    } catch (error) {
      setError(error.message || "Failed to delete team");
    }
  };

  const safeTeams = Array.isArray(teams) ? teams : [];
  const safeDepartments = Array.isArray(departments) ? departments : [];

  return (
    <section className={`${styles.teamSection} ${styles.responsiveSection}`}>
      <h3 className={styles.sectionTitle}>Manage Teams</h3>
      {isEditing && (
        <div className={`${styles.formCard} ${styles.responsiveFormCard}`}>
          <h4 className={styles.sectionTitle}>Edit Team</h4>
          <form onSubmit={handleTeamUpdate}>
            <div className={styles.formGroup}>
              <label>Team Name *</label>
              <input
                type="text"
                name="name"
                value={teamForm.name}
                onChange={handleTeamFormChange}
                required
                className={styles.formInput}
                placeholder="Enter team name"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                name="description"
                value={teamForm.description}
                onChange={handleTeamFormChange}
                className={styles.formTextarea}
                placeholder="Enter team description"
                rows="4"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Leader ID *</label>
              <input
                type="text"
                name="leader_id"
                value={teamForm.leader_id}
                onChange={handleTeamFormChange}
                required
                className={styles.formInput}
                placeholder="Enter leader ID"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Department</label>
              <select
                name="department_id"
                value={teamForm.department_id}
                onChange={handleTeamFormChange}
                className={styles.formSelect}
              >
                <option value="">Select Department</option>
                {safeDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Member IDs (comma-separated)</label>
              <input
                type="text"
                name="memberIds"
                value={teamForm.memberIds}
                onChange={handleTeamFormChange}
                placeholder="e.g., 1,2,3"
                className={styles.formInput}
              />
            </div>
            <div className={`${styles.formRow} ${styles.responsiveFormRow}`}>
              <button
                type="submit"
                className={`${styles.submitButton} ${styles.responsiveButton}`}
              >
                Update Team
              </button>
              <button
                type="button"
                className={`${styles.closeButton} ${styles.responsiveButton}`}
                onClick={() => {
                  setIsEditing(false);
                  setEditTeamId(null);
                  setTeamForm({
                    name: "",
                    description: "",
                    leader_id: "",
                    department_id: "",
                    memberIds: [],
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <h3 className={styles.sectionTitle}>Existing Teams</h3>
      {safeTeams.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No teams available to manage.</p>
        </div>
      ) : (
        <div className={`${styles.tableWrapper} ${styles.responsiveTable}`}>
          <table className={`${styles.usersTable} ${styles.responsiveTable}`}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Name</th>
                <th className={styles.tableHeader}>Description</th>
                <th className={styles.tableHeader}>Leader</th>
                <th className={styles.tableHeader}>Department</th>
                <th className={styles.tableHeader}>Members</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {safeTeams.map((team) => (
                <tr key={team.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{team.name}</td>
                  <td className={styles.tableCell}>
                    {team.description || "N/A"}
                  </td>
                  <td className={styles.tableCell}>
                    {team.leaderName || "N/A"}
                  </td>
                  <td className={styles.tableCell}>
                    {team.departmentName || "N/A"}
                  </td>
                  <td className={styles.tableCell}>{team.membersCount}</td>
                  <td
                    className={`${styles.tableCell} ${styles.responsiveFormRow}`}
                  >
                    <button
                      className={`${styles.editButton} ${styles.responsiveButton}`}
                      onClick={() => handleTeamEdit(team)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.closeButton} ${styles.responsiveButton}`}
                      onClick={() => handleTeamDelete(team.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default TeamManagement;
