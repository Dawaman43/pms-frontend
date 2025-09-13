"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api";
import styles from "./HomePage.module.css";
import Sidebar from "../components/employee/sidebar";

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
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [quarterlyPerformance, setQuarterlyPerformance] = useState([]); // New state for quarterly data
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData.id;
        if (userId) {
          // Fetch user data
          const userResponse = await api.getUserById(userId);
          setUser({
            name: userResponse.name,
            role: userResponse.jobTitle,
            department: userResponse.department,
            avatar:
              userResponse.profileImage ||
              "/placeholder.svg?height=80&width=80&text=User",
          });

          // Fetch performance stats
          const evaluations = await api.getEvaluatesByUser(userId);
          const totalEvaluations = evaluations.length;
          const pendingEvaluations = evaluations.filter(
            (e) => e.status === "pending"
          ).length;
          const completedEvaluations = evaluations.filter(
            (e) => e.status === "completed"
          ).length;
          const averageScore =
            evaluations.length > 0
              ? evaluations.reduce((sum, e) => {
                  const scores = Object.values(e.scores).reduce(
                    (s, score) => s + score.points,
                    0
                  );
                  return sum + scores / Object.keys(e.scores).length;
                }, 0) / evaluations.length
              : 0;

          setStats({
            totalEvaluations,
            pendingEvaluations,
            completedEvaluations,
            averageScore: parseFloat(averageScore.toFixed(1)),
          });

          // Fetch recent activities
          const activities = evaluations.slice(0, 5).map((e) => ({
            id: e.id,
            action: `Completed ${e.formTitle} evaluation`,
            timestamp: e.submitted_at,
          }));
          setRecentActivities(activities);

          // Fetch quarterly performance from backend (logged-in user)
          const quarterlyData = await api.getMyQuarterlyReport();
          setQuarterlyPerformance(
            quarterlyData.length
              ? quarterlyData
              : [
                  { quarter: "Q1", score: 0 },
                  { quarter: "Q2", score: 0 },
                  { quarter: "Q3", score: 0 },
                  { quarter: "Q4", score: 0 },
                ]
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback
        setQuarterlyPerformance([
          { quarter: "Q1", score: 0 },
          { quarter: "Q2", score: 0 },
          { quarter: "Q3", score: 0 },
          { quarter: "Q4", score: 0 },
        ]);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    fetchUserData();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                <span className={styles.performanceScore}>
                  {stats.averageScore}%
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${stats.averageScore}%` }}
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
