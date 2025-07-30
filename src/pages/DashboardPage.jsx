"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import PerformanceForm from "../components/PerformanceForm"
import PerformanceHistory from "../components/PerformanceHistory"
import styles from "./DashboardPage.module.css"

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [user] = useState({
    name: "Samuel Hailu Demse",
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    employeeId: "ASTU-ICT-001",
    avatar: "/placeholder.svg?height=80&width=80&text=User",
  })

  const [dashboardStats] = useState({
    totalEvaluations: 12,
    pendingEvaluations: 3,
    completedEvaluations: 9,
    averageScore: 85.2,
    currentQuarterScore: 87.5,
    lastEvaluationDate: "2024-03-15",
    nextEvaluationDue: "2024-06-15",
  })

  const [recentEvaluations] = useState([
    {
      id: 1,
      type: "Quarterly Review",
      evaluator: "Daniel Asfaw",
      score: 85.5,
      status: "Completed",
      date: "2024-03-15",
    },
    {
      id: 2,
      type: "Peer Review",
      evaluator: "Banchirga Nurye",
      score: 87.1,
      status: "Completed",
      date: "2024-02-28",
    },
    {
      id: 3,
      type: "Self Assessment",
      evaluator: "Self",
      score: 0,
      status: "Pending",
      date: "Due: 2024-06-15",
    },
  ])

  const [upcomingTasks] = useState([
    {
      id: 1,
      title: "Complete Q2 Self-Assessment",
      dueDate: "2024-06-15",
      priority: "High",
      type: "Self Evaluation",
    },
    {
      id: 2,
      title: "Peer Evaluation for John Doe",
      dueDate: "2024-06-20",
      priority: "Medium",
      type: "Peer Evaluation",
    },
    {
      id: 3,
      title: "Submit Development Goals",
      dueDate: "2024-06-30",
      priority: "Low",
      type: "Goal Setting",
    },
  ])

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.overviewContent}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statContent}>
                  <h3>Average Score</h3>
                  <p>{dashboardStats.averageScore}%</p>
                  <span className={styles.statTrend}>+2.3% from last quarter</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statContent}>
                  <h3>Completed</h3>
                  <p>{dashboardStats.completedEvaluations}</p>
                  <span className={styles.statTrend}>This year</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statContent}>
                  <h3>Pending</h3>
                  <p>{dashboardStats.pendingEvaluations}</p>
                  <span className={styles.statTrend}>Due soon</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statContent}>
                  <h3>Current Quarter</h3>
                  <p>{dashboardStats.currentQuarterScore}%</p>
                  <span className={styles.statTrend}>Q2 2024</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
              {/* Recent Evaluations */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Recent Evaluations</h3>
                  <Link to="/evaluations" className={styles.viewAllLink}>
                    View All
                  </Link>
                </div>
                <div className={styles.evaluationsList}>
                  {recentEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className={styles.evaluationItem}>
                      <div className={styles.evaluationInfo}>
                        <h4>{evaluation.type}</h4>
                        <p>Evaluator: {evaluation.evaluator}</p>
                        <span className={styles.evaluationDate}>{evaluation.date}</span>
                      </div>
                      <div className={styles.evaluationScore}>
                        {evaluation.status === "Completed" ? (
                          <span className={styles.scoreValue}>{evaluation.score}%</span>
                        ) : (
                          <span className={styles.pendingStatus}>Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Upcoming Tasks</h3>
                  <span className={styles.taskCount}>{upcomingTasks.length} tasks</span>
                </div>
                <div className={styles.tasksList}>
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                      <div className={styles.taskInfo}>
                        <h4>{task.title}</h4>
                        <p>{task.type}</p>
                        <span className={styles.taskDue}>Due: {task.dueDate}</span>
                      </div>
                      <div className={styles.taskPriority}>
                        <span className={`${styles.priorityBadge} ${styles[task.priority.toLowerCase()]}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className={styles.chartCard}>
              <h3>Performance Trend</h3>
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartBars}>
                  <div className={styles.chartBar} style={{ height: "60%" }}>
                    <span>Q1</span>
                  </div>
                  <div className={styles.chartBar} style={{ height: "75%" }}>
                    <span>Q2</span>
                  </div>
                  <div className={styles.chartBar} style={{ height: "85%" }}>
                    <span>Q3</span>
                  </div>
                  <div className={styles.chartBar} style={{ height: "90%" }}>
                    <span>Q4</span>
                  </div>
                </div>
                <p className={styles.chartDescription}>Your performance scores over the last 4 quarters</p>
              </div>
            </div>
          </div>
        )

      case "evaluations":
        return <PerformanceForm onSubmit={(data) => console.log("Evaluation submitted:", data)} />

      case "history":
        return <PerformanceHistory />

      case "profile":
        return (
          <div className={styles.profileContent}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <img src={user.avatar || "/placeholder.svg"} alt="Profile" className={styles.profileAvatar} />
                <div className={styles.profileInfo}>
                  <h2>{user.name}</h2>
                  <p>{user.role}</p>
                  <p>{user.department}</p>
                  <p>Employee ID: {user.employeeId}</p>
                </div>
              </div>
              <div className={styles.profileDetails}>
                <h3>Profile Information</h3>
                <div className={styles.profileGrid}>
                  <div className={styles.profileField}>
                    <label>Full Name</label>
                    <input type="text" value={user.name} readOnly />
                  </div>
                  <div className={styles.profileField}>
                    <label>Position</label>
                    <input type="text" value={user.role} readOnly />
                  </div>
                  <div className={styles.profileField}>
                    <label>Department</label>
                    <input type="text" value={user.department} readOnly />
                  </div>
                  <div className={styles.profileField}>
                    <label>Employee ID</label>
                    <input type="text" value={user.employeeId} readOnly />
                  </div>
                </div>
                <button className={styles.editButton}>Edit Profile</button>
              </div>
            </div>
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
            <img src="../public/astu_logo.svg?height=50&width=50&text=ASTU" alt="ASTU Logo" className={styles.logo} />
            <div className={styles.systemTitle}>
              <h1>Performance Management Dashboard</h1>
              <p>Adama Science & Technology University</p>
            </div>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <img src={user.avatar || "/placeholder.svg"} alt="User Avatar" className={styles.userAvatar} />
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
            className={`${styles.navTab} ${activeTab === "evaluations" ? styles.active : ""}`}
            onClick={() => setActiveTab("evaluations")}
          >
            📝 New Evaluation
          </button>
          <button
            className={`${styles.navTab} ${activeTab === "history" ? styles.active : ""}`}
            onClick={() => setActiveTab("history")}
          >
            📋 History
          </button>
          <button
            className={`${styles.navTab} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
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

export default DashboardPage
