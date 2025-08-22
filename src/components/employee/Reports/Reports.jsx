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
    { name: "Dashboard", path: "/" },
    { name: "Evaluations", path: "/evaluations" },
    { name: "Reports", path: "/reports" },
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
        const tokenData = localStorage.getItem("userData");
        if (!tokenData) throw new Error("User not logged in");
        const userData = JSON.parse(tokenData);
        const response = await api.getUserById(userData.id);
        setUser({
          id: response.id,
          name: response.name,
          role: response.role,
          department:
            response.department || "Information Communication Technology",
          avatar: response.avatar || "/assets/avatar-placeholder.png",
          employeeId:
            response.employeeId ||
            `ASTU-ICT-${String(response.id).padStart(3, "0")}`,
        });
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user data");
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
      <div className={HomePageStyles.homeContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading performance reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={HomePageStyles.homeContainer}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        navLinks={navLinks}
        activePopout={activePopout}
        togglePopout={togglePopout}
        location={location}
      />

      <div
        className={`${HomePageStyles.mainWrapper} ${
          !isSidebarOpen ? HomePageStyles.mainWrapperFull : ""
        }`}
      >
        <header className={HomePageStyles.header}>
          <div className={HomePageStyles.headerContent}>
            <div className={HomePageStyles.headerLeft}>
              {isMobile && (
                <button
                  className={HomePageStyles.mobileMenuButton}
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

        <main className={HomePageStyles.mainContent}>
          <section className={styles.contentSection}>
            <div className={styles.headerSection}>
              <h2 className={styles.pageTitle}>Performance Reports</h2>
              <p className={styles.pageSubtitle}>
                View and export your performance reports
              </p>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}

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
                >
                  Generate Report
                </button>
                <button onClick={exportCSV} className={styles.submitButton}>
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
