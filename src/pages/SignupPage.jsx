"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignupPage.module.css";

const SignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "teacher",
    department: "",
    title: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const departments = [
    "Computer Science & Engineering",
    "Electrical & Computer Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Applied Mathematics",
    "Applied Physics",
    "Applied Chemistry",
    "Applied Biology",
    "Management & Economics",
    "Languages & Literature",
    "Human Resources",
    "Administration",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(`Signup failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Error signing up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Personal Information</h3>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Professional Information</h3>
            <div className={styles.inputGroup}>
              <label htmlFor="role" className={styles.label}>Role</label>
              <div className={styles.roleSelector}>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="teacher">Teacher</option>
                  <option value="academic_worker">Academic Worker</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="department" className={styles.label}>Department</label>
              <div className={styles.roleSelector}>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="title" className={styles.label}>Job Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="e.g., Assistant Professor"
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="employeeId" className={styles.label}>Employee ID</label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter employee ID"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Account Security</h3>
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Create a strong password"
                  required
                />
                <button type="button" className={styles.passwordToggle} onClick={togglePasswordVisibility}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Confirm your password"
                  required
                />
                <button type="button" className={styles.passwordToggle} onClick={toggleConfirmPasswordVisibility}>
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className={styles.passwordRequirements}>
              <p className={styles.requirementsTitle}>Password Requirements:</p>
              <ul className={styles.requirementsList}>
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupWrapper}>
        <div className={styles.signupSidebar}>
          <div className={styles.brandContent}>
            <div className={styles.brandLogo}>
              <img src="/astu_logo.svg" alt="ASTU Logo" className={styles.logoImage} />
              <h1 className={styles.brandTitle}>ASTU</h1>
            </div>
            <p className={styles.brandDescription}>
              Join Adama Science & Technology University's Performance Management System. Create your account to start monitoring and evaluating academic performance.
            </p>
          </div>
        </div>

        <div className={styles.signupCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Join ASTU Performance Management System</p>
          </div>

          <div className={styles.progressBar}>
            {[1, 2, 3].map((step) => (
              <div key={step} className={`${styles.progressStep} ${step <= currentStep ? styles.active : ""}`}>
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 ? "Personal" : step === 2 ? "Professional" : "Security"}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            {renderStepContent()}

            <div className={styles.buttonGroup}>
              {currentStep > 1 && (
                <button type="button" onClick={handlePrevious} className={styles.previousButton}>
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button type="button" onClick={handleNext} className={styles.nextButton}>
                  Next
                </button>
              ) : (
                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              )}
            </div>
          </form>

          <div className={styles.loginPrompt}>
            <span>Already have an account? </span>
            <Link to="/login" className={styles.loginLink}>Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
