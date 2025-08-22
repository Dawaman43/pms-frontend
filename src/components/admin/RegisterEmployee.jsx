import styles from "./pagesAdminDashboard.module.css"

const RegisterEmployee = ({
  employeeForm,
  setEmployeeForm,
  password,
  isGenerated,
  generatePassword,
  handleEmployeeFormChange,
  handleImageUpload,
  validateEmail,
  handleEmployeeRegistration,
  teams,
  departments,
  jobLevels,
  error,
  success,
}) => {
  return (
    <div className={styles.registerContent}>
      <div className={styles.registerHeader}>
        <h2>Register New Employee</h2>
        <p>Add a new employee to the system</p>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      <form onSubmit={handleEmployeeRegistration} className={styles.registerForm}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={employeeForm.name}
              onChange={handleEmployeeFormChange}
              required
              style={{ color: '#1a202c' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Profile Image</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={employeeForm.jobTitle}
              onChange={handleEmployeeFormChange}
              required
              style={{ color: '#1a202c' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Job Level *</label>
            <select name="level" value={employeeForm.level} onChange={handleEmployeeFormChange} required style={{ color: '#1a202c' }}>
              <option value="">Select job level</option>
              {jobLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={employeeForm.email}
              onChange={handleEmployeeFormChange}
              required
              style={{ color: '#1a202c' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Department *</label>
            <select name="department" value={employeeForm.department} onChange={handleEmployeeFormChange} required style={{ color: '#1a202c' }}>
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Team Assignment *</label>
            <select name="team" value={employeeForm.team} onChange={handleEmployeeFormChange} required style={{ color: '#1a202c' }}>
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={employeeForm.phone}
              onChange={handleEmployeeFormChange}
              required
              style={{ color: '#1a202c' }}
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Salary *</label>
            <input
              type="text"
              name="salary"
              value={employeeForm.salary}
              onChange={handleEmployeeFormChange}
              required
              style={{ color: '#1a202c' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Address *</label>
            <textarea name="address" value={employeeForm.address} onChange={handleEmployeeFormChange} rows="2" required style={{ color: '#1a202c' }} />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label>Emergency Contact *</label>
            <input
              type="text"
              name="emergencyContact"
              value={employeeForm.emergencyContact}
              onChange={handleEmployeeFormChange}
              required
              style={{ color: '#1a202c' }}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Password *</label>
            <div className={styles.passwordGroup}>
              <input type="text" value={password} readOnly style={{ color: '#1a202c' }} />
              <button type="button" onClick={generatePassword} className={styles.generateButton}>
                {isGenerated ? "Regenerate" : "Generate"} Password
              </button>
            </div>
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Register Employee
          </button>
        </div>
      </form>
    </div>
  )
}

export default RegisterEmployee
