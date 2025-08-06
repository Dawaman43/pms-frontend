"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "./HomePage.module.css"

const HomePage = () => {
  const [user, setUser] = useState({
    name: "User",
    role: "",
    department: "",
    avatar: "/assets/avatar-placeholder.png",
  })
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageScore: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [quickActions] = useState([
    {
      title: "Start Self-Assessment",
      description: "Complete your quarterly self-evaluation",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/self-assessment",
    },
    {
      title: "Evaluate Peers",
      description: "Review and evaluate your colleagues",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/peer-evaluation",
    },
    {
      title: "View Reports",
      description: "Access your performance reports",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 3H3V21H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 8H15V12H9V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 16H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M7 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/reports",
    },
    {
      title: "Update Profile",
      description: "Manage your personal information",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/profile",
    },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Demo data
  const demoUserData = {
    name: "Samuel Hailu Demse",
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    avatar: "/assets/avatar-placeholder.png",
    employeeId: "ASTU-ICT-001"
  }

  const demoStatsData = {
    totalEvaluations: 12,
    pendingEvaluations: 3,
    completedEvaluations: 9,
    averageScore: 4.2,
    currentQuarterScore: 87.5,
  }

  const demoActivitiesData = [
    {
      id: 1,
      type: "evaluation_received",
      title: "Performance Evaluation Received",
      description: "Your supervisor has completed your quarterly evaluation",
      time: "2 hours ago",
      status: "new",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 16.92V19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H15.08" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 7L23 12L18 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 2,
      type: "evaluation_pending",
      title: "Peer Evaluation Due",
      description: "Please complete evaluation for Team Member by Friday",
      time: "1 day ago",
      status: "pending",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 3,
      type: "evaluation_completed",
      title: "Self-Assessment Submitted",
      description: "Your self-assessment has been successfully submitted",
      time: "3 days ago",
      status: "completed",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ]

  const demoPerformanceData = [
    { quarter: "Q1", score: 82 },
    { quarter: "Q2", score: 85 },
    { quarter: "Q3", score: 88 },
    { quarter: "Q4", score: 90 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Using demo data
        setUser(demoUserData)
        setStats(demoStatsData)
        setRecentActivities(demoActivitiesData)
        
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.")
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (error) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.homeContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <img src="/astu_logo.svg" alt="ASTU Logo" className={styles.logo} />
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
                src={user.avatar} 
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
              <h2>Welcome back, {user.name.split(" ")[0]}</h2>
              <p>Here's an overview of your performance management activities</p>
              <div className={styles.welcomeStats}>
                <div className={styles.welcomeStat}>
                  <span>Employee ID</span>
                  <strong>{user.employeeId}</strong>
                </div>
                <div className={styles.welcomeStat}>
                  <span>Department</span>
                  <strong>{user.department}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statHeader}>
                  <h3>Total Evaluations</h3>
                  <div className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 17V7M15 17V12M21 21H3V3H21V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.statValue}>{isLoading ? '...' : stats.totalEvaluations}</div>
                <div className={styles.statTrend}>+2 from last quarter</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statHeader}>
                  <h3>Pending Reviews</h3>
                  <div className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8V12V8ZM12 16H12.01H12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.statValue}>{isLoading ? '...' : stats.pendingEvaluations}</div>
                <div className={styles.statTrend}>Due soon</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statHeader}>
                  <h3>Completed</h3>
                  <div className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.statValue}>{isLoading ? '...' : stats.completedEvaluations}</div>
                <div className={styles.statTrend}>This year</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statContent}>
                <div className={styles.statHeader}>
                  <h3>Average Score</h3>
                  <div className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.049 2.927C11.349 2.006 12.652 2.006 12.952 2.927L14.469 7.601C14.603 8.015 14.988 8.291 15.421 8.291H20.335C21.304 8.291 21.706 9.531 20.923 10.101L16.947 12.989C16.597 13.244 16.449 13.695 16.583 14.108L18.1 18.782C18.401 19.703 17.347 20.469 16.564 19.899L12.588 17.011C12.238 16.756 11.763 16.756 11.413 17.011L7.436 19.899C6.653 20.469 5.6 19.703 5.901 18.782L7.418 14.108C7.552 13.695 7.404 13.244 7.054 12.989L3.077 10.101C2.294 9.531 2.697 8.291 3.666 8.291H8.58C9.013 8.291 9.397 8.015 9.532 7.601L11.049 2.927Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className={styles.statValue}>{isLoading ? '...' : `${stats.averageScore}/5`}</div>
                <div className={styles.statTrend}>+0.3 from last quarter</div>
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
                >
                  <div className={styles.actionIcon}>
                    {action.icon}
                  </div>
                  <div className={styles.actionContent}>
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                  <div className={styles.actionArrow}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <div className={styles.activityIcon}>
                      {activity.icon}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeader}>
                        <h4>{activity.title}</h4>
                        <span className={styles.activityTime}>{activity.time}</span>
                      </div>
                      <p>{activity.description}</p>
                      <div className={`${styles.activityStatus} ${styles[activity.status]}`}>
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
              <span className={styles.performanceScore}>{demoStatsData.currentQuarterScore}%</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${demoStatsData.currentQuarterScore}%` }}
              ></div>
            </div>
            <div className={styles.performanceChart}>
              <h4>Quarterly Performance Trend</h4>
              <div className={styles.chartBars}>
                {demoPerformanceData.map((item, index) => (
                  <div key={index} className={styles.chartBarContainer}>
                    <div 
                      className={styles.chartBar} 
                      style={{ height: `${item.score}%` }}
                    ></div>
                    <span className={styles.chartLabel}>{item.quarter}</span>
                    <span className={styles.chartValue}>{item.score}%</span>
                  </div>
                ))}
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