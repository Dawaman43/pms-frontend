// components/ViewReports.jsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Reports.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";

const Reports = ({ employeeId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockReports = [
          {
            id: 1,
            title: "Q2 2025 Performance Review",
            score: 87.5,
            date: "2025-06-15",
            category: "Work Performance",
            evaluator: "Dr. Alemayehu Bekele",
            status: "Completed",
            adminComments: "Good progress shown this quarter. Focus on improving timeliness of deliverables. Excellent technical skills demonstrated.",
            details: [
              { criterion: "Technical Skills", score: 92, weight: 30 },
              { criterion: "Productivity", score: 85, weight: 25 },
              { criterion: "Teamwork", score: 88, weight: 20 },
              { criterion: "Communication", score: 82, weight: 15 },
              { criterion: "Initiative", score: 90, weight: 10 }
            ]
          },
          {
            id: 2,
            title: "Peer Feedback Summary",
            score: 85.0,
            date: "2025-06-10",
            category: "Behavioral",
            evaluator: "Peer Committee",
            status: "Completed",
            adminComments: "Excellent teamwork noted by multiple peers. Continue developing leadership skills.",
            details: [
              { criterion: "Collaboration", score: 89, weight: 40 },
              { criterion: "Communication", score: 83, weight: 30 },
              { criterion: "Reliability", score: 87, weight: 20 },
              { criterion: "Leadership", score: 78, weight: 10 }
            ]
          },
          {
            id: 3,
            title: "Q1 2025 Performance Review",
            score: 84.5,
            date: "2025-03-20",
            category: "Work Performance",
            evaluator: "Dr. Alemayehu Bekele",
            status: "Completed",
            adminComments: "Good start to the year. Recommended to focus more on documentation.",
            details: [
              { criterion: "Technical Skills", score: 88, weight: 30 },
              { criterion: "Productivity", score: 82, weight: 25 },
              { criterion: "Teamwork", score: 85, weight: 20 },
              { criterion: "Communication", score: 80, weight: 15 },
              { criterion: "Documentation", score: 76, weight: 10 }
            ]
          }
        ];
        setReports(mockReports);
        setLoading(false);
      }, 800);
    };
    fetchReports();
  }, [employeeId]);

  const viewReportDetails = (report) => {
    setSelectedReport(report);
  };

  const closeReportDetails = () => {
    setSelectedReport(null);
  };

  if (loading) {
    return (
      <div className={HomePageStyles.homeContainer}>
        <header className={HomePageStyles.header}>
          <div className={HomePageStyles.headerContent}>
            <div className={HomePageStyles.logoSection}>
              <img src="/astu_logo.svg" alt="ASTU Logo" className={HomePageStyles.logo} />
              <div className={HomePageStyles.systemTitle}>
                <h1>Performance Management System</h1>
                <p>Adama Science & Technology University</p>
              </div>
            </div>
            <div className={HomePageStyles.userSection}>
              <div className={HomePageStyles.userInfo}>
                <span className={HomePageStyles.userName}>Samuel Hailu Demse</span>
                <span className={HomePageStyles.userRole}>Software Programmer IV</span>
              </div>
              <div className={HomePageStyles.avatarContainer}>
                <img src="/assets/avatar-placeholder.png" alt="User Avatar" className={HomePageStyles.userAvatar} />
                <div className={HomePageStyles.statusIndicator}></div>
              </div>
            </div>
          </div>
        </header>
        
        <main className={HomePageStyles.mainContent}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading performance reports...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={HomePageStyles.homeContainer}>
      {/* Header */}
      <header className={HomePageStyles.header}>
        <div className={HomePageStyles.headerContent}>
          <div className={HomePageStyles.logoSection}>
            <img src="/astu_logo.svg" alt="ASTU Logo" className={HomePageStyles.logo} />
            <div className={HomePageStyles.systemTitle}>
              <h1>Performance Management System</h1>
              <p>Adama Science & Technology University</p>
            </div>
          </div>
          <div className={HomePageStyles.userSection}>
            <div className={HomePageStyles.userInfo}>
              <span className={HomePageStyles.userName}>Samuel Hailu Demse</span>
              <span className={HomePageStyles.userRole}>Software Programmer IV</span>
            </div>
            <div className={HomePageStyles.avatarContainer}>
              <img src="/assets/avatar-placeholder.png" alt="User Avatar" className={HomePageStyles.userAvatar} />
              <div className={HomePageStyles.statusIndicator}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={HomePageStyles.mainContent}>
        <section className={styles.contentSection}>
          <div className={styles.headerSection}>
            <h2 className={styles.pageTitle}>Performance Reports</h2>
            <p className={styles.pageSubtitle}>Review your historical performance evaluations</p>
          </div>

          {reports.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13H8" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 17H8" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 9H9H8" stroke="var(--gray-400)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No Reports Available</h3>
              <p>Your performance reports will appear here once available.</p>
            </div>
          ) : (
            <div className={styles.reportsTableContainer}>
              <table className={styles.reportsTable}>
                <thead>
                  <tr>
                    <th className={styles.tableHeader}>Report Title</th>
                    <th className={styles.tableHeader}>Category</th>
                    <th className={styles.tableHeader}>Date</th>
                    <th className={styles.tableHeader}>Score</th>
                    <th className={styles.tableHeader}>Status</th>
                    <th className={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div className={styles.reportTitle}>{report.title}</div>
                        <div className={styles.reportEvaluator}>{report.evaluator}</div>
                      </td>
                      <td className={styles.tableCell}>{report.category}</td>
                      <td className={styles.tableCell}>
                        {new Date(report.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.scoreContainer}>
                          <div className={styles.scorePill} style={{
                            backgroundColor: getScoreColor(report.score)
                          }}>
                            {report.score}%
                          </div>
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={`${styles.statusPill} ${styles[report.status.toLowerCase()]}`}>
                          {report.status}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        <button 
                          onClick={() => viewReportDetails(report)}
                          className={styles.viewButton}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Report Details Modal */}
        {selectedReport && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>{selectedReport.title}</h3>
                <button onClick={closeReportDetails} className={styles.closeButton}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.reportMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Date:</span>
                    <span>{new Date(selectedReport.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Evaluator:</span>
                    <span>{selectedReport.evaluator}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Overall Score:</span>
                    <span className={styles.scoreText} style={{ color: getScoreColor(selectedReport.score) }}>
                      {selectedReport.score}%
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Status:</span>
                    <span className={`${styles.statusText} ${styles[selectedReport.status.toLowerCase()]}`}>
                      {selectedReport.status}
                    </span>
                  </div>
                </div>

                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Performance Breakdown</h4>
                  <table className={styles.detailsTable}>
                    <thead>
                      <tr>
                        <th className={styles.detailsHeader}>Criterion</th>
                        <th className={styles.detailsHeader}>Weight</th>
                        <th className={styles.detailsHeader}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedReport.details.map((detail, index) => (
                        <tr key={index} className={styles.detailsRow}>
                          <td className={styles.detailsCell}>{detail.criterion}</td>
                          <td className={styles.detailsCell}>{detail.weight}%</td>
                          <td className={styles.detailsCell}>
                            <div className={styles.scoreBarContainer}>
                              <div 
                                className={styles.scoreBarFill} 
                                style={{
                                  width: `${detail.score}%`,
                                  backgroundColor: getScoreColor(detail.score)
                                }}
                              ></div>
                              <span className={styles.scoreValue}>{detail.score}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Evaluator Comments</h4>
                  <div className={styles.commentsBox}>
                    {selectedReport.adminComments}
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button onClick={closeReportDetails} className={styles.closeModalButton}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
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
  );
};

// Helper function to determine score color
function getScoreColor(score) {
  if (score >= 90) return '#38A169'; // Green for excellent
  if (score >= 80) return '#3182CE'; // Blue for good
  if (score >= 70) return '#D69E2E'; // Yellow for average
  return '#E53E3E'; // Red for below average
}

export default Reports;