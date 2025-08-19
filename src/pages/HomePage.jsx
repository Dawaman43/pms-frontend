"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { apiFetch } from "../lib/api"
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
        const me = await apiFetch("/users/me")
        setUser({
          name: `${me.firstName || ''} ${me.lastName || ''}`.trim() || me.email,
          role: me.role === 'team_member' ? 'Team Member' : me.role,
          department: me.team?.name || '',
          avatar: "/assets/avatar-placeholder.png",
          employeeId: me._id || me.id,
        })
        const evals = await apiFetch("/evaluations")
        const completed = evals.filter(e => e.status === 'submitted').length
        const pending = Math.max(0, evals.length - completed)
        setStats({
          totalEvaluations: evals.length,
          pendingEvaluations: pending,
          completedEvaluations: completed,
          averageScore: 0,
        })
        setRecentActivities([])
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
    setIsSidebarOpen(!isSidebarOpen)
    setActivePopout(null)
  }

  if (error) {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.homeContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <img src="/astu_logo.svg" alt="ASTU Logo" className={styles.sidebarLogoImage} />
            {isSidebarOpen && (
              <div className={styles.sidebarTitle}>
                <h3>PMS</h3>
                <p>ASTU</p>
              </div>
            )}
          </div>
          <button className={styles.sidebarToggle} onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M20 12L13 5M20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        
        <nav className={styles.sidebarNav}>
          <ul>
            {navLinks.map((link, index) => (
              <li key={index}>
                <div className={styles.navItemContainer}>
                  <Link 
                    to={link.link} 
                    className={`${styles.navLink} ${link.active ? styles.active : ''}`}
                    onClick={(e) => {
                      if (link.hasPopout) {
                        e.preventDefault()
                        togglePopout(link.title)
                      }
                    }}
                  >
                    <div className={styles.navIcon}>{link.icon}</div>
                    {isSidebarOpen && <span>{link.title}</span>}
                    {link.hasPopout && isSidebarOpen && (
                      <div className={styles.chevronIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </Link>
                  
                  {link.hasPopout && activePopout === link.title && (
                    <div className={styles.popoutMenu}>
                      {link.popoutItems.map((item, idx) => (
                        <Link 
                          key={idx} 
                          to={item.link} 
                          className={styles.popoutItem}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>
        
        {isSidebarOpen && (
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <img 
                src={user.avatar} 
                alt="User Avatar" 
                className={styles.userAvatar} 
              />
              <div>
                <h4>{user.name.split(" ")[0]}</h4>
                <p>{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Wrapper */}
      <div className={`${styles.mainWrapper} ${!isSidebarOpen ? styles.mainWrapperFull : ''}`}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {isMobile && (
                <button className={styles.mobileMenuButton} onClick={toggleSidebar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                <span className={styles.performanceScore}>{stats.currentQuarterScore ?? 0}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${stats.currentQuarterScore ?? 0}%` }}
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
    </div>
  )
}

export default HomePage