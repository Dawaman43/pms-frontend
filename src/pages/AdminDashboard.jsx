"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./AdminDashboard.module.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Abenezer Abebe",
      jobTitle: "Senior Software Engineer",
      level: "Senior",
      email: "a.a@company.com",
      department: "Engineering",
      team: "Frontend Team",
      status: "active",
      dateRegistered: "2024-01-15",
      phone: "+251 xxx-xxx-xxxx",
      address: "Adama, Oromia, Ethiopia",
      emergencyContact: "Abenezer -+251 xxx-xxx-xxxx",
      salary: "85,000",
      profileImage: null,
    },
    {
      id: 2,
      name: "Aman Abdela",
      jobTitle: "Product Manager",
      level: "Senior",
      email: "a.b@company.com",
      department: "Product",
      team: "Product Strategy",
      status: "active",
      dateRegistered: "2024-02-20",
      phone: "+251 xxx-xxx-xxxx",
      address: "Addis Ababa, Ethiopia",
      emergencyContact: "Aman - +251 xxx-xxx-xxxx",
      salary: "70,000",
      profileImage: null,
    },
    {
      id: 3,
      name: "Baye Balcha",
      jobTitle: "UX Designer",
      level: "Mid-level",
      email: "Bay.@company.com",
      department: "Design",
      team: "Design System",
      status: "active",
      dateRegistered: "2024-03-10",
      phone: "+251 xxx-xxx-xxxx",
      address: "Adama, Oromia, Ethiopia",
      emergencyContact: "Baye - +251 xxx-xxx-xxxx",
      salary: "70,000",
      profileImage: null,
    },
  ])
  const [teams, setTeams] = useState([
    { id: 1, name: "ICT Department", leader: "Dr. Samuel Hailu", members: 12 },
    { id: 2, name: "Computer Science", leader: "Dr. Banchirga Nurye", members: 8 },
    { id: 3, name: "Administration", leader: "Dr. Daniel Asfaw", members: 5 },
  ])
  const [newTeam, setNewTeam] = useState({ name: "", leader: "" })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activePopout, setActivePopout] = useState(null)

  // Admin data
  const [admin] = useState({
    name: "Dr. Bekele Tadesse",
    role: "System Administrator",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=80&width=80&text=Admin",
  })

  // Admin stats
  const [systemStats] = useState({
    totalEmployees: 245,
    activeTeams: 8,
    pendingRegistrations: 12,
    evaluationsThisMonth: 127,
  })

  // Departments data
  const departments = [
    "Information Communication Technology",
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Human Resources",
    "Finance",
    "Administration",
    "Academic Affairs",
  ]

  // Job levels
  const jobLevels = [
    "I - Entry Level",
    "II - Intermediate",
    "III - Professional",
    "IV - Senior Professional",
    "V - Lead",
    "VI - Manager",
    "VII - Director",
  ]

  // Employee registration form state
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    jobTitle: "",
    level: "",
    email: "",
    department: "",
    team: "",
    phone: "",
    address: "",
    emergencyContact: "",
    salary: "",
    profileImage: null,
  })
  const [password, setPassword] = useState("")
  const [isGenerated, setIsGenerated] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isViewingEmployee, setIsViewingEmployee] = useState(false)
  const [isEditingEmployee, setIsEditingEmployee] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const togglePopout = (item) => {
    if (activePopout === item) {
      setActivePopout(null)
    } else {
      setActivePopout(item)
    }
  }

  const navLinks = [
    {
      title: "Overview",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      tabKey: "overview",
      active: activeTab === "overview",
    },
    {
      title: "Register Employee",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="8.5"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="20"
            y1="8"
            x2="20"
            y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="17"
            y1="11"
            x2="23"
            y2="11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      tabKey: "register",
      active: activeTab === "register",
    },
    {
      title: "Team Management",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C23 18.1645 22.7155 17.3541 22.2094 16.6977C21.7033 16.0414 20.9999 15.5759 20.2 15.3805"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8003 3.32548 17.5037 3.79099 18.0098 4.44732C18.5159 5.10364 18.8002 5.91405 18.8002 6.75C18.8002 7.58595 18.5159 8.39636 18.0098 9.05268C17.5037 9.70901 16.8003 10.1745 16 10.37"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      tabKey: "teams",
      active: activeTab === "teams",
    },
    {
      title: "Employee List",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 6H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 12H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 18H3.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      tabKey: "employees",
      active: activeTab === "employees",
    },
    {
      title: "Reports",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="18"
            y1="20"
            x2="18"
            y2="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="20"
            x2="12"
            y2="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="6"
            y1="20"
            x2="6"
            y2="14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      tabKey: "reports",
      active: activeTab === "reports",
    },
  ]

  // Handle employee form input changes
  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target
    setEmployeeForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEmployeeForm((prev) => ({
        ...prev,
        profileImage: file,
      }))
    }
  }

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(password)
    setIsGenerated(true)
  }

  // Handle employee registration
  const handleEmployeeRegistration = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (
      !employeeForm.name ||
      !employeeForm.jobTitle ||
      !employeeForm.level ||
      !employeeForm.email ||
      !employeeForm.department ||
      !employeeForm.team ||
      !employeeForm.phone ||
      !employeeForm.address ||
      !employeeForm.emergencyContact ||
      !employeeForm.salary
    ) {
      setError("All fields including team selection are required")
      return
    }

    if (!password) {
      setError("Please generate a password")
      return
    }

    // Create new employee
    const newEmployee = {
      id: Date.now(),
      ...employeeForm,
      status: "active",
      dateRegistered: new Date().toLocaleDateString(),
    }

    setEmployees((prev) => [...prev, newEmployee])
    setSuccess("Employee registered successfully!")

    // Reset form
    setEmployeeForm({
      name: "",
      jobTitle: "",
      level: "",
      email: "",
      department: "",
      team: "",
      phone: "",
      address: "",
      emergencyContact: "",
      salary: "",
      profileImage: null,
    })
    setPassword("")
    setIsGenerated(false)
  }

  // Handle team creation
  const handleTeamCreation = (e) => {
    e.preventDefault()
    if (!newTeam.name || !newTeam.leader) {
      setError("Team name and leader are required")
      return
    }

    const team = {
      id: Date.now(),
      ...newTeam,
      members: 0,
      dateCreated: new Date().toLocaleDateString(),
    }

    setTeams((prev) => [...prev, team])
    setNewTeam({ name: "", leader: "" })
    setSuccess("Team created successfully!")
    setActiveTab("teams")
  }

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee)
    setIsViewingEmployee(true)
  }

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee)
    setEmployeeForm(employee)
    setIsEditingEmployee(true)
  }

  const handleUpdateEmployee = (e) => {
    e.preventDefault()
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === selectedEmployee.id ? { ...employeeForm, id: selectedEmployee.id } : emp)),
    )
    setIsEditingEmployee(false)
    setSelectedEmployee(null)
    setEmployeeForm({
      name: "",
      jobTitle: "",
      level: "",
      email: "",
      department: "",
      team: "",
      phone: "",
      address: "",
      emergencyContact: "",
      salary: "",
      profileImage: null,
    })
    setSuccess("Employee updated successfully!")
  }

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))
      setSuccess("Employee deleted successfully!")
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.overviewContent}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Total Employees</h3>
                  <p>{systemStats.totalEmployees}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Active Teams</h3>
                  <p>{systemStats.activeTeams}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Pending Registrations</h3>
                  <p>{systemStats.pendingRegistrations}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Evaluations This Month</h3>
                  <p>{systemStats.evaluationsThisMonth}</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Recent Team Activities</h3>
              </div>
              <div className={styles.activitiesList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <h4>New Team Created</h4>
                    <p>Computer Science team has been created with Dr. Banchirga as leader</p>
                    <span className={styles.activityMeta}>System • 2 hours ago</span>
                  </div>
                  <div className={styles.activityStatus}>
                    <span className={`${styles.statusBadge} ${styles.success}`}>completed</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <h4>Employee Registered</h4>
                    <p>Samuel Hailu has been registered to ICT Department</p>
                    <span className={styles.activityMeta}>Dr. Bekele • 4 hours ago</span>
                  </div>
                  <div className={styles.activityStatus}>
                    <span className={`${styles.statusBadge} ${styles.success}`}>completed</span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <h4>Team Assignment</h4>
                    <p>5 employees need team assignments</p>
                    <span className={styles.activityMeta}>System • 6 hours ago</span>
                  </div>
                  <div className={styles.activityStatus}>
                    <span className={`${styles.statusBadge} ${styles.warning}`}>pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "register":
        return (
          <div className={styles.registerContent}>
            <div className={styles.registerHeader}>
              <div className={styles.headerIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={styles.headerText}>
                <h2>Register New Employee</h2>
                <p>Create a comprehensive employee profile with all necessary information</p>
              </div>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

            <form onSubmit={handleEmployeeRegistration} className={styles.registerForm}>
              {/* Profile Image Section */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <h3>Profile Information</h3>
                  <span className={styles.cardDescription}>Upload employee photo and basic details</span>
                </div>
                <div className={styles.imageUploadSection}>
                  <label className={styles.imageUploadLabel}>
                    Profile Image
                    <div className={styles.imageUploadArea}>
                      {employeeForm.profileImage ? (
                        <div className={styles.imagePreview}>
                          <img
                            src={URL.createObjectURL(employeeForm.profileImage) || "/placeholder.svg"}
                            alt="Profile preview"
                            className={styles.previewImage}
                          />
                          <button
                            type="button"
                            onClick={() => setEmployeeForm((prev) => ({ ...prev, profileImage: null }))}
                            className={styles.removeImageButton}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className={styles.uploadPlaceholder}>
                          <div className={styles.uploadIcon}>
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21 15V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V16M17 8L12 3M12 3L7 8M12 3V15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className={styles.uploadText}>
                            <p>
                              Drop your image here, or <span>browse</span>
                            </p>
                            <span>Supports: PNG, JPG (Max 5MB)</span>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={styles.hiddenFileInput}
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <h3>Personal Information</h3>
                  <span className={styles.cardDescription}>Employee's personal and contact details</span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>
                      Full Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={employeeForm.name}
                      onChange={handleEmployeeFormChange}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      Email Address <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={employeeForm.email}
                      onChange={handleEmployeeFormChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      Phone Number <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={employeeForm.phone}
                      onChange={handleEmployeeFormChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      Emergency Contact <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={employeeForm.emergencyContact}
                      onChange={handleEmployeeFormChange}
                      placeholder="Name - Phone Number"
                      required
                    />
                  </div>
                  <div className={styles.formGroup} style={{ gridColumn: "1 / -1" }}>
                    <label>
                      Address <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      name="address"
                      value={employeeForm.address}
                      onChange={handleEmployeeFormChange}
                      placeholder="Enter full address"
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <h3>Professional Information</h3>
                  <span className={styles.cardDescription}>Job role, department, and team assignment</span>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>
                      Job Title <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={employeeForm.jobTitle}
                      onChange={handleEmployeeFormChange}
                      placeholder="Enter job title"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      Job Level <span className={styles.required}>*</span>
                    </label>
                    <select name="level" value={employeeForm.level} onChange={handleEmployeeFormChange} required>
                      <option value="">Select job level</option>
                      {jobLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      Department <span className={styles.required}>*</span>
                    </label>
                    <select
                      name="department"
                      value={employeeForm.department}
                      onChange={handleEmployeeFormChange}
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      Team Assignment <span className={styles.required}>*</span>
                    </label>
                    <select name="team" value={employeeForm.team} onChange={handleEmployeeFormChange} required>
                      <option value="">Select team (Required)</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>
                      Salary <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={employeeForm.salary}
                      onChange={handleEmployeeFormChange}
                      placeholder="Enter salary (e.g., $50,000)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className={styles.formCard}>
                <div className={styles.cardHeader}>
                  <h3>Account Security</h3>
                  <span className={styles.cardDescription}>Generate secure login credentials</span>
                </div>
                <div className={styles.passwordSection}>
                  <div className={styles.passwordGroup}>
                    <label>Generated Password</label>
                    <div className={styles.passwordInputGroup}>
                      <input
                        type="text"
                        value={password}
                        readOnly
                        placeholder="Click 'Generate Password' to create a secure password"
                        className={styles.passwordInput}
                      />
                      <button type="button" onClick={generatePassword} className={styles.generateButton}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M1 4V10H7M23 20V14H17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="8.5"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20 8V14M23 11H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Register Employee
                </button>
              </div>
            </form>
          </div>
        )

      case "teams":
        return (
          <div className={styles.usersContent}>
            <div className={styles.usersHeader}>
              <h2>Team Management</h2>
              <button className={styles.createButton} onClick={() => setActiveTab("createTeam")}>
                Create New Team
              </button>
            </div>

            <div className={styles.usersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Team Leader</th>
                    <th>Members</th>
                    <th>Date Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td className={styles.userName}>{team.name}</td>
                      <td>{team.leader}</td>
                      <td>{team.members}</td>
                      <td>{team.dateCreated}</td>
                      <td>
                        <div className={styles.userActions}>
                          <button className={styles.viewButton}>View</button>
                          <button className={styles.editButton}>Edit</button>
                          <button className={styles.deleteButton}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case "employees":
        if (isViewingEmployee && selectedEmployee) {
          return (
            <div className={styles.employeeDetails}>
              <div className={styles.detailsHeader}>
                <button
                  onClick={() => {
                    setIsViewingEmployee(false)
                    setSelectedEmployee(null)
                  }}
                  className={styles.backButton}
                >
                  ← Back to Employee List
                </button>
                <h2>Employee Details</h2>
              </div>

              <div className={styles.employeeCard}>
                <div className={styles.employeeInfo}>
                  <div className={styles.employeeAvatar}>
                    {selectedEmployee.profileImage ? (
                      <img
                        src={URL.createObjectURL(selectedEmployee.profileImage) || "/placeholder.svg"}
                        alt="Profile"
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>{selectedEmployee.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className={styles.employeeBasicInfo}>
                    <h3>{selectedEmployee.name}</h3>
                    <p>{selectedEmployee.jobTitle}</p>
                    <span className={`${styles.statusBadge} ${styles.active}`}>{selectedEmployee.status}</span>
                  </div>
                </div>

                <div className={styles.employeeDetailsGrid}>
                  <div className={styles.detailItem}>
                    <label>Email:</label>
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Phone:</label>
                    <span>{selectedEmployee.phone}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Department:</label>
                    <span>{selectedEmployee.department}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Team:</label>
                    <span>{selectedEmployee.team}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Level:</label>
                    <span>{selectedEmployee.level}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Salary:</label>
                    <span>{selectedEmployee.salary}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Address:</label>
                    <span>{selectedEmployee.address}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Emergency Contact:</label>
                    <span>{selectedEmployee.emergencyContact}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Date Registered:</label>
                    <span>{selectedEmployee.dateRegistered}</span>
                  </div>
                </div>

                <div className={styles.employeeActions}>
                  <button onClick={() => handleEditEmployee(selectedEmployee)} className={styles.editButton}>
                    Edit Employee
                  </button>
                  <button onClick={() => handleDeleteEmployee(selectedEmployee.id)} className={styles.deleteButton}>
                    Delete Employee
                  </button>
                </div>
              </div>
            </div>
          )
        }

        if (isEditingEmployee && selectedEmployee) {
          return (
            <div className={styles.editEmployeeForm}>
              <div className={styles.detailsHeader}>
                <button
                  onClick={() => {
                    setIsEditingEmployee(false)
                    setSelectedEmployee(null)
                  }}
                  className={styles.backButton}
                >
                  ← Cancel Edit
                </button>
                <h2>Edit Employee</h2>
              </div>

              <form onSubmit={handleUpdateEmployee} className={styles.registerForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={employeeForm.name}
                      onChange={handleEmployeeFormChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Job Title *</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={employeeForm.jobTitle}
                      onChange={handleEmployeeFormChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Job Level *</label>
                    <select name="level" value={employeeForm.level} onChange={handleEmployeeFormChange} required>
                      <option value="">Select job level</option>
                      {jobLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={employeeForm.email}
                      onChange={handleEmployeeFormChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Department *</label>
                    <select
                      name="department"
                      value={employeeForm.department}
                      onChange={handleEmployeeFormChange}
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Team Assignment *</label>
                    <select name="team" value={employeeForm.team} onChange={handleEmployeeFormChange} required>
                      <option value="">Select team (Required)</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={employeeForm.phone}
                      onChange={handleEmployeeFormChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Salary *</label>
                    <input
                      type="text"
                      name="salary"
                      value={employeeForm.salary}
                      onChange={handleEmployeeFormChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Address *</label>
                    <textarea
                      name="address"
                      value={employeeForm.address}
                      onChange={handleEmployeeFormChange}
                      rows="2"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Emergency Contact *</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={employeeForm.emergencyContact}
                      onChange={handleEmployeeFormChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submitButton}>
                    Update Employee
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEmployee(false)
                      setSelectedEmployee(null)
                    }}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )
        }

        return (
          <div className={styles.usersContent}>
            <div className={styles.usersHeader}>
              <h2>Employee List ({employees.length} employees)</h2>
              <div className={styles.userFilters}>
                <select className={styles.filterSelect}>
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <select className={styles.filterSelect}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className={styles.usersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className={styles.userName}>{employee.name}</td>
                        <td>{employee.jobTitle}</td>
                        <td>{employee.department}</td>
                        <td>{employee.team || "Not assigned"}</td>
                        <td>{employee.phone}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${styles.active}`}>{employee.status}</span>
                        </td>
                        <td>
                          <div className={styles.userActions}>
                            <button onClick={() => handleViewEmployee(employee)} className={styles.viewButton}>
                              View
                            </button>
                            <button onClick={() => handleEditEmployee(employee)} className={styles.editButton}>
                              Edit
                            </button>
                            <button onClick={() => handleDeleteEmployee(employee.id)} className={styles.deleteButton}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className={styles.emptyState}>
                        No employees registered yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )

      case "reports":
        return (
          <div className={styles.reportsContent}>
            <div className={styles.reportsHeader}>
              <h2>System Reports</h2>
              <p>Generate and view system reports</p>
            </div>
            <div className={styles.reportsGrid}>
              <div className={styles.reportCard}>
                <h3>Employee Performance Report</h3>
                <p>Generate comprehensive performance reports for all employees</p>
                <button className={styles.generateReportButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>Team Analytics</h3>
                <p>View team performance and collaboration metrics</p>
                <button className={styles.generateReportButton}>View Analytics</button>
              </div>
              <div className={styles.reportCard}>
                <h3>System Usage</h3>
                <p>Monitor system usage and user activity patterns</p>
                <button className={styles.generateReportButton}>View Usage</button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <img src="/astu_logo.svg" alt="ASTU Logo" className={styles.sidebarLogoImage} />
            {isSidebarOpen && (
              <div className={styles.sidebarTitle}>
                <h3>Admin PMS</h3>
                <p>ASTU</p>
              </div>
            )}
          </div>
          <button className={styles.sidebarToggle} onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 12H20M20 12L13 5M20 12L13 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {navLinks.map((link, index) => (
              <li key={index}>
                <div className={styles.navItemContainer}>
                  <button
                    className={`${styles.navLink} ${link.active ? styles.active : ""}`}
                    onClick={() => setActiveTab(link.tabKey)}
                  >
                    <div className={styles.navIcon}>{link.icon}</div>
                    {isSidebarOpen && <span>{link.title}</span>}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {isSidebarOpen && (
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <img src={admin.avatar || "/placeholder.svg"} alt="Admin Avatar" className={styles.userAvatar} />
              <div>
                <h4>{admin.name.split(" ")[0]}</h4>
                <p>{admin.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      <div className={`${styles.mainWrapper} ${!isSidebarOpen ? styles.mainWrapperFull : ""}`}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {isMobile && (
                <button className={styles.mobileMenuButton} onClick={toggleSidebar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M3 12H21M3 6H21M3 18H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <div className={styles.systemTitle}>
                <h1>Performance Management System - Admin</h1>
                <p>Adama Science & Technology University</p>
              </div>
            </div>

            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{admin.name}</span>
                <span className={styles.userRole}>{admin.role}</span>
              </div>
              <div className={styles.avatarContainer}>
                <img src={admin.avatar || "/placeholder.svg"} alt="Admin Avatar" className={styles.userAvatar} />
                <div className={styles.statusIndicator}></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>{renderTabContent()}</main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>&copy; {new Date().getFullYear()} Adama Science & Technology University. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <Link to="/help">Help</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AdminDashboard
