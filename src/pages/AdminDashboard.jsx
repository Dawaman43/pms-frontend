"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./DashboardPage.module.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [employees, setEmployees] = useState([])
  const [teams, setTeams] = useState([
    { id: 1, name: "ICT Department", leader: "Dr. Samuel Hailu", members: 12 },
    { id: 2, name: "Computer Science", leader: "Dr. Banchirga Nurye", members: 8 },
    { id: 3, name: "Administration", leader: "Dr. Daniel Asfaw", members: 5 }
  ])
  const [newTeam, setNewTeam] = useState({ name: "", leader: "" })

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
    "Academic Affairs"
  ]

  // Job levels
  const jobLevels = [
    "I - Entry Level",
    "II - Intermediate",
    "III - Professional",
    "IV - Senior Professional",
    "V - Lead",
    "VI - Manager",
    "VII - Director"
  ]

  // Employee registration form state
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    jobTitle: "",
    level: "",
    email: "",
    department: "",
    team: ""
  })
  const [password, setPassword] = useState("")
  const [isGenerated, setIsGenerated] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Handle employee form input changes
  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target
    setEmployeeForm(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
  }

  // Generate password for new employee
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%"
    let newPassword = ""
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(newPassword)
    setIsGenerated(true)
  }

  // Copy password to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    alert("Password copied to clipboard!")
  }

  // Register new employee
  const registerEmployee = (e) => {
    e.preventDefault()
    
    if (!isGenerated) {
      setError("Please generate a password first")
      return
    }
    
    if (!employeeForm.name || !employeeForm.email || !employeeForm.jobTitle || !employeeForm.department) {
      setError("Please fill all required fields")
      return
    }

    const newEmployee = {
      id: Date.now(),
      ...employeeForm,
      password,
      status: "active",
      dateRegistered: new Date().toISOString().split('T')[0]
    }

    setEmployees([...employees, newEmployee])
    setSuccess("Employee registered successfully!")
    
    // Reset form
    setEmployeeForm({
      name: "",
      jobTitle: "",
      level: "",
      email: "",
      department: "",
      team: ""
    })
    setPassword("")
    setIsGenerated(false)
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(""), 5000)
  }

  // Create new team
  const createTeam = (e) => {
    e.preventDefault()
    
    if (!newTeam.name || !newTeam.leader) {
      setError("Please provide team name and leader")
      return
    }

    const team = {
      id: Date.now(),
      name: newTeam.name,
      leader: newTeam.leader,
      members: 0,
      dateCreated: new Date().toISOString().split('T')[0]
    }

    setTeams([...teams, team])
    setNewTeam({ name: "", leader: "" })
    setSuccess("Team created successfully!")
    
    setTimeout(() => setSuccess(""), 5000)
  }

  // Menu items for admin dashboard
  const menuItems = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "register", label: "Register Employee", icon: "user-plus" },
    { id: "teams", label: "Team Management", icon: "users" },
    { id: "employees", label: "Employee List", icon: "list" },
    { id: "reports", label: "Reports", icon: "chart" }
  ]

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
                    <span className={styles.activityMeta}>
                      System • 2 hours ago
                    </span>
                  </div>
                  <div className={styles.activityStatus}>
                    <span className={`${styles.statusBadge} ${styles.success}`}>
                      completed
                    </span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <h4>Employee Registered</h4>
                    <p>Samuel Hailu has been registered to ICT Department</p>
                    <span className={styles.activityMeta}>
                      Dr. Bekele • 4 hours ago
                    </span>
                  </div>
                  <div className={styles.activityStatus}>
                    <span className={`${styles.statusBadge} ${styles.success}`}>
                      completed
                    </span>
                  </div>
                </div>
                <div className={styles.activityItem}>
                  <div className={styles.activityInfo}>
                    <h4>Team Assignment</h4>
                    <p>5 employees need team assignments</p>
                    <span className={styles.activityMeta}>
                      System • 6 hours ago
                    </span>
                  </div>
                  <div className={styles.activityStatus}>
                    <span className={`${styles.statusBadge} ${styles.warning}`}>
                      pending
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "register":
        return (
          <div className={styles.registrationContainer}>
            <div className={styles.registrationHeader}>
              <h3>Register New Employee</h3>
              <p className={styles.registrationSubtitle}>Fill in the details below to create a new employee account</p>
            </div>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            
            <form onSubmit={registerEmployee} className={styles.registrationForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={employeeForm.name}
                    onChange={handleEmployeeInputChange}
                    className={styles.formInput}
                    placeholder="Enter employee's full name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Job Title *</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={employeeForm.jobTitle}
                    onChange={handleEmployeeInputChange}
                    className={styles.formInput}
                    placeholder="e.g. Software Engineer"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Job Level</label>
                  <select
                    name="level"
                    value={employeeForm.level}
                    onChange={handleEmployeeInputChange}
                    className={styles.formSelect}
                  >
                    <option value="">Select job level</option>
                    {jobLevels.map((level, index) => (
                      <option key={index} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department *</label>
                  <select
                    name="department"
                    value={employeeForm.department}
                    onChange={handleEmployeeInputChange}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Team</label>
                  <select
                    name="team"
                    value={employeeForm.team}
                    onChange={handleEmployeeInputChange}
                    className={styles.formSelect}
                  >
                    <option value="">Select team (optional)</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={employeeForm.email}
                    onChange={handleEmployeeInputChange}
                    className={styles.formInput}
                    placeholder="employee@astu.edu.et"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Temporary Password</label>
                  <div className={styles.passwordContainer}>
                    <input
                      type="text"
                      value={password}
                      readOnly
                      className={styles.passwordInput}
                      placeholder="Click generate to create password"
                    />
                    <div className={styles.passwordActions}>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className={styles.generateButton}
                      >
                        Generate
                      </button>
                      {password && (
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className={styles.copyButton}
                          title="Copy to clipboard"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={styles.passwordStrength}>
                    {password && (
                      <>
                        <span className={password.length >= 10 ? styles.strong : styles.weak}>
                          Password strength: {password.length >= 10 ? "Strong" : "Weak"}
                        </span>
                        <span className={styles.passwordHint}>
                          The password will be shown only once
                        </span>
                      </>
                    )}
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

      case "teams":
        return (
          <div className={styles.usersContent}>
            <div className={styles.usersHeader}>
              <h2>Team Management</h2>
              <button 
                className={styles.createButton}
                onClick={() => setActiveTab("createTeam")}
              >
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
        return (
          <div className={styles.usersContent}>
            <div className={styles.usersHeader}>
              <h2>Employee List</h2>
              <div className={styles.userFilters}>
                <select className={styles.filterSelect}>
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
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
                        <td>
                          <span className={`${styles.statusBadge} ${styles.active}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td>
                          <div className={styles.userActions}>
                            <button className={styles.viewButton}>View</button>
                            <button className={styles.editButton}>Edit</button>
                            <button className={styles.assignButton}>Assign</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.noData}>
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
            <h2>System Reports & Analytics</h2>
            <div className={styles.reportsGrid}>
              <div className={styles.reportCard}>
                <h3>Employee Performance</h3>
                <p>Comprehensive performance analysis across all departments</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>Team Productivity</h3>
                <p>Track team performance and productivity metrics</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>Department Comparison</h3>
                <p>Compare performance metrics across departments</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>Registration Trends</h3>
                <p>Track new employee registration and onboarding</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
            </div>
          </div>
        )

      case "createTeam":
        return (
          <div className={styles.registrationContainer}>
            <div className={styles.registrationHeader}>
              <h3>Create New Team</h3>
              <p className={styles.registrationSubtitle}>Define a new team and assign a team leader</p>
            </div>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            
            <form onSubmit={createTeam} className={styles.registrationForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Team Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    className={styles.formInput}
                    placeholder="Enter team name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Team Leader *</label>
                  <input
                    type="text"
                    name="leader"
                    value={newTeam.leader}
                    onChange={(e) => setNewTeam({...newTeam, leader: e.target.value})}
                    className={styles.formInput}
                    placeholder="Enter team leader's name"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department</label>
                  <select
                    name="department"
                    value={newTeam.department}
                    onChange={(e) => setNewTeam({...newTeam, department: e.target.value})}
                    className={styles.formSelect}
                  >
                    <option value="">Select department (optional)</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setActiveTab("teams")}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Create Team
                </button>
              </div>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <img src="/astu_logo.svg?height=50&width=50&text=ASTU" alt="ASTU Logo" className={styles.logo} />
            <div className={styles.systemTitle}>
              <h1>Performance Management System</h1>
              <p>Adama Science & Technology University</p>
            </div>
          </div>
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{admin.name}</span>
              <span className={styles.userRole}>{admin.role}</span>
            </div>
            <img src={admin.avatar || "/placeholder.svg"} alt="User Avatar" className={styles.userAvatar} />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navTabs}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navTab} ${activeTab === item.id ? styles.active : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

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
  )
}

export default AdminDashboard