"use client";

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import styles from "./HomePage.module.css"

const HomePage = () => {
  const [user, setUser] = useState({
    name: "User",
    role: "",
    department: "",
    avatar: "/assets/avatar-placeholder.png",
  });
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageScore: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activePopout, setActivePopout] = useState(null)
  const location = useLocation()

  const togglePopout = (item) => {
    if (activePopout === item) {
      setActivePopout(null)
    } else {
      setActivePopout(item)
    }
  }

  const navLinks = [
    {
      title: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/home",
      active: location.pathname === "/",
    },
    {
      title: "Self Assessment",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/self-assessment",
      active: location.pathname === "/self-assessment",
    },
    {
      title: "Peer Evaluation",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/peer-evaluation",
      active: location.pathname === "/peer-evaluation",
    },
    {
      title: "Reports",
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
      active: location.pathname === "/reports",
    },
    {
      title: "Profile",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/profile",
      active: location.pathname === "/profile",
      
    },
    {
      title: "Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15C19.2669 15.3016 19.227 15.6363 19.2849 15.9606C19.3427 16.2849 19.4962 16.5836 19.725 16.8175C19.9538 17.0514 20.2473 17.2095 20.566 17.2709C20.8847 17.3323 21.2126 17.2942 21.505 17.1625C21.7974 17.0308 22.0399 16.8119 22.2 16.5375C22.3601 16.2631 22.4298 15.947 22.4 15.6312C22.3702 15.3155 22.2427 15.0164 22.035 14.775C21.8273 14.5336 21.55 14.362 21.24 14.285L19.4 15ZM4.6 15L2.76 14.285C2.45004 14.362 2.17274 14.5336 1.96502 14.775C1.7573 15.0164 1.62983 15.3155 1.60001 15.6312C1.57019 15.947 1.63989 16.2631 1.80001 16.5375C1.96012 16.8119 2.20263 17.0308 2.495 17.1625C2.78737 17.2942 3.11525 17.3323 3.43401 17.2709C3.75277 17.2095 4.04619 17.0514 4.275 16.8175C4.50381 16.5836 4.6573 16.2849 4.71513 15.9606C4.77296 15.6363 4.73314 15.3016 4.6 15V15ZM17.285 4.6C17.5984 4.73314 17.9337 4.77296 18.258 4.71513C18.5824 4.6573 18.881 4.50381 19.115 4.275C19.3489 4.04619 19.507 3.75277 19.5684 3.43401C19.6298 3.11525 19.5917 2.78737 19.46 2.495C19.3283 2.20263 19.1094 1.96012 18.835 1.80001C18.5606 1.63989 18.2445 1.57019 17.9288 1.60001C17.613 1.62983 17.3139 1.7573 17.0725 1.96502C16.8311 2.17274 16.6595 2.45004 16.5825 2.76L17.285 4.6ZM6.715 4.6L7.4175 2.76C7.34054 2.45004 7.16896 2.17274 6.92754 1.96502C6.68612 1.7573 6.38704 1.62983 6.07125 1.60001C5.75547 1.57019 5.43942 1.63989 5.165 1.80001C4.89058 1.96012 4.67167 2.20263 4.54 2.495C4.40833 2.78737 4.3702 3.11525 4.4316 3.43401C4.493 3.75277 4.6511 4.04619 4.885 4.275C5.11889 4.50381 5.41744 4.6573 5.74179 4.71513C6.06613 4.77296 6.40156 4.73314 6.715 4.6V4.6ZM17.285 19.4C17.5984 19.2669 17.9337 19.227 18.258 19.2849C18.5824 19.3427 18.881 19.4962 19.115 19.725C19.3489 19.9538 19.507 20.2473 19.5684 20.566C19.6298 20.8847 19.5917 21.2126 19.46 21.505C19.3283 21.7974 19.1094 22.0399 18.835 22.2C18.5606 22.3601 18.2445 22.4298 17.9288 22.4C17.613 22.3702 17.3139 22.2427 17.0725 22.035C16.8311 21.8273 16.6595 21.55 16.5825 21.24L17.285 19.4ZM6.715 19.4L7.4175 21.24C7.34054 21.55 7.16896 21.8273 6.92754 22.035C6.68612 22.2427 6.38704 22.3702 6.07125 22.4C5.75547 22.4298 5.43942 22.3601 5.165 22.2C4.89058 22.0399 4.67167 21.7974 4.54 21.505C4.40833 21.2126 4.3702 20.8847 4.4316 20.566C4.493 20.2473 4.6511 19.9538 4.885 19.725C5.11889 19.4962 5.41744 19.3427 5.74179 19.2849C6.06613 19.227 6.40156 19.2669 6.715 19.4V19.4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/settings",
      active: location.pathname === "/settings",
      hasPopout: true,
      popoutItems: [
        { title: "Account Settings", link: "/settings/account" },
        { title: "Privacy Settings", link: "/settings/privacy" },
        { title: "System Preferences", link: "/settings/preferences" }
      ]
    },
  ]
  const quickActions = [
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
      title: "Profile",
      description: "Manage your personal information",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      link: "/profile",
      
    },
  ]
  
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
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={styles.container}>
      <Sidebar
        user={user}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      <div
        className={`${styles.mainWrapper} ${
          !isSidebarOpen ? styles.mainWrapperFull : ""
        }`}
      >
        <header
          className={styles.header}
          style={{ backgroundColor: "#1a365d", color: "white" }}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {isMobile && (
                <button
                  className={styles.mobileMenuButton}
                  onClick={toggleSidebar}
                >
                  <button
                    className={styles.mobileMenuButton}
                    onClick={toggleSidebar}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 12H21M3 6H21M3 18H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </button>
              )}
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
        <main className={styles.mainContent}>
          <section className={styles.overviewSection}>
            <h2 className={styles.sectionTitle}>
              Welcome, {user.name.split(" ")[0]}!
            </h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>Total Evaluations</h3>
                <p>{stats.totalEvaluations}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Pending Evaluations</h3>
                <p>{stats.pendingEvaluations}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Completed Evaluations</h3>
                <p>{stats.completedEvaluations}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Average Score</h3>
                <p>{stats.averageScore}%</p>
              </div>
            </div>
          </section>
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
                  {quarterlyPerformance.length > 0 ? (
                    quarterlyPerformance.map((item, index) => (
                      <div key={index} className={styles.chartBarContainer}>
                        <div
                          className={styles.chartBar}
                          style={{ height: `${item.score}%` }}
                        ></div>
                        <span className={styles.chartLabel}>
                          {item.quarter}
                        </span>
                        <span className={styles.chartValue}>{item.score}%</span>
                      </div>
                    ))
                  ) : (
                    <p>No quarterly performance data available.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
          <section className={styles.activitySection}>
            <h3 className={styles.sectionTitle}>
              Recent Activities
              <span className={styles.sectionDivider}></span>
            </h3>
            <div className={styles.activityList}>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
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
                    </div>
                    <div className={styles.activityContent}>
                      <p>{activity.action}</p>
                      <span className={styles.activityTime}>
                        {new Date(activity.timestamp).toLocaleString()}
                      </span>
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
        </main>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>
              &copy; {new Date().getFullYear()} Adama Science & Technology
              University. All rights reserved.
            </p>
            <div className={styles.footerLinks}>
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

export default HomePage;
