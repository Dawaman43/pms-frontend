import { useState } from "react";
import api from "../../api";
import styles from "./pagesAdminDashboard.module.css";

const CreateDepartment = ({ error, success, setDepartments }) => {
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
    description: "",
  });
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDepartmentFormChange = (e) => {
    const { name, value } = e.target;
    setDepartmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentCreation = async (e) => {
    e.preventDefault();
    setLocalError("");
    setLocalSuccess("");
    setIsSubmitting(true);

    if (!departmentForm.name.trim()) {
      setLocalError("Department name is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.createDepartment({
        name: departmentForm.name.trim(),
        description: departmentForm.description.trim(),
      });
      setLocalSuccess("Department created successfully!");
      setDepartmentForm({ name: "", description: "" });

      // Refresh department list
      const departmentsResponse = await api.getAllDepartments();
      setDepartments(departmentsResponse.map((dept) => dept.name));
    } catch (err) {
      setLocalError(
        `Failed to create department: ${err.message || "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setDepartmentForm({ name: "", description: "" });
    setLocalError("");
    setLocalSuccess("");
  };

  return (
    <div className={styles.registerContent}>
      <div className={styles.registerHeader}>
        <h2>Create New Department</h2>
        <p>Add a new department to the system</p>
        <p className={styles.requiredNote}>
          Fields marked with * are required.
        </p>
      </div>

      {(error || localError) && (
        <div className={styles.errorMessage}>{error || localError}</div>
      )}
      {(success || localSuccess) && (
        <div className={styles.successMessage}>{success || localSuccess}</div>
      )}

      <div className={styles.registerFormContainer}>
        <form
          onSubmit={handleDepartmentCreation}
          className={styles.registerForm}
        >
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Department Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={departmentForm.name}
                onChange={handleDepartmentFormChange}
                required
                disabled={isSubmitting}
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={departmentForm.description}
                onChange={handleDepartmentFormChange}
                rows="4"
                disabled={isSubmitting}
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Department"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <footer className={styles.footer}>
        © 2025 Adama Science & Technology Univ
      </footer>
    </div>
  );
};

export default CreateDepartment;
