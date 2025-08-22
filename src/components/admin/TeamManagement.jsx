import styles from "./pagesAdminDashboard.module.css"

const TeamManagement = ({
  teams,
  newTeam,
  setNewTeam,
  handleTeamCreation,
  handleTeamEdit,
  handleTeamUpdate,
  handleTeamDelete,
  error,
  success,
}) => {
  const handleTeamFormChange = (e) => {
    const { name, value } = e.target
    setNewTeam((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className={styles.teamsContent}>
      <div className={styles.teamsHeader}>
        <h2>Team Management</h2>
        <p>Create and manage teams</p>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Create New Team</h3>
        </div>
        <form onSubmit={newTeam.id ? handleTeamUpdate : handleTeamCreation} className={styles.teamForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Team Name *</label>
              <input
                type="text"
                name="name"
                value={newTeam.name}
                onChange={handleTeamFormChange}
                required
                style={{ color: '#1a202c' }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Team Leader *</label>
              <input
                type="text"
                name="leader"
                value={newTeam.leader}
                onChange={handleTeamFormChange}
                required
                style={{ color: '#1a202c' }}
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              {newTeam.id ? "Update Team" : "Create Team"}
            </button>
            {newTeam.id && (
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setNewTeam({ name: "", leader: "" })}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Teams List</h3>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
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
                    <td>{team.name}</td>
                    <td>{team.leader}</td>
                    <td>{team.members}</td>
                    <td>{team.dateCreated}</td>
                    <td>
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
                  <td colSpan="5">No teams available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TeamManagement
