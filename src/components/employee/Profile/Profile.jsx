// components/UpdateProfile.jsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./profile.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";

const Profile = ({ employeeId }) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const fetchProfile = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockProfile = {
          name: "Samuel Hailu Demse",
          email: "samuel.hailu@astu.edu.et",
          employeeId: "ASTU-ICT-001",
          department: "Information Communication Technology",
          position: "Software Programmer IV",
          phone: "+251 912 345 678",
          avatar: "/assets/avatar-placeholder.png"
        };
        setProfileData((prev) => ({ ...prev, ...mockProfile }));
        setLoading(false);
      }, 500);
    };
    fetchProfile();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      
      if (profileData.newPassword.length > 0 && profileData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Profile updated:", profileData);
      setSuccess("Profile updated successfully!");
      setIsSubmitting(false);
      setTimeout(() => setSuccess(""), 5000);
      
      // Clear password fields after successful update
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 1000);
  };

  if (loading) {
    return (
      <div className={HomePageStyles.homeContainer}>
        <header className={HomePageStyles.header}>
          <div className={HomePageStyles.headerContent}>
            <div className={HomePageStyles.logoSection}>
              <img src="/astu_logo.svg" alt="ASTU Logo" className={HomePageStyles.logo} />
              <div className={HomePageStyles.systemTitle}>
                <h1>Performance Management System</h1>
                <p>Adama Science & Technology University</p>
              </div>
            </div>
            <div className={HomePageStyles.userSection}>
              <div className={HomePageStyles.userInfo}>
                <span className={HomePageStyles.userName}>Samuel Hailu Demse</span>
                <span className={HomePageStyles.userRole}>Software Programmer IV</span>
              </div>
              <div className={HomePageStyles.avatarContainer}>
                <img src="/assets/avatar-placeholder.png" alt="User Avatar" className={HomePageStyles.userAvatar} />
                <div className={HomePageStyles.statusIndicator}></div>
              </div>
            </div>
          </div>
        </header>
        
        <main className={HomePageStyles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading profile information...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={HomePageStyles.homeContainer}>
      {/* Header */}
      <header className={HomePageStyles.header}>
        <div className={HomePageStyles.headerContent}>
          <div className={HomePageStyles.logoSection}>
            <img src="/astu_logo.svg" alt="ASTU Logo" className={HomePageStyles.logo} />
            <div className={HomePageStyles.systemTitle}>
              <h1>Performance Management System</h1>
              <p>Adama Science & Technology University</p>
            </div>
          </div>
          <div className={HomePageStyles.userSection}>
            <div className={HomePageStyles.userInfo}>
              <span className={HomePageStyles.userName}>{profileData.name}</span>
              <span className={HomePageStyles.userRole}>{profileData.position}</span>
            </div>
            <div className={HomePageStyles.avatarContainer}>
              <img src={profileData.avatar} alt="User Avatar" className={HomePageStyles.userAvatar} />
              <div className={HomePageStyles.statusIndicator}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={HomePageStyles.mainContent}>
        <section className={styles.contentSection}>
          <div className={styles.headerSection}>
            <h2 className={styles.pageTitle}>Update Profile</h2>
            <p className={styles.pageSubtitle}>Manage your personal and account information</p>
          </div>
          
          {success && (
            <div className={styles.successMessage}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.profileForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.name ? styles.errorInput : ''}`}
                  required
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
                  required
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className={styles.formInput}
                  placeholder="+251 ___ ___ ___"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Employee ID</label>
                <input
                  type="text"
                  name="employeeId"
                  value={profileData.employeeId}
                  className={styles.formInput}
                  disabled
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Department</label>
                <input
                  type="text"
                  name="department"
                  value={profileData.department}
                  className={styles.formInput}
                  disabled
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Position</label>
                <input
                  type="text"
                  name="position"
                  value={profileData.position}
                  className={styles.formInput}
                  disabled
                />
              </div>
            </div>

            <div className={styles.passwordSection}>
              <h3 className={styles.sectionTitle}>Password Update</h3>
              <p className={styles.sectionSubtitle}>Leave blank if you don't want to change your password</p>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Current Password</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.currentPassword ? styles.errorInput : ''}`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className={styles.passwordToggle}
                    >
                      {showPassword.current ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && <span className={styles.errorText}>{errors.currentPassword}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>New Password</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.newPassword ? styles.errorInput : ''}`}
                      placeholder="Enter new password (min 8 chars)"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className={styles.passwordToggle}
                    >
                      {showPassword.new ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.newPassword && <span className={styles.errorText}>{errors.newPassword}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Confirm New Password</label>
                  <div className={styles.passwordInputWrapper}>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleChange}
                      className={`${styles.formInput} ${errors.confirmPassword ? styles.errorInput : ''}`}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className={styles.passwordToggle}
                    >
                      {showPassword.confirm ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <Link to="/" className={styles.cancelButton}>
                Cancel
              </Link>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className={styles.spinner} viewBox="0 0 50 50">
                      <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer className={HomePageStyles.footer}>
        <div className={HomePageStyles.footerContent}>
          <p>&copy; {new Date().getFullYear()} Adama Science & Technology University. All rights reserved.</p>
          <div className={HomePageStyles.footerLinks}>
            <Link to="/help">Help</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;