"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./AdminDashboard.module.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [admin] = useState({
    name: "Dr. Bekele Tadesse",
    role: "System Administrator",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=80&width=80&text=Admin",
  })

  const [systemStats] = useState({
    totalUsers: 245,
    activeEvaluations: 18,
    completedEvaluations: 127,
    pendingApprovals: 12,
    totalDepartments: 8,
    evaluationForms: 5,
  })

  const [evaluationForms, setEvaluationForms] = useState([
    {
      id: 1,
      title: "Academic Staff Performance Evaluation",
      description: "Comprehensive evaluation form for teaching staff",
      targetRole: "teacher",
      status: "active",
      createdDate: "2024-01-15",
      lastModified: "2024-03-10",
      usageCount: 45,
      sections: [
        { name: "Teaching Performance", weight: 40 },
        { name: "Research Activities", weight: 30 },
        { name: "Service Activities", weight: 20 },
        { name: "Professional Development", weight: 10 },
      ],
    },
    {
      id: 2,
      title: "Administrative Staff Evaluation",
      description: "Performance evaluation for administrative personnel",
      targetRole: "academic_worker",
      status: "active",
      createdDate: "2024-01-20",
      lastModified: "2024-02-28",
      usageCount: 32,
      sections: [
        { name: "Task Performance", weight: 70 },
        { name: "Behavioral Indicators", weight: 30 },
      ],
    },
    {
      id: 3,
      title: "Leadership Performance Review",
      description: "Evaluation form for department heads and managers",
      targetRole: "admin",
      status: "draft",
      createdDate: "2024-03-01",
      lastModified: "2024-03-15",
      usageCount: 0,
      sections: [
        { name: "Leadership Skills", weight: 35 },
        { name: "Strategic Planning", weight: 25 },
        { name: "Team Management", weight: 25 },
        { name: "Communication", weight: 15 },
      ],
    },
  ])

  const [recentActivities] = useState([
    {
      id: 1,
      type: "form_created",
      title: "New Evaluation Form Created",
      description: "Leadership Performance Review form has been created",
      user: "Dr. Bekele Tadesse",
      time: "2 hours ago",
      status: "info",
    },
    {
      id: 2,
      type: "evaluation_submitted",
      title: "Evaluation Submitted",
      description: "Samuel Hailu completed his quarterly evaluation",
      user: "Samuel Hailu Demse",
      time: "4 hours ago",
      status: "success",
    },
    {
      id: 3,
      type: "approval_pending",
      title: "Approval Required",
      description: "5 evaluations are pending supervisor approval",
      user: "System",
      time: "6 hours ago",
      status: "warning",
    },
  ])

  const [users] = useState([
    {
      id: 1,
      name: "Samuel Hailu Demse",
      role: "teacher",
      department: "Information Communication Technology",
      status: "active",
      lastEvaluation: "2024-03-15",
      evaluationScore: 85.5,
    },
    {
      id: 2,
      name: "Banchirga Nurye",
      role: "academic_worker",
      department: "Computer Science & Engineering",
      status: "active",
      lastEvaluation: "2024-03-10",
      evaluationScore: 78.2,
    },
    {
      id: 3,
      name: "Daniel Asfaw",
      role: "admin",
      department: "Information Communication Technology",
      status: "active",
      lastEvaluation: "2024-02-28",
      evaluationScore: 92.1,
    },
  ])

  const handleCreateForm = () => {
    // Navigate to form builder
    console.log("Creating new form...")
  }

  const handleEditForm = (formId) => {
    console.log("Editing form:", formId)
  }

  const handleDeleteForm = (formId) => {
    setEvaluationForms((forms) => forms.filter((form) => form.id !== formId))
  }

  const handleToggleFormStatus = (formId) => {
    setEvaluationForms((forms) =>
      forms.map((form) =>
        form.id === formId ? { ...form, status: form.status === "active" ? "inactive" : "active" } : form,
      ),
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.overviewContent}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statContent}>
                  <h3>Total Users</h3>
                  <p>{systemStats.totalUsers}</p>
                  <span className={styles.statTrend}>+12 this month</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📝</div>
                <div className={styles.statContent}>
                  <h3>Active Evaluations</h3>
                  <p>{systemStats.activeEvaluations}</p>
                  <span className={styles.statTrend}>In progress</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statContent}>
                  <h3>Completed</h3>
                  <p>{systemStats.completedEvaluations}</p>
                  <span className={styles.statTrend}>This quarter</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statContent}>
                  <h3>Pending Approvals</h3>
                  <p>{systemStats.pendingApprovals}</p>
                  <span className={styles.statTrend}>Needs attention</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className={styles.activitiesSection}>
              <h3 className={styles.sectionTitle}>Recent System Activities</h3>
              <div className={styles.activitiesList}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityStatus} ${styles[activity.status]}`}></div>
                    <div className={styles.activityContent}>
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <span className={styles.activityTime}>
                        {activity.user} • {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "forms":
        return (
          <div className={styles.formsContent}>
            <div className={styles.formsHeader}>
              <h2>Evaluation Forms Management</h2>
              <button className={styles.createButton} onClick={handleCreateForm}>
                ➕ Create New Form
              </button>
            </div>

            <div className={styles.formsGrid}>
              {evaluationForms.map((form) => (
                <div key={form.id} className={styles.formCard}>
                  <div className={styles.formHeader}>
                    <h3>{form.title}</h3>
                    <div className={styles.formActions}>
                      <span className={`${styles.statusBadge} ${styles[form.status]}`}>{form.status}</span>
                      <div className={styles.actionButtons}>
                        <button className={styles.editButton} onClick={() => handleEditForm(form.id)}>
                          ✏️
                        </button>
                        <button className={styles.toggleButton} onClick={() => handleToggleFormStatus(form.id)}>
                          {form.status === "active" ? "⏸️" : "▶️"}
                        </button>
                        <button className={styles.deleteButton} onClick={() => handleDeleteForm(form.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className={styles.formDescription}>{form.description}</p>

                  <div className={styles.formDetails}>
                    <div className={styles.formMeta}>
                      <span>
                        Target Role: <strong>{form.targetRole}</strong>
                      </span>
                      <span>
                        Usage: <strong>{form.usageCount} times</strong>
                      </span>
                    </div>

                    <div className={styles.formSections}>
                      <h4>Form Sections:</h4>
                      {form.sections.map((section, index) => (
                        <div key={index} className={styles.sectionItem}>
                          <span>{section.name}</span>
                          <span className={styles.sectionWeight}>{section.weight}%</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.formDates}>
                      <small>Created: {new Date(form.createdDate).toLocaleDateString()}</small>
                      <small>Modified: {new Date(form.lastModified).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "users":
        return (
          <div className={styles.usersContent}>
            <div className={styles.usersHeader}>
              <h2>User Management</h2>
              <div className={styles.userFilters}>
                <select className={styles.filterSelect}>
                  <option value="all">All Roles</option>
                  <option value="teacher">Teachers</option>
                  <option value="academic_worker">Academic Workers</option>
                  <option value="admin">Administrators</option>
                </select>
                <select className={styles.filterSelect}>
                  <option value="all">All Departments</option>
                  <option value="ict">ICT</option>
                  <option value="cse">Computer Science</option>
                  <option value="hr">Human Resources</option>
                </select>
              </div>
            </div>

            <div className={styles.usersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Evaluation</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className={styles.userName}>{user.name}</td>
                      <td>
                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>{user.role}</span>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[user.status]}`}>{user.status}</span>
                      </td>
                      <td>{new Date(user.lastEvaluation).toLocaleDateString()}</td>
                      <td className={styles.scoreCell}>{user.evaluationScore}%</td>
                      <td>
                        <div className={styles.userActions}>
                          <button className={styles.viewButton}>👁️</button>
                          <button className={styles.editButton}>✏️</button>
                          <button className={styles.evaluateButton}>📝</button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
                <h3>📊 Performance Analytics</h3>
                <p>Comprehensive performance analysis across all departments</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>

              <div className={styles.reportCard}>
                <h3>📈 Evaluation Trends</h3>
                <p>Track evaluation completion rates and score trends</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>

              <div className={styles.reportCard}>
                <h3>👥 User Activity</h3>
                <p>Monitor user engagement and system usage statistics</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>

              <div className={styles.reportCard}>
                <h3>🎯 Goal Achievement</h3>
                <p>Track goal completion and performance improvement</p>
                <button className={styles.generateButton}>Generate Report</button>
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
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <img src="/placeholder.svg?height=50&width=50&text=ASTU" alt="ASTU Logo" className={styles.logo} />
            <div className={styles.systemTitle}>
              <h1>Admin Dashboard</h1>
              <p>Performance Management System</p>
            </div>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{admin.name}</span>
              <span className={styles.userRole}>{admin.role}</span>
            </div>
            <img src={admin.avatar || "/placeholder.svg"} alt="Admin Avatar" className={styles.userAvatar} />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.navigation}>
        <div className={styles.navTabs}>
          <button
            className={`${styles.navTab} ${activeTab === "overview" ? styles.active : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`${styles.navTab} ${activeTab === "forms" ? styles.active : ""}`}
            onClick={() => setActiveTab("forms")}
          >
            📝 Forms Management
          </button>
          <button
            className={`${styles.navTab} ${activeTab === "users" ? styles.active : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 User Management
          </button>
          <button
            className={`${styles.navTab} ${activeTab === "reports" ? styles.active : ""}`}
            onClick={() => setActiveTab("reports")}
          >
            📈 Reports
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>{renderTabContent()}</main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 Adama Science & Technology University. All rights reserved.</p>
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
