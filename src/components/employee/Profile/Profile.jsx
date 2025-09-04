"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api";
import styles from "./profile.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";
import Sidebar from "../sidebar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePopout, setActivePopout] = useState(null);
  const location = useLocation();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    employeeId: "",
    position: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const navLinks = [
    {
      title: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/home",
      active: location.pathname === "/home" || location.pathname === "/",
    },
    {
      title: "Self Assessment",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 8V12L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/self-assessment",
      active: location.pathname === "/self-assessment",
    },
    {
      title: "Peer Evaluation",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/peer-evaluation",
      active: location.pathname === "/peer-evaluation",
    },
    {
      title: "Reports",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 3H3V21H21V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 8H15V12H9V8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 16H7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 12H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/reports",
      active: location.pathname === "/reports",
    },
    {
      title: "Profile",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/profile",
      active: location.pathname === "/profile",
    },
    {
      title: "Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15C19.2669 15.3016 19.227 15.6363 19.2849 15.9606C19.3427 16.2849 19.4962 16.5836 19.725 16.8175C19.9538 17.0514 20.2473 17.2095 20.566 17.2709C20.8847 17.3323 21.2181 17.2943 21.52 17.16C22.3806 16.7591 23.1054 16.1044 23.5992 15.2836C24.0931 14.4628 24.3331 13.5124 24.29 12.555C24.3331 11.5976 24.0931 10.6472 23.5992 9.82639C23.1054 9.00555 22.3806 8.35093 21.52 7.95C21.2181 7.81567 20.8847 7.77774 20.566 7.83911C20.2473 7.90048 19.9538 8.05862 19.725 8.29251C19.4962 8.5264 19.3427 8.82514 19.2849 9.14944C19.227 9.47374 19.2669 9.80843 19.4 10.11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 8.85C4.73309 8.54843 4.77297 8.21374 4.71513 7.88944C4.65729 7.56514 4.50383 7.2664 4.27504 7.03251C4.04624 6.79862 3.75275 6.64048 3.43402 6.57911C3.11529 6.51774 2.78192 6.55567 2.48 6.69C1.61943 7.09094 0.894552 7.74556 0.400795 8.56639C-0.0930599 9.38723 -0.333065 10.3376 -0.29 11.295C-0.333065 12.2524 -0.0930599 13.2028 0.400795 14.0236C0.894552 14.8444 1.61943 15.4991 2.48 15.9C2.78192 16.0343 3.11529 16.0723 3.43402 16.0109C3.75275 15.9495 4.04624 15.7914 4.27504 15.5575C4.50383 15.3236 4.65729 15.0249 4.71513 14.7006C4.77297 14.3763 4.73309 14.0416 4.6 13.74"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/settings",
      active: location.pathname === "/settings",
    },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const tokenData = localStorage.getItem("userData");
        if (!tokenData) {
          setErrors({ general: "User not logged in. Please log in again." });
          return;
        }
        const userData = JSON.parse(tokenData);
        const response = await api.getUserById(userData.id);
        if (!response || !response.id) {
          throw new Error("Invalid user data received from server");
        }
        const userInfo = {
          id: response.id,
          name: response.name || "Unknown User",
          email: response.email || "",
          role: response.role || "User",
          position: response.jobTitle || "Employee",
          avatar: response.profileImage
            ? `${response.profileImage}`
            : "/assets/avatar-placeholder.png",
          employeeId: response.id || "",
          phone: response.phone || "",
        };
        setUser(userInfo);
        setProfileData({
          name: response.name || "",
          email: response.email || "",
          employeeId: response.id || "",
          position: response.jobTitle || "",
          phone: response.phone || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          profilePicture: null,
        });
        setImagePreview(
          response.profileImage
            ? `${response.profileImage}`
            : "/assets/avatar-placeholder.png"
        );
      } catch (error) {
        console.error("Error fetching user:", error);
        setErrors({ general: error.message || "Failed to fetch user data" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      const file = files[0];
      setProfileData((prev) => ({ ...prev, profilePicture: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(user?.avatar || "/assets/avatar-placeholder.png");
      }
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profileData.name) newErrors.name = "Name is required";
    if (!profileData.email) newErrors.email = "Email is required";
    if (profileData.newPassword || profileData.confirmPassword) {
      if (profileData.newPassword.length < 8) {
        newErrors.newPassword = "New password must be at least 8 characters";
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!profileData.currentPassword) {
        newErrors.currentPassword =
          "Current password is required to change password";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccess("");
    setErrors({});

    try {
      const userData = {
        name: profileData.name,
        email: profileData.email,
        jobTitle: profileData.position,
        phone: profileData.phone,
      };

      await api.updateUser(user.id, userData);

      if (profileData.profilePicture) {
        await api.uploadProfilePicture(user.id, profileData.profilePicture);
      }

      if (profileData.newPassword && profileData.currentPassword) {
        await api.updateUserPassword(
          user.id,
          profileData.currentPassword,
          profileData.newPassword
        );
      }

      setSuccess("Profile updated successfully");
      setProfileData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        profilePicture: null,
      }));
      setImagePreview(user?.avatar || "/assets/avatar-placeholder.png");

      // Refresh user data
      const response = await api.getUserById(user.id);
      const updatedUser = {
        id: response.id,
        name: response.name || "Unknown User",
        email: response.email || "",
        role: response.role || "User",
        position: response.jobTitle || "Employee",
        avatar: response.profileImage
          ? `${response.profileImage}`
          : "/assets/avatar-placeholder.png",
        employeeId: response.id || "",
        phone: response.phone || "",
      };
      setUser(updatedUser);
    } catch (error) {
      setErrors({ general: error.message || "Failed to update profile" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <span>Loading...</span>
      </div>
    );
  }

  if (errors.general) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill="currentColor"
            />
          </svg>
          {errors.general}
        </div>
        <Link to="/login" className={styles.loginButton}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar
        user={user}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        navLinks={navLinks}
        activePopout={activePopout}
        setActivePopout={setActivePopout}
      />
      <div
        className={`${styles.mainContent} ${
          isSidebarOpen && !isMobile
            ? HomePageStyles.mainWrapper
            : HomePageStyles.mainWrapperFull
        }`}
      >
        <header className={styles.header}>
          <div className={HomePageStyles.headerContent}>
            {isMobile && (
              <button
                className={HomePageStyles.mobileMenuButton}
                onClick={toggleSidebar}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 12H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <h1 className={styles.pageTitle}>Profile</h1>
            <div className={HomePageStyles.userSection}>
              <div className={HomePageStyles.userInfo}>
                <span className={HomePageStyles.userName}>{user?.name}</span>
                <span className={HomePageStyles.userRole}>{user?.role}</span>
              </div>
              <div className={HomePageStyles.avatarContainer}>
                <img
                  src={user?.avatar || "/assets/avatar-placeholder.png"}
                  alt="User avatar"
                  className={HomePageStyles.userAvatar}
                />
                <span className={HomePageStyles.statusIndicator}></span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.profileSection}>
            {success && (
              <div className={styles.successMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {success}
              </div>
            )}
            {errors.general && (
              <div className={styles.errorMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="currentColor"
                  />
                </svg>
                {errors.general}
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.profileForm}>
              <div className={styles.formHeader}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>
                <p className={styles.sectionSubtitle}>
                  Update your personal details below
                </p>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formColumn}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Profile Picture
                      <input
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleChange}
                        className={styles.fileInput}
                      />
                    </label>
                    <div className={styles.avatarPreview}>
                      <img
                        src={imagePreview || "/assets/avatar-placeholder.png"}
                        alt="Profile preview"
                        className={styles.avatarImage}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={`${styles.formLabel} ${styles.required}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name || ""}
                      onChange={handleChange}
                      className={`${styles.formInput} ${
                        errors.name ? styles.errorInput : ""
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <span className={styles.errorText}>{errors.name}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={`${styles.formLabel} ${styles.required}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email || ""}
                      onChange={handleChange}
                      className={`${styles.formInput} ${
                        errors.email ? styles.errorInput : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <span className={styles.errorText}>{errors.email}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={profileData.employeeId || ""}
                      onChange={handleChange}
                      className={styles.formInput}
                      disabled
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Position</label>
                    <input
                      type="text"
                      name="position"
                      value={profileData.position || ""}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="Enter your position"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone || ""}
                      onChange={handleChange}
                      className={styles.formInput}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className={styles.formColumn}>
                  <div className={styles.passwordSection}>
                    <h2 className={styles.sectionTitle}>Change Password</h2>
                    <p className={styles.sectionSubtitle}>
                      Update your password for enhanced security
                    </p>
                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.formLabel} ${styles.required}`}
                      >
                        Current Password
                      </label>
                      <div className={styles.passwordInputWrapper}>
                        <input
                          type={showPassword.current ? "text" : "password"}
                          name="currentPassword"
                          value={profileData.currentPassword || ""}
                          onChange={handleChange}
                          className={`${styles.formInput} ${
                            errors.currentPassword ? styles.errorInput : ""
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className={styles.passwordToggle}
                        >
                          {showPassword.current ? (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M1 1L23 23"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <span className={styles.errorText}>
                          {errors.currentPassword}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>New Password</label>
                      <div className={styles.passwordInputWrapper}>
                        <input
                          type={showPassword.new ? "text" : "password"}
                          name="newPassword"
                          value={profileData.newPassword || ""}
                          onChange={handleChange}
                          className={`${styles.formInput} ${
                            errors.newPassword ? styles.errorInput : ""
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className={styles.passwordToggle}
                        >
                          {showPassword.new ? (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M1 1L23 23"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <span className={styles.errorText}>
                          {errors.newPassword}
                        </span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Confirm New Password
                      </label>
                      <div className={styles.passwordInputWrapper}>
                        <input
                          type={showPassword.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={profileData.confirmPassword || ""}
                          onChange={handleChange}
                          className={`${styles.formInput} ${
                            errors.confirmPassword ? styles.errorInput : ""
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className={styles.passwordToggle}
                        >
                          {showPassword.confirm ? (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M1 1L23 23"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <span className={styles.errorText}>
                          {errors.confirmPassword}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <Link to="/home" className={styles.cancelButton}>
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
                        <circle
                          className={styles.path}
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          strokeWidth="5"
                        ></circle>
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

        <footer className={HomePageStyles.footer}>
          <div className={HomePageStyles.footerContent}>
            <p>
              &copy; {new Date().getFullYear()} Adama Science & Technology
              University. All rights reserved.
            </p>
            <div className={HomePageStyles.footerLinks}>
              <Link to="/help">Help</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Profile;
