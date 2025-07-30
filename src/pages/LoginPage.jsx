"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from "./LoginPage.module.css"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "teacher",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Store user role in localStorage for role-based routing
      localStorage.setItem("userRole", formData.role)
      localStorage.setItem("authToken", "dummy-token")

      // Redirect based on role
      if (formData.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    }, 1500)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginSidebar}>
          <div className={styles.brandContent}>
            <div className={styles.brandLogo}>
              <img src="/astu_logo.svg?height=80&width=80&text=ASTU" alt="ASTU Logo" className={styles.logoImage} />
              <h1 className={styles.brandTitle}>ASTU</h1>
            </div>
            <p className={styles.brandDescription}>
              Welcome to Adama Science & Technology University's Performance Management System. Monitor, evaluate, and enhance academic excellence.
            </p>
          </div>
        </div>

        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Log in to your account</h2>
            <p className={styles.loginSubtitle}>Enter your credentials below</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
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
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your password"
                  required
                />
                <button 
                  type="button" 
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.forgotPassword}>
              <Link to="/forgot-password" className={styles.link}>
                Forgot your password?
              </Link>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="role" className={styles.label}>Login As</label>
              <div className={styles.roleSelector}>
                <select id="role" name="role" value={formData.role} onChange={handleInputChange} className={styles.select}>
                  <option value="teacher">Teacher</option>
                  <option value="academic_worker">Academic Worker</option>
                  <option value="admin">Administrator</option>
                </select>
                <svg className={styles.selectArrow} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <button type="submit" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? (
                <span className={styles.loadingSpinner}>
                  <span className={styles.spinner}></span>
                  <span>Signing In...</span>
                </span>
              ) : (
                "Sign in with email"
              )}
            </button>

            <div className={styles.signupPrompt}>
              <span>Don't have an account? </span>
              <Link to="/signup" className={styles.signupLink}>
                Sign up
              </Link>
            </div>

            <div className={styles.demoSection}>
              <p className={styles.demoTitle}>Quick Demo Access:</p>
              <div className={styles.demoButtons}>
                <button
                  type="button"
                  className={styles.demoButton}
                  onClick={() => {
                    setFormData({ email: "admin@astu.edu.et", password: "admin123", role: "admin" })
                  }}
                >
                  <svg className={styles.demoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Admin Demo
                </button>
                <button
                  type="button"
                  className={styles.demoButton}
                  onClick={() => {
                    setFormData({ email: "teacher@astu.edu.et", password: "teacher123", role: "teacher" })
                  }}
                >
                  <svg className={styles.demoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  Teacher Demo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage