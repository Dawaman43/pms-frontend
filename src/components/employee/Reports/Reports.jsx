"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../../api";
import styles from "./Reports.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";
import Sidebar from "../sidebar";

const Reports = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePopout, setActivePopout] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const location = useLocation();

  const navLinks = [
    {
      title: "Dashboard",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 22V12H15V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/home",
      active: location.pathname === "/home" || location.pathname === "/",
    },
    {
      title: "Self Assessment",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
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
      ),
      link: "/self-assessment",
      active: location.pathname === "/self-assessment",
    },
    {
      title: "Peer Evaluation",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 19V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/peer-evaluation",
      active: location.pathname === "/peer-evaluation",
    },
    {
      title: "Reports",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 3H3V21H21V3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 8H15V12H9V8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 16H7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 12H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M7 12H9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/reports",
      active: location.pathname === "/reports",
    },
    {
      title: "Profile",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/profile",
      active: location.pathname === "/profile",
    },
    {
      title: "Settings",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15C19.2669 15.3016 19.227 15.6363 19.2849 15.9606C19.3427 16.2849 19.4962 16.5836 19.725 16.8175C19.9538 17.0514 20.2473 17.2095 20.566 17.2709C20.8847 17.3323 21.2181 17.2943 21.52 17.16C22.3806 16.7591 23.1054 16.1044 23.5992 15.2836C24.0931 14.4628 24.3331 13.5124 24.29 12.555C24.3331 11.5976 24.0931 10.6472 23.5992 9.82639C23.1054 9.00555 22.3806 8.35093 21.52 7.95C21.2181 7.81567 20.8847 7.77774 20.566 7.83911C20.2473 7.90048 19.9538 8.05862 19.725 8.29251C19.4962 8.5264 19.3427 8.82514 19.2849 9.14944C19.227 9.47374 19.2669 9.80843 19.4 10.11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 8.85C4.73309 8.54843 4.77297 8.21374 4.71513 7.88944C4.65729 7.56514 4.50383 7.2664 4.27504 7.03251C4.04624 6.79862 3.75275 6.64048 3.43402 6.57911C3.11529 6.51774 2.78192 6.55567 2.48 6.69C1.61943 7.09094 0.894552 7.74556 0.400795 8.56639C-0.0930599 9.38723 -0.333065 10.3376 -0.29 11.295C-0.333065 12.2524 -0.0930599 13.2028 0.400795 14.0236C0.894552 14.8444 1.61943 15.4991 2.48 15.9C2.78192 16.0343 3.11529 16.0723 3.43402 16.0109C3.75275 15.9495 4.04624 15.7914 4.27504 15.5575C4.50383 15.3236 4.65729 15.0249 4.71513 14.7006C4.77297 14.3763 4.73309 14.0416 4.6 13.74"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      link: "/settings",
      active: location.pathname === "/settings",
    },
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const tokenData = localStorage.getItem("userData");
        if (!tokenData) {
          throw new Error("User not logged in. Please log in again.");
        }
        const userData = JSON.parse(tokenData);
        const response = await api.getUserById(userData.id);
        if (!response || !response.id) {
          throw new Error("Invalid user data received from server");
        }
        const userInfo = {
          id: response.id,
          name: response.name || "Unknown User",
          role: response.role || "User",
          department:
            response.department || "Information Communication Technology",
          avatar: response.profileImage
            ? `${response.profileImage}`
            : "/assets/avatar-placeholder.png",
          employeeId:
            response.employeeId ||
            `ASTU-ICT-${String(response.id).padStart(3, "0")}`,
        };
        setUser(userInfo);

        // Verify avatar URL
        if (response.profileImage) {
          const img = new Image();
          img.src = response.profileImage;
          img.onload = () =>
            console.log("Avatar loaded successfully:", response.profileImage);
          img.onerror = () => {
            console.error("Failed to load avatar:", response.profileImage);
            setUser((prev) => ({
              ...prev,
              avatar: "/assets/avatar-placeholder.png",
            }));
            setError("Failed to load profile picture. Using default avatar.");
          };
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const fetchReports = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      let data;

      if (user.role === "admin") {
        data = await api.generatePerformanceReport();
      } else {
        data = await api.generateEmployeeReport(user.id);
      }

      console.log("Raw API response:", data);

      const mappedReports = data.flatMap((r) => {
        const peerScores = Array.isArray(r.peerScores) ? r.peerScores : [];
        const selfScores = Array.isArray(r.selfScores) ? r.selfScores : [];

        const flattenScores = (arr) => arr.flatMap((obj) => Object.values(obj));

        const allPeerScores = flattenScores(peerScores);
        const allSelfScores = flattenScores(selfScores);

        const peerAvg =
          allPeerScores.length > 0
            ? (
                allPeerScores.reduce((sum, val) => sum + val, 0) /
                allPeerScores.length
              ).toFixed(2)
            : "N/A";

        const selfAvg =
          allSelfScores.length > 0
            ? (
                allSelfScores.reduce((sum, val) => sum + val, 0) /
                allSelfScores.length
              ).toFixed(2)
            : "N/A";

        const reportsList = [];

        if (peerAvg !== "N/A") {
          reportsList.push({
            id: `${r.employeeId}-peer`,
            title: `Peer Evaluation for ${r.employeeName}`,
            category: "Peer",
            date: new Date().toISOString(),
            score: peerAvg,
            status: r.totalEvaluations > 0 ? "Submitted" : "Pending",
            evaluator: "Peer Group",
            details: `Peer Avg: ${peerAvg}, Total Evaluations: ${r.totalEvaluations}`,
          });
        }

        if (selfAvg !== "N/A") {
          reportsList.push({
            id: `${r.employeeId}-self`,
            title: `Self Evaluation for ${r.employeeName}`,
            category: "Self",
            date: new Date().toISOString(),
            score: selfAvg,
            status: r.totalEvaluations > 0 ? "Submitted" : "Pending",
            evaluator: r.employeeName || "Self",
            details: `Self Avg: ${selfAvg}, Total Evaluations: ${r.totalEvaluations}`,
          });
        }

        return reportsList;
      });

      setReports(mappedReports);
      setSuccess("Report generated successfully");
      console.log("Updated reports state:", mappedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to fetch reports: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    await fetchReports();
  };

  const togglePopout = (item) => {
    setActivePopout(activePopout === item ? null : item);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActivePopout(null);
  };

  const viewReportDetails = (report) => {
    setSelectedReport(report);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
  };

  const getScoreColor = (score) => {
    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) return "#E53E3E";
    if (numericScore >= 4) return "#38A169";
    if (numericScore >= 3) return "#3182CE";
    if (numericScore >= 2) return "#D69E2E";
    return "#E53E3E";
  };

  const exportCSV = () => {
    if (!reports || reports.length === 0) return;

    const headers = [
      "Title",
      "Category",
      "Date",
      "Score",
      "Status",
      "Evaluator",
    ];

    const filteredReports =
      activeTab === "all"
        ? reports
        : reports.filter(
            (report) => report.category.toLowerCase() === activeTab
          );

    const rows = filteredReports.map((r) => [
      r.title || "N/A",
      r.category || "N/A",
      r.date ? new Date(r.date).toLocaleDateString() : "N/A",
      r.score || "N/A",
      r.status || "N/A",
      r.evaluator || "N/A",
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${user.employeeId}_${activeTab}_reports.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports =
    activeTab === "all"
      ? reports
      : reports.filter((report) => report.category.toLowerCase() === activeTab);

  if (loading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading performance reports...</p>
      </div>
    );
  }

  if (error && error.includes("User not logged in")) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
              fill="#E53E3E"
            />
          </svg>
          {error}
        </div>
        <Link to="/login" className={styles.loginButton}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        navLinks={navLinks}
        activePopout={activePopout}
        setActivePopout={setActivePopout}
      />

      <div
        className={`${styles.mainContent} ${
          isSidebarOpen && !isMobile
            ? HomePageStyles.mainWrapper
            : HomePageStyles.mainWrapperFull
        }`}
      >
        <header className={styles.header}>
          <div className={HomePageStyles.headerContent}>
            {isMobile && (
              <button
                className={HomePageStyles.mobileMenuButton}
                onClick={toggleSidebar}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12H21M3 6H21M3 18H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            <h1 className={styles.pageTitle}>Performance Reports</h1>
            <div className={HomePageStyles.userSection}>
              <div className={HomePageStyles.userInfo}>
                <span className={HomePageStyles.userName}>{user.name}</span>
                <span className={HomePageStyles.userRole}>{user.role}</span>
              </div>
              <div className={HomePageStyles.avatarContainer}>
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className={styles.avatar}
                  onError={(e) => {
                    e.target.src = "/assets/avatar-placeholder.png";
                    console.error("Failed to load avatar:", user.avatar);
                  }}
                />
                <span className={HomePageStyles.statusIndicator}></span>
              </div>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.contentSection}>
            {error && (
              <div className={styles.errorMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="#E53E3E"
                  />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className={styles.successMessage}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#38A169"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {success}
              </div>
            )}

            <div className={styles.reportsContainer}>
              <div className={styles.tabContainer}>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "all" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Reports
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "peer" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("peer")}
                >
                  Peer Reports
                </button>
                <button
                  className={`${styles.tabButton} ${
                    activeTab === "self" ? styles.activeTab : ""
                  }`}
                  onClick={() => setActiveTab("self")}
                >
                  Self Reports
                </button>
              </div>

              <div className={styles.formActions}>
                <button
                  onClick={handleGenerateReport}
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className={styles.spinner} viewBox="0 0 50 50">
                        <circle
                          className={styles.path}
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          strokeWidth="5"
                        ></circle>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Generate Report"
                  )}
                </button>
                <button
                  onClick={exportCSV}
                  className={styles.submitButton}
                  disabled={reports.length === 0}
                >
                  Export as CSV
                </button>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.reportsTable}>
                  <thead>
                    <tr>
                      <th className={styles.tableHeader}>Title</th>
                      <th className={styles.tableHeader}>Category</th>
                      <th className={styles.tableHeader}>Date</th>
                      <th className={styles.tableHeader}>Score</th>
                      <th className={styles.tableHeader}>Status</th>
                      <th className={styles.tableHeader}>Evaluator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan="6" className={styles.emptyState}>
                          No{" "}
                          {activeTab === "all"
                            ? ""
                            : activeTab === "peer"
                            ? "peer"
                            : "self"}{" "}
                          reports available. Click "Generate Report" to fetch
                          the latest data.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          onClick={() => viewReportDetails(report)}
                          className={styles.tableRow}
                        >
                          <td className={styles.tableCell}>
                            {report.title || "N/A"}
                          </td>
                          <td className={styles.tableCell}>
                            {report.category || "N/A"}
                          </td>
                          <td className={styles.tableCell}>
                            {report.date
                              ? new Date(report.date).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td
                            className={styles.tableCell}
                            style={{ color: getScoreColor(report.score) }}
                          >
                            {report.score || "N/A"}
                          </td>
                          <td className={styles.tableCell}>
                            {report.status || "N/A"}
                          </td>
                          <td className={styles.tableCell}>
                            {report.evaluator || "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {selectedReport && (
                <div className={styles.reportDetails}>
                  <h3 className={styles.panelTitle}>
                    {selectedReport.title || "N/A"}
                  </h3>
                  <p>{selectedReport.details || "No details available"}</p>
                  <button
                    onClick={closeReportDetails}
                    className={styles.cancelButton}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className={HomePageStyles.footer}>
          <div className={HomePageStyles.footerContent}>
            <p>
              &copy; {new Date().getFullYear()} Adama Science & Technology
              University. All rights reserved.
            </p>
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

export default Reports;
