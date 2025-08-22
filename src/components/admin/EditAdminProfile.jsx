import { useState } from "react";
import styles from "../../pages/AdminDashboard.module.css";

const EditAdminProfile = ({
  adminForm,
  setAdminForm,
  handleAdminFormChange,
  handleImageUpload,
  handleUpdateAdmin,
  error,
  success,
  setIsEditingAdmin,
  admin,
}) => {
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();

    const isPasswordChangeAttempted =
      adminForm.oldPassword && adminForm.password && confirmPassword;

    if (isPasswordChangeAttempted && adminForm.password !== confirmPassword) {
      alert("New password and confirm password must match.");
      return;
    }

    const updatedAdminForm = { ...adminForm };

    if (!isPasswordChangeAttempted) {
      updatedAdminForm.oldPassword = "";
      updatedAdminForm.password = "";
    }

    updatedAdminForm.role = "admin";
    updatedAdminForm.department = null;

    handleUpdateAdmin(updatedAdminForm);
  };

  return (
    <div className={styles.editAdminContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Edit Admin Profile</h3>
          <button
            className={styles.closeButton}
            onClick={() => {
              setIsEditingAdmin(false);
              setConfirmPassword("");
            }}
          >
            Cancel
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <form onSubmit={onSubmit} className={styles.registerForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={adminForm.name || ""}
                onChange={handleAdminFormChange}
                style={{ color: "#1a202c" }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={adminForm.email || ""}
                onChange={handleAdminFormChange}
                style={{ color: "#1a202c" }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Old Password (required only for password change)</label>
              <input
                type="password"
                name="oldPassword"
                value={adminForm.oldPassword || ""}
                onChange={handleAdminFormChange}
                placeholder="Enter old password"
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={adminForm.password || ""}
                onChange={handleAdminFormChange}
                placeholder="Enter new password"
                style={{ color: "#1a202c" }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Confirm New Password (optional)</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminProfile;
