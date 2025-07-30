"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./HomePage.module.css"

const HomePage = () => {
  // User data - will be fetched from backend/database when implemented
  const [user] = useState({
    name: "User", // Generic placeholder until user data is fetched from backend
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    avatar: "/assets/avatar-placeholder.png", // Using a proper path for the avatar
  })

  // Sample statistics - will be fetched from backend
  const [stats] = useState({
    totalEvaluations: 12,
    pendingEvaluations: 3,
    completedEvaluations: 9,
    averageScore: 4.2,
  })

  // Sample activities - will be fetched from backend
  const [recentActivities] = useState([
    {
      id: 1,
      type: "evaluation_received",
      title: "Performance Evaluation Received",
      description: "Your supervisor has completed your quarterly evaluation",
      time: "2 hours ago",
      status: "new",
      icon: "📋",
    },
    {
      id: 2,
      type: "evaluation_pending",
      title: "Peer Evaluation Due",
      description: "Please complete evaluation for Team Member by Friday",
      time: "1 day ago",
      status: "pending",
      icon: "⏳",
    },
    {
      id: 3,
      type: "evaluation_completed",
      title: "Self-Assessment Submitted",
      description: "Your self-assessment has been successfully submitted",
      time: "3 days ago",
      status: "completed",
      icon: "✅",
    },
  ])

  // Quick action buttons
  const [quickActions] = useState([
    {
      title: "Start Self-Assessment",
      description: "Complete your quarterly self-evaluation",
      icon: "📝",
      color: "var(--primary-color)",
      link: "/self-assessment",
    },
    {
      title: "Evaluate Peers",
      description: "Review and evaluate your colleagues",
      icon: "👥",
      color: "var(--success-color)",
      link: "/peer-evaluation",
    },
    {
      title: "View Reports",
      description: "Access your performance reports",
      icon: "📊",
      color: "var(--warning-color)",
      link: "/reports",
    },
    {
      title: "Update Profile",
      description: "Manage your personal information",
      icon: "⚙️",
      color: "var(--info-color)",
      link: "/profile",
    },
  ])

  // Loading state for future backend integration
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className={styles.homeContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <img src="/assets/astu_logo.svg" alt="ASTU Logo" className={styles.logo} />
            <div className={styles.systemTitle}>
              <h1>Performance Management System</h1>
              <p>Adama Science & Technology University</p>
            </div>
          </div>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <div className={styles.avatarContainer}>
              <img 
                src={user.avatar || "/assets/avatar-placeholder.png"} 
                alt="User Avatar" 
                className={styles.userAvatar} 
              />
              <div className={styles.statusIndicator}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Welcome Section */}
        <section className={styles.welcomeSection}>
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeContent}>
              <h2>Welcome back, {user.name !== "User" ? user.name.split(" ")[0] : "User"}! 👋</h2>
              <p>Here's an overview of your performance management activities</p>
            </div>
            <div className={styles.welcomeGraphic}>
              <div className={styles.graphicCircle}></div>
              <div className={styles.graphicCircle}></div>
              <div className={styles.graphicCircle}></div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.statPrimary}`}>
              <div className={styles.statIcon}>📋</div>
              <div className={styles.statContent}>
                <h3>{isLoading ? '...' : stats.totalEvaluations}</h3>
                <p>Total Evaluations</p>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statWarning}`}>
              <div className={styles.statIcon}>⏳</div>
              <div className={styles.statContent}>
                <h3>{isLoading ? '...' : stats.pendingEvaluations}</h3>
                <p>Pending Reviews</p>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statSuccess}`}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statContent}>
                <h3>{isLoading ? '...' : stats.completedEvaluations}</h3>
                <p>Completed</p>
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.statInfo}`}>
              <div className={styles.statIcon}>⭐</div>
              <div className={styles.statContent}>
                <h3>{isLoading ? '...' : `${stats.averageScore}/5`}</h3>
                <p>Average Score</p>
              </div>
            </div>
          </div>
        </section>

        {/* Two Column Layout for Actions and Activities */}
        <div className={styles.twoColumnGrid}>
          {/* Quick Actions */}
          <section className={styles.quickActionsSection}>
            <h3 className={styles.sectionTitle}>
              Quick Actions
              <span className={styles.sectionDivider}></span>
            </h3>
            <div className={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={styles.actionCard}
                  style={{ "--accent-color": action.color }}
                >
                  <div className={styles.actionIcon}>{action.icon}</div>
                  <div className={styles.actionContent}>
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                  <div className={styles.actionArrow}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent Activities */}
          <section className={styles.activitiesSection}>
            <h3 className={styles.sectionTitle}>
              Recent Activities
              <span className={styles.sectionDivider}></span>
            </h3>
            <div className={styles.activitiesList}>
              {isLoading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingPulse}></div>
                  <p>Loading activities...</p>
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[activity.status]}`}>
                      {activity.icon}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <h4>{activity.title}</h4>
                        <span className={styles.activityTime}>{activity.time}</span>
                      </div>
                      <p>{activity.description}</p>
                      <div className={`${styles.activityStatusBadge} ${styles[activity.status]}`}>
                        {activity.status === 'new' ? 'New' : 
                         activity.status === 'pending' ? 'Pending' : 'Completed'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>No recent activities found.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Performance Overview */}
        <section className={styles.performanceSection}>
          <h3 className={styles.sectionTitle}>
            Performance Overview
            <span className={styles.sectionDivider}></span>
          </h3>
          <div className={styles.performanceCard}>
            <div className={styles.performanceHeader}>
              <h4>Current Quarter Progress</h4>
              <span className={styles.performanceScore}>85%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "85%" }}></div>
            </div>
            <div className={styles.performanceDetails}>
              <div className={styles.performanceItem}>
                <div className={styles.performanceItemHeader}>
                  <span>Task Completion</span>
                  <span className={styles.performanceValue}>92%</span>
                </div>
                <div className={styles.performanceItemProgress}>
                  <div className={styles.progressBarSmall}>
                    <div className={styles.progressFillSmall} style={{ width: "92%" }}></div>
                  </div>
                </div>
              </div>
              <div className={styles.performanceItem}>
                <div className={styles.performanceItemHeader}>
                  <span>Quality Rating</span>
                  <span className={styles.performanceValue}>4.3/5</span>
                </div>
                <div className={styles.performanceItemProgress}>
                  <div className={styles.progressBarSmall}>
                    <div className={styles.progressFillSmall} style={{ width: "86%" }}></div>
                  </div>
                </div>
              </div>
              <div className={styles.performanceItem}>
                <div className={styles.performanceItemHeader}>
                  <span>Peer Feedback</span>
                  <span className={styles.performanceValue}>4.1/5</span>
                </div>
                <div className={styles.performanceItemProgress}>
                  <div className={styles.progressBarSmall}>
                    <div className={styles.progressFillSmall} style={{ width: "82%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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

export default HomePage