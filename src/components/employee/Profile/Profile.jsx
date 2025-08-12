"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./profile.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";

const Profile = () => {
  const [user, setUser] = useState({
    name: "Samuel Hailu Demse",
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    avatar: "/assets/avatar-placeholder.png",
    employeeId: "ASTU-ICT-001"
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePopout, setActivePopout] = useState(null);
  const location = useLocation();

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    employeeId: "",
    department: "",
    position: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

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
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockProfile = {
            name: "Samuel Hailu Demse",
            email: "samuel.hailu@astu.edu.et",
            employeeId: "ASTU-ICT-001",
            department: "Information Communication Technology",
            position: "Software Programmer IV",
            phone: "+251 912 345 678",
            avatar: "/assets/avatar-placeholder.png"
          };
          setProfileData((prev) => ({ ...prev, ...mockProfile }));
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const togglePopout = (item) => {
    if (activePopout === item) {
      setActivePopout(null);
    } else {
      setActivePopout(item);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActivePopout(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (profileData.newPassword || profileData.confirmPassword) {
      if (!profileData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      
      if (profileData.newPassword.length > 0 && profileData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Profile updated:", profileData);
      setSuccess("Profile updated successfully!");
      setIsSubmitting(false);
      setTimeout(() => setSuccess(""), 5000);
      
      // Clear password fields after successful update
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }, 1000);
  };

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
              <p>Loading profile information...</p>
            </div>
          </main>
        </div>
      </div>
    );
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
              <h2 className={styles.pageTitle}>Update Profile</h2>
              <p className={styles.pageSubtitle}>Manage your personal and account information</p>
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

            <form onSubmit={handleSubmit} className={styles.profileForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className={`${styles.formInput} ${errors.name ? styles.errorInput : ''}`}
                    required
                  />
                  {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
                    required
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className={styles.formInput}
                    placeholder="+251 ___ ___ ___"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={profileData.employeeId}
                    className={styles.formInput}
                    disabled
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={profileData.department}
                    className={styles.formInput}
                    disabled
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={profileData.position}
                    className={styles.formInput}
                    disabled
                  />
                </div>
              </div>

              <div className={styles.passwordSection}>
                <h3 className={styles.sectionTitle}>Password Update</h3>
                <p className={styles.sectionSubtitle}>Leave blank if you don't want to change your password</p>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Password</label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.currentPassword ? styles.errorInput : ''}`}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className={styles.passwordToggle}
                      >
                        {showPassword.current ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && <span className={styles.errorText}>{errors.currentPassword}</span>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>New Password</label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.newPassword ? styles.errorInput : ''}`}
                        placeholder="Enter new password (min 8 chars)"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className={styles.passwordToggle}
                      >
                        {showPassword.new ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.newPassword && <span className={styles.errorText}>{errors.newPassword}</span>}
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Confirm New Password</label>
                    <div className={styles.passwordInputWrapper}>
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleChange}
                        className={`${styles.formInput} ${errors.confirmPassword ? styles.errorInput : ''}`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className={styles.passwordToggle}
                      >
                        {showPassword.confirm ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.12 14.12C13.8454 14.4147 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.481 9.80385 14.1962C9.51897 13.9113 9.29439 13.5719 9.14351 13.1984C8.99262 12.8248 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.6819 3.96914 7.65661 6.06 6.06L17.94 17.94ZM9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2047 20.84 15.19L9.9 4.24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
                  </div>
                </div>
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
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
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
  );
};

export default Profile;