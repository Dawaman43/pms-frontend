import { useState, useEffect } from "react";
import styles from "./pagesAdminDashboard.module.css";
import api from "../../api";

const RegisterEmployee = ({
  employeeForm,
  setEmployeeForm,
  password,
  isGenerated,
  generatePassword,
  handleImageUpload,
  error,
  success,
}) => {
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const [departments, setDepartments] = useState([]);
  const [jobLevels, setJobLevels] = useState([
    "Junior",
    "Mid-level",
    "Senior",
    "Lead",
    "Manager",
  ]);

  const isTeamLeader = employeeForm.role === "team_leader";

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await api.getAllDepartments();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
        setLocalError("Failed to load departments");
      }
    };
    fetchDepartments();
  }, []);

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeRegistration = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess("");

    // Validation
    if (!isTeamLeader) {
      if (
        !employeeForm.name ||
        !employeeForm.email ||
        !employeeForm.phone ||
        !employeeForm.salary ||
        !employeeForm.address ||
        !employeeForm.emergencyContact ||
        !employeeForm.jobTitle ||
        !employeeForm.level ||
        !employeeForm.department ||
        !employeeForm.role
      ) {
        setLocalError("Please fill out all required fields for staff.");
        return;
      }
    } else {
      if (
        !employeeForm.name ||
        !employeeForm.email ||
        !employeeForm.phone ||
        !employeeForm.salary ||
        !employeeForm.address ||
        !employeeForm.emergencyContact ||
        !employeeForm.role ||
        !employeeForm.department
      ) {
        setLocalError("Please fill out all required fields for Team Leader.");
        return;
      }
    }

    const dataToSubmit = {
      name: employeeForm.name,
      email: employeeForm.email,
      phone: employeeForm.phone,
      salary: employeeForm.salary,
      address: employeeForm.address,
      emergencyContact: employeeForm.emergencyContact,
      department_id: employeeForm.department,
      role: employeeForm.role,
      password,
    };

    if (!isTeamLeader) {
      dataToSubmit.jobTitle = employeeForm.jobTitle;
      dataToSubmit.level = employeeForm.level;
    }

    try {
      await api.createEmployee(dataToSubmit);
      setLocalSuccess("Employee registered successfully!");
      setEmployeeForm({
        name: "",
        jobTitle: "",
        level: "",
        email: "",
        department: "",
        role: "",
        phone: "",
        salary: "",
        address: "",
        emergencyContact: "",
      });
    } catch (err) {
      setLocalError(`Registration failed: ${err.message || "Unknown error"}`);
    }
  };

  return (
    <div className={styles.registerContent}>
      <div className={styles.registerHeader}>
        <h2>Register New Employee</h2>
        <p>Add a new employee to the system</p>
        <p className={styles.requiredNote}>
          {isTeamLeader
            ? "Fields marked with * are required. Job Title and Job Level are not required for Team Leaders."
            : "All fields marked with * are required."}
        </p>
      </div>

      {(error || localError) && (
        <div className={styles.errorMessage}>{error || localError}</div>
      )}
      {(success || localSuccess) && (
        <div className={styles.successMessage}>{success || localSuccess}</div>
      )}

      <form
        onSubmit={handleEmployeeRegistration}
        className={styles.registerForm}
      >
        {/* Name and Email */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={employeeForm.name}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={employeeForm.email}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        {/* Department and Role */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="department">Department *</label>
            <select
              id="department"
              name="department"
              value={employeeForm.department}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formSelect}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={employeeForm.role}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formSelect}
            >
              <option value="">Select role</option>
              <option value="staff">Staff</option>
              <option value="team_leader">Team Leader</option>
            </select>
          </div>
        </div>

        {/* Job Title and Level */}
        {!isTeamLeader && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="jobTitle">Job Title *</label>
              <input
                id="jobTitle"
                type="text"
                name="jobTitle"
                value={employeeForm.jobTitle}
                onChange={handleEmployeeFormChange}
                required
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="level">Job Level *</label>
              <select
                id="level"
                name="level"
                value={employeeForm.level}
                onChange={handleEmployeeFormChange}
                required
                className={styles.formSelect}
              >
                <option value="">Select job level</option>
                {jobLevels.map((level, index) => (
                  <option key={index} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Phone, Salary, Address, Emergency Contact */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={employeeForm.phone}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="salary">Salary *</label>
            <input
              id="salary"
              type="number"
              name="salary"
              value={employeeForm.salary}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address *</label>
            <input
              id="address"
              type="text"
              name="address"
              value={employeeForm.address}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="emergencyContact">Emergency Contact *</label>
            <input
              id="emergencyContact"
              type="text"
              name="emergencyContact"
              value={employeeForm.emergencyContact}
              onChange={handleEmployeeFormChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        {/* Profile Image & Password */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="profileImage">Profile Image</label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password *</label>
            <div className={styles.passwordGroup}>
              <input
                id="password"
                type="text"
                value={password}
                readOnly
                className={styles.formInput}
              />
              <button
                type="button"
                onClick={generatePassword}
                className={styles.generateButton}
              >
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

      <footer className={styles.footer}>
        © 2025 Adama Science & Technology Univ
      </footer>
    </div>
  );
};

export default RegisterEmployee;
