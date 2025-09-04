import { useState, useEffect } from "react";
import styles from "./pagesAdminDashboard.module.css";
import api from "../../api";

const TeamManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({
    id: "",
    name: "",
    department_id: "",
    leader_id: "",
    members: [],
  });
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await api.getAllDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch all teams
  const refreshTeams = async () => {
    try {
      const data = await api.getAllTeams();
      setTeams(data);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  useEffect(() => {
    refreshTeams();
  }, []);

  // Fetch team leaders and staff when department changes
  useEffect(() => {
    const fetchUsersByDept = async () => {
      if (!newTeam.department_id) {
        setTeamLeaders([]);
        setStaffMembers([]);
        return;
      }

      setIsLoading(true);
      try {
        const leaders = await api.getTeamLeadersByDepartment(
          newTeam.department_id
        );
        const staff = await api.getStaffByDepartment(newTeam.department_id);

        setTeamLeaders(Array.isArray(leaders) ? leaders : []);
        setStaffMembers(Array.isArray(staff) ? staff : []);

        // Reset leader and members when department changes
        setNewTeam((prev) => ({ ...prev, leader_id: "", members: [] }));
      } catch (err) {
        console.error("Error fetching users by department:", err);
        setTeamLeaders([]);
        setStaffMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersByDept();
  }, [newTeam.department_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTeam((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberToggle = (member) => {
    setNewTeam((prev) => {
      const members = prev.members || [];
      const exists = members.find((m) => m.id === member.id);
      if (exists) {
        return { ...prev, members: members.filter((m) => m.id !== member.id) };
      } else {
        return { ...prev, members: [...members, member] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const { members, ...teamCore } = newTeam;
      const memberIds = members.map((m) => m.id);

      if (newTeam.id) {
        await api.updateTeam(newTeam.id, { ...teamCore, memberIds });
        setSuccess("Team updated successfully");
      } else {
        await api.createTeam({ ...teamCore, memberIds });
        setSuccess("Team created successfully");
      }

      await refreshTeams();

      // Reset form
      setNewTeam({
        id: "",
        name: "",
        department_id: "",
        leader_id: "",
        members: [],
      });
    } catch (err) {
      console.error("Error creating/updating team:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamEdit = (team) => {
    setNewTeam({
      id: team.id,
      name: team.name,
      department_id: team.department_id,
      leader_id: team.leader_id,
      members: team.members || [],
    });
  };

  const handleTeamDelete = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await api.deleteTeam(teamId);
      await refreshTeams();
      setSuccess("Team deleted successfully");
    } catch (err) {
      console.error("Error deleting team:", err);
      setError(err.message || "Something went wrong");
    }
  };

  const formatMemberNames = (memberArray) =>
    Array.isArray(memberArray) && memberArray.length > 0
      ? memberArray.map((m) => m.name).join(", ")
      : "No members";

  return (
    <div className={styles.teamsContent}>
      <div className={styles.teamsHeader}>
        <h2>Team Management</h2>
        <p>Create, edit, and manage teams</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      {/* Team Form */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>{newTeam.id ? "Edit Team" : "Create New Team"}</h3>
        </div>
        <form onSubmit={handleSubmit} className={styles.teamForm}>
          <div className={styles.formRow}>
            {/* Department */}
            <div className={styles.formGroup}>
              <label htmlFor="department_id">Department *</label>
              <select
                id="department_id"
                name="department_id"
                value={newTeam.department_id}
                onChange={handleChange}
                required
                className={styles.formSelect}
                disabled={isLoading}
              >
                <option value="">
                  {isLoading ? "Loading departments..." : "Select department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Name */}
            <div className={styles.formGroup}>
              <label htmlFor="name">Team Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={newTeam.name}
                onChange={handleChange}
                required
                className={styles.formInput}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            {/* Team Leader */}
            <div className={styles.formGroup}>
              <label htmlFor="leader_id">Team Leader *</label>
              <select
                id="leader_id"
                name="leader_id"
                value={newTeam.leader_id}
                onChange={handleChange}
                required
                className={styles.formSelect}
                disabled={
                  !newTeam.department_id ||
                  isLoading ||
                  teamLeaders.length === 0
                }
              >
                <option value="">
                  {!newTeam.department_id
                    ? "Select a department first"
                    : isLoading
                    ? "Loading..."
                    : "Select team leader"}
                </option>
                {teamLeaders.map((leader) => (
                  <option key={leader.id} value={leader.id}>
                    {leader.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Team Members */}
            <div className={styles.formGroup}>
              <label>Team Members</label>
              <div className={styles.checkboxGroup}>
                {!newTeam.department_id ? (
                  <p>Select a department first</p>
                ) : isLoading ? (
                  <p>Loading staff...</p>
                ) : staffMembers.length === 0 ? (
                  <p>No staff available</p>
                ) : (
                  staffMembers.map((staff) => (
                    <label key={staff.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={
                          !!newTeam.members.find((m) => m.id === staff.id)
                        }
                        onChange={() => handleMemberToggle(staff)}
                        disabled={staff.team_id && staff.team_id !== newTeam.id}
                      />
                      {staff.name} ({staff.jobTitle || "Staff"})
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {newTeam.id ? "Update Team" : "Create Team"}
            </button>
            {newTeam.id && (
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() =>
                  setNewTeam({
                    id: "",
                    name: "",
                    department_id: "",
                    leader_id: "",
                    members: [],
                  })
                }
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Teams List */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Teams List</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Team Name</th>
                <th>Leader</th>
                <th>Members</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length > 0 ? (
                teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.departmentName || "N/A"}</td>
                    <td>{team.name}</td>
                    <td>{team.leaderName || "N/A"}</td>
                    <td>{formatMemberNames(team.members)}</td>
                    <td>
                      {team.created_at
                        ? new Date(team.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleTeamEdit(team)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleTeamDelete(team.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No teams available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
