import { useState, useEffect } from "react";
import styles from "./pagesAdminDashboard.module.css";

const EditEmployee = ({
  employeeForm,
  handleEmployeeFormChange,
  handleUpdateEmployee,
  setIsEditingEmployee,
  teams,
  departments,
  jobLevels,
  error,
  success,
}) => {
  const [imagePreview, setImagePreview] = useState(
    "/placeholder.svg?height=80&width=80&text=Employee"
  );

  useEffect(() => {
    let objectUrl = null;

    // Set image preview based on employeeForm.profileImage
    if (employeeForm.profileImage) {
      if (typeof employeeForm.profileImage === "string") {
        // URL from server
        setImagePreview(employeeForm.profileImage);
      } else if (employeeForm.profileImage instanceof File) {
        // File object
        objectUrl = URL.createObjectURL(employeeForm.profileImage);
        setImagePreview(objectUrl);
      }
    } else {
      // Fallback to placeholder
      setImagePreview("/placeholder.svg?height=80&width=80&text=Employee");
    }

    // Cleanup object URL on component unmount or when profileImage changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [employeeForm.profileImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleEmployeeFormChange({
      target: { name: "profileImage", value: file || null },
    });
    // No need to set imagePreview here; useEffect handles it
  };

  return (
    <div className={styles.editEmployeeContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Edit Employee</h3>
          <button
            className={styles.closeButton}
            onClick={() => setIsEditingEmployee(false)}
          >
            Cancel
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <form onSubmit={handleUpdateEmployee} className={styles.registerForm}>
          {/* Row 1: Name & Profile Image */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={employeeForm.name}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Profile Image</label>
              <div style={{ marginBottom: "10px" }}>
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              </div>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          {/* Row 2: Job Title & Job Level */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Job Title *</label>
              <input
                type="text"
                name="jobTitle"
                value={employeeForm.jobTitle}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Job Level *</label>
              <select
                name="level"
                value={employeeForm.level}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              >
                <option value="">Select job level</option>
                {jobLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Email & Department */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={employeeForm.email}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Department *</label>
              <select
                name="department"
                value={employeeForm.department}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Team & Phone */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Team Assignment *</label>
              <select
                name="team"
                value={employeeForm.team}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              >
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
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>

          {/* Row 5: Salary & Address */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Salary *</label>
              <input
                type="text"
                name="salary"
                value={employeeForm.salary}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Address *</label>
              <textarea
                name="address"
                value={employeeForm.address}
                onChange={handleEmployeeFormChange}
                rows="2"
                required
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>

          {/* Row 6: Emergency Contact */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Emergency Contact *</label>
              <input
                type="text"
                name="emergencyContact"
                value={employeeForm.emergencyContact}
                onChange={handleEmployeeFormChange}
                required
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Update Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;
