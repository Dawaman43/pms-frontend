"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import styles from "./SelfAssessment.module.css"
import HomePageStyles from "../../../pages/HomePage.module.css"

const SelfAssessment = () => {
  const [user, setUser] = useState({
    name: "Samuel Hailu Demse",
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    avatar: "/assets/avatar-placeholder.png",
    employeeId: "ASTU-ICT-001"
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activePopout, setActivePopout] = useState(null)
  const location = useLocation()

  const [formData, setFormData] = useState({
    employeeName: "Samuel Hailu Demse",
    employeeId: "ASTU-ICT-001",
    ratings: {},
    comments: "",
  })
  const [formConfig, setFormConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          <path d="M19.4 15C19.2669 15.3016 19.227 15.6363 19.2849 15.9606C19.3427 16.2849 19.4962 16.5836 19.725 16.8175C19.9538 17.0514 20.2473 17.2095 20.566 17.2709C20.8847 17.3323 21.2126 17.2942 21.505 17.1625C21.7974 17.0308 22.0399 16.8119 22.2 16.5375C22.3601 16.2631 22.4298 15.947 22.4 15.6312C22.3702 15.3155 22.2427 15.0164 22.035 14.775C21.8273 14.5336 21.55 14.362 21.24 14.285L19.4 15ZM4.6 15L2.76 14.285C2.45004 14.362 2.17274 14.5336 1.96502 14.775C1.7573 15.0164 1.62983 15.3155 1.60001 15.6312C1.57019 15.947 1.63989 16.2631 1.80001 16.5375C1.96012 16.8119 2.20263 17.0308 2.495 17.1625C2.78737 17.2942 3.11525 17.3323 3.43401 17.2709C3.75277 17.2095 4.04619 17.0514 4.275 16.8175C4.50381 16.5836 4.6573 16.2849 4.71513 15.9606C4.77296 15.6363 4.73314 15.3016 4.6 15V15ZM17.285 4.6C17.5984 4.73314 17.9337 4.77296 18.258 4.71513C18.5824 4.6573 18.881 4.50381 19.115 4.275C19.3489 4.04619 19.507 3.75277 19.5684 3.43401C19.6298 3.11525 19.5917 2.78737 19.46 2.495C19.3283 2.20263 19.1094 1.96012 18.835 1.80001C18.5606 1.63989 18.2445 1.57019 17.9288 1.60001C17.613 1.62983 17.3139 1.7573 17.0725 1.96502C16.8311 2.17274 16.6595 2.45004 16.5825 2.76L17.285 4.6ZM6.715 4.6L7.4175 2.76C7.34054 2.45004 7.16896 2.17274 6.92754 1.96502C6.68612 1.7573 6.38704 1.62983 6.07125 1.60001C5.75547 1.57019 5.43942 1.63989 5.165 1.80001C4.89058 1.96012 4.67167 2.20263 4.54 2.495C4.40833 2.78737 4.3702 3.11525 4.4316 3.43401C4.493 3.75277 4.6511 4.04619 4.885 4.275C5.11889 4.50381 5.41744 4.6573 5.74179 4.71513C6.06613 4.77296 6.40156 4.73314 6.715 4.6V4.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
          const mockForm = {
            sections: [
              {
                name: "Behavioral Indicators",
                criteria: [
                  { id: 1, name: "Anti-corruption attitude", weight: 25 },
                  { id: 2, name: "Effort to improve competence", weight: 20 },
                  { id: 3, name: "Respect and pride in service", weight: 15 },
                  { id: 4, name: "Teamwork and collaboration", weight: 15 },
                  { id: 5, name: "Initiative and innovation", weight: 25 },
                ],
              }
            ],
            ratingScale: [
              { value: 1, label: "Poor" },
              { value: 2, label: "Fair" },
              { value: 3, label: "Good" },
              { value: 4, label: "Very Good" },
              { value: 5, label: "Excellent" }
            ],
            weight: 100,
          }
          setFormConfig(mockForm)
          setLoading(false)
        }, 500)
      } catch (err) {
        console.error("Error fetching data:", err)
      }
    }
    
    fetchData()
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
    setActivePopout(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (criterionId, value) => {
    setFormData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [criterionId]: parseInt(value) || 0 },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate all ratings are provided
    const allCriteria = formConfig.sections.flatMap(section => section.criteria)
    const missingRatings = allCriteria.filter(criterion => !formData.ratings[criterion.id])
    
    if (missingRatings.length > 0) {
      alert(`Please provide ratings for all criteria (${missingRatings.length} missing)`)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Self-assessment submitted:", formData)
      setSuccess("Self-assessment submitted successfully!")
      setIsSubmitting(false)
      setTimeout(() => setSuccess(""), 5000)
    }, 1000)
  }

  if (loading) {
    return (
      <div className={HomePageStyles.homeContainer}>
        {/* Sidebar */}
        <aside className={`${HomePageStyles.sidebar} ${isSidebarOpen ? HomePageStyles.sidebarOpen : ''}`}>
          <div className={HomePageStyles.sidebarHeader}>
            <div className={HomePageStyles.sidebarLogo}>
              <img src="/astu_logo.svg" alt="ASTU Logo" className={HomePageStyles.sidebarLogoImage} />
              {isSidebarOpen && (
                <div className={HomePageStyles.sidebarTitle}>
                  <h3>PMS</h3>
                  <p>ASTU</p>
                </div>
              )}
            </div>
            <button className={HomePageStyles.sidebarToggle} onClick={toggleSidebar}>
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
          
          <nav className={HomePageStyles.sidebarNav}>
            <ul>
              {navLinks.map((link, index) => (
                <li key={index}>
                  <div className={HomePageStyles.navItemContainer}>
                    <Link 
                      to={link.link} 
                      className={`${HomePageStyles.navLink} ${link.active ? HomePageStyles.active : ''}`}
                      onClick={(e) => {
                        if (link.hasPopout) {
                          e.preventDefault()
                          togglePopout(link.title)
                        }
                      }}
                    >
                      <div className={HomePageStyles.navIcon}>{link.icon}</div>
                      {isSidebarOpen && <span>{link.title}</span>}
                      {link.hasPopout && isSidebarOpen && (
                        <div className={HomePageStyles.chevronIcon}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </Link>
                    
                    {link.hasPopout && activePopout === link.title && (
                      <div className={HomePageStyles.popoutMenu}>
                        {link.popoutItems.map((item, idx) => (
                          <Link 
                            key={idx} 
                            to={item.link} 
                            className={HomePageStyles.popoutItem}
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
            <div className={HomePageStyles.sidebarFooter}>
              <div className={HomePageStyles.userInfo}>
                <img 
                  src={user.avatar} 
                  alt="User Avatar" 
                  className={HomePageStyles.userAvatar} 
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
        <div className={`${HomePageStyles.mainWrapper} ${!isSidebarOpen ? HomePageStyles.mainWrapperFull : ''}`}>
          {/* Header */}
          <header className={HomePageStyles.header}>
            <div className={HomePageStyles.headerContent}>
              <div className={HomePageStyles.headerLeft}>
                {isMobile && (
                  <button className={HomePageStyles.mobileMenuButton} onClick={toggleSidebar}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <div className={HomePageStyles.systemTitle}>
                  <h1>Performance Management System</h1>
                  <p>Adama Science & Technology University</p>
                </div>
              </div>

              <div className={HomePageStyles.userSection}>
                <div className={HomePageStyles.userInfo}>
                  <span className={HomePageStyles.userName}>{user.name}</span>
                  <span className={HomePageStyles.userRole}>{user.role}</span>
                </div>
                <div className={HomePageStyles.avatarContainer}>
                  <img 
                    src={user.avatar} 
                    alt="User Avatar" 
                    className={HomePageStyles.userAvatar} 
                  />
                  <div className={HomePageStyles.statusIndicator}></div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className={HomePageStyles.mainContent}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading assessment form...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className={HomePageStyles.homeContainer}>
      {/* Sidebar */}
      <aside className={`${HomePageStyles.sidebar} ${isSidebarOpen ? HomePageStyles.sidebarOpen : ''}`}>
        <div className={HomePageStyles.sidebarHeader}>
          <div className={HomePageStyles.sidebarLogo}>
            <img src="/astu_sidebar_logo.png" alt="ASTU Logo" className={HomePageStyles.sidebarLogoImage} />
            {isSidebarOpen && (
              <div className={HomePageStyles.sidebarTitle}>
                <h3>PMS</h3>
                <p>ASTU</p>
              </div>
            )}
          </div>
          <button className={HomePageStyles.sidebarToggle} onClick={toggleSidebar}>
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
        
        <nav className={HomePageStyles.sidebarNav}>
          <ul>
            {navLinks.map((link, index) => (
              <li key={index}>
                <div className={HomePageStyles.navItemContainer}>
                  <Link 
                    to={link.link} 
                    className={`${HomePageStyles.navLink} ${link.active ? HomePageStyles.active : ''}`}
                    onClick={(e) => {
                      if (link.hasPopout) {
                        e.preventDefault()
                        togglePopout(link.title)
                      }
                    }}
                  >
                    <div className={HomePageStyles.navIcon}>{link.icon}</div>
                    {isSidebarOpen && <span>{link.title}</span>}
                    {link.hasPopout && isSidebarOpen && (
                      <div className={HomePageStyles.chevronIcon}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </Link>
                  
                  {link.hasPopout && activePopout === link.title && (
                    <div className={HomePageStyles.popoutMenu}>
                      {link.popoutItems.map((item, idx) => (
                        <Link 
                          key={idx} 
                          to={item.link} 
                          className={HomePageStyles.popoutItem}
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
          <div className={HomePageStyles.sidebarFooter}>
            <div className={HomePageStyles.userInfo}>
              <img 
                src={user.avatar} 
                alt="User Avatar" 
                className={HomePageStyles.userAvatar} 
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
      <div className={`${HomePageStyles.mainWrapper} ${!isSidebarOpen ? HomePageStyles.mainWrapperFull : ''}`}>
        {/* Header */}
        <header className={HomePageStyles.header}>
          <div className={HomePageStyles.headerContent}>
            <div className={HomePageStyles.headerLeft}>
              {isMobile && (
                <button className={HomePageStyles.mobileMenuButton} onClick={toggleSidebar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <div className={HomePageStyles.systemTitle}>
                <h1>Performance Management System</h1>
                <p>Adama Science & Technology University</p>
              </div>
            </div>

            <div className={HomePageStyles.userSection}>
              <div className={HomePageStyles.userInfo}>
                <span className={HomePageStyles.userName}>{user.name}</span>
                <span className={HomePageStyles.userRole}>{user.role}</span>
              </div>
              <div className={HomePageStyles.avatarContainer}>
                <img 
                  src={user.avatar} 
                  alt="User Avatar" 
                  className={HomePageStyles.userAvatar} 
                />
                <div className={HomePageStyles.statusIndicator}></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={HomePageStyles.mainContent}>
          <section className={styles.contentSection}>
            <div className={styles.headerSection}>
              <h2 className={styles.pageTitle}>Self-Assessment</h2>
              <p className={styles.pageSubtitle}>Complete your quarterly self-evaluation</p>
            </div>
            
            {success && (
              <div className={styles.successMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.assessmentForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Employee Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                    disabled
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className={styles.formInput}
                    required
                    disabled
                  />
                </div>
              </div>

              <div className={styles.evaluationTableContainer}>
                <table className={styles.evaluationTable}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>No</th>
                      <th className={styles.tableHeader}>Behavioral Indicators</th>
                      <th className={styles.tableHeader}>Weight</th>
                      <th className={styles.tableHeader}>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formConfig?.sections[0].criteria.map((criterion, index) => (
                      <tr key={criterion.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{index + 1}</td>
                        <td className={styles.tableCell}>{criterion.name}</td>
                        <td className={styles.tableCell}>{criterion.weight}%</td>
                        <td className={styles.tableCell}>
                          <select
                            value={formData.ratings[criterion.id] || ""}
                            onChange={(e) => handleRatingChange(criterion.id, e.target.value)}
                            className={styles.ratingSelect}
                            required
                          >
                            <option value="">Select</option>
                            {formConfig.ratingScale.map((scale) => (
                              <option key={scale.value} value={scale.value}>
                                {scale.value} - {scale.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.commentsSection}>
                <label className={styles.formLabel}>Additional Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  className={styles.commentsTextarea}
                  placeholder="Provide any additional comments about your performance..."
                  rows={4}
                />
              </div>

              <div className={styles.formActions}>
                <Link to="/" className={styles.cancelButton}>
                  Cancel
                </Link>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className={styles.spinner} viewBox="0 0 50 50">
                        <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Assessment"
                  )}
                </button>
              </div>
            </form>
          </section>
        </main>

        {/* Footer */}
        <footer className={HomePageStyles.footer}>
          <div className={HomePageStyles.footerContent}>
            <p>&copy; {new Date().getFullYear()} Adama Science & Technology University. All rights reserved.</p>
            <div className={HomePageStyles.footerLinks}>
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

export default SelfAssessment