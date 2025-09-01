"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./PeerEvaluation.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";
import Sidebar from "../sidebar";
import api from "../../../api";

const PeerEvaluation = () => {
  const [allForms, setAllForms] = useState([]);
  const [selectedFormIndex, setSelectedFormIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedPeers, setSelectedPeers] = useState([]);
  const [availablePeers, setAvailablePeers] = useState([]);
  const [activePeerIndex, setActivePeerIndex] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [showEvaluations, setShowEvaluations] = useState(false);

  const location = useLocation();

  // Use the same navLinks as in sidebar.jsx to ensure consistency
  const navLinks = [
    {
      title: "Dashboard",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 15C19.2669 15.3016 19.227 15.6363 19.2849 15.9606C19.3427 16.2849 19.4962 16.5836 19.725 16.8175C19.9538 17.0514 20.2473 17.2095 20.566 17.2709C20.8847 17.3323 21.2181 17.2943 21.52 17.16C22.3806 16.7591 23.1054 16.1044 23.5992 15.2836C24.0931 14.4628 24.3331 13.5124 24.29 12.555C24.3331 11.5976 24.0931 10.6472 23.5992 9.82639C23.1054 9.00555 22.3806 8.35093 21.52 7.95C21.2181 7.81567 20.8847 7.77774 20.566 7.83911C20.2473 7.90048 19.9538 8.05864 19.725 8.29254C19.4962 8.52643 19.3427 8.82515 19.2849 9.14944C19.227 9.47374 19.2669 9.80843 19.4 10.11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 15C4.73309 15.3016 4.773 15.6363 4.71511 15.9606C4.6573 16.2849 4.50381 16.5836 4.275 16.8175C4.04619 17.0514 3.75266 17.2095 3.434 17.2709C3.11534 17.3323 2.78191 17.2943 2.48 17.16C1.6194 16.7591 0.894564 16.1044 0.400785 15.2836C-0.093094 14.4628 -0.333109 13.5124 -0.290002 12.555C-0.333109 11.5976 -0.093094 10.6472 0.400785 9.82639C0.894564 9.00555 1.6194 8.35093 2.48 7.95C2.78191 7.81567 3.11534 7.77774 3.434 7.83911C3.75266 7.90048 4.04619 8.05864 4.275 8.29254C4.50381 8.52643 4.6573 8.82515 4.71511 9.14944C4.773 9.47374 4.73309 9.80843 4.6 10.11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.4 9C19.2669 8.6984 19.227 8.3637 19.2849 8.0394C19.3427 7.7151 19.4962 7.4164 19.725 7.1825C19.9538 6.9486 20.2473 6.7905 20.566 6.7291C20.8847 6.6677 21.2181 6.7056 21.52 6.84C22.3806 7.2409 23.1054 7.8956 23.5992 8.7164C24.0931 9.5372 24.3331 10.4876 24.29 11.445C24.3331 12.4024 24.0931 13.3528 23.5992 14.1736C23.1054 14.9944 22.3806 15.6491 21.52 16.05C21.2181 16.1843 20.8847 16.2223 20.566 16.1609C20.2473 16.0995 19.9538 15.9414 19.725 15.7075C19.4962 15.4736 19.3427 15.1749 19.2849 14.8506C19.227 14.5263 19.2669 14.1916 19.4 13.89"
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
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem("userData"));
        setUser(userData);

        // Fetch universal peer evaluation forms
        const formsData = await api.getTeamPeerEvaluationForms(null);
        setAllForms(formsData.forms || formsData);

        // Fetch all peers
        const peersData = await api.getAllUsersExceptCurrent();
        setAvailablePeers(peersData.map((p) => ({ ...p, ratings: {} })));

        // Fetch all evaluations
        const evaluationsData = await api.getAllEvaluations();
        setAllEvaluations(evaluationsData);

        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();

    // Handle mobile view
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false); // Close sidebar by default on mobile
      } else {
        setIsSidebarOpen(true); // Open sidebar by default on desktop
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleRatingChange = (peerIndex, criterionId, value) => {
    setSelectedPeers((prev) => {
      const newPeers = [...prev];
      newPeers[peerIndex].ratings = {
        ...newPeers[peerIndex].ratings,
        [criterionId]: value,
      };
      return newPeers;
    });
  };

  const handlePeerSelect = (peer) => {
    if (!selectedPeers.find((p) => p.id === peer.id)) {
      setSelectedPeers((prev) => [...prev, { ...peer, ratings: {} }]);
      setActivePeerIndex(selectedPeers.length);
    }
  };

  const handleRemovePeer = (index) => {
    setSelectedPeers((prev) => prev.filter((_, i) => i !== index));
    if (activePeerIndex >= index && activePeerIndex > 0) {
      setActivePeerIndex(activePeerIndex - 1);
    } else if (selectedPeers.length === 1) {
      setActivePeerIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const form = allForms[selectedFormIndex];
      const peer = selectedPeers[activePeerIndex];

      const evaluationData = {
        form_id: form.id,
        user_id: peer.id,
        scores: selectedPeers[activePeerIndex].ratings,
        comments: "", // Add comments input if needed
      };

      await api.submitEvaluation(evaluationData);
      setSuccess("Evaluation submitted successfully");

      // Update evaluations list
      const evaluationsData = await api.getAllEvaluations();
      setAllEvaluations(evaluationsData);

      // Reset ratings for the peer
      setSelectedPeers((prev) =>
        prev.map((p, i) => (i === activePeerIndex ? { ...p, ratings: {} } : p))
      );
    } catch (err) {
      setError(err.message || "Failed to submit evaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={HomePageStyles.homeContainer}>
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        navLinks={navLinks}
        user={user}
        isMobile={isMobile}
      />
      <div
        className={`${HomePageStyles.mainWrapper} ${
          isSidebarOpen ? "" : HomePageStyles.mainWrapperFull
        }`}
      >
        <main className={HomePageStyles.mainContent}>
          <section className={HomePageStyles.section}>
            <div className={styles.contentSection}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Loading peer evaluation data...</p>
                </div>
              ) : error ? (
                <div className={styles.errorMessage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 9L9 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 9L15 15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {error}
                </div>
              ) : success ? (
                <div className={styles.successMessage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9788C18.7182 19.7028 16.9033 20.9729 14.8354 21.5839C12.7674 22.195 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 4L12 14.01L9 11.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {success}
                </div>
              ) : null}

              {showEvaluations && allEvaluations.length > 0 && (
                <div className={styles.evaluationTableContainer}>
                  <table className={styles.evaluationTable}>
                    <thead>
                      <tr>
                        <th className={styles.tableHeader}>ID</th>
                        <th className={styles.tableHeader}>Form ID</th>
                        <th className={styles.tableHeader}>User ID</th>
                        <th className={styles.tableHeader}>Evaluator ID</th>
                        <th className={styles.tableHeader}>Scores</th>
                        <th className={styles.tableHeader}>Comments</th>
                        <th className={styles.tableHeader}>Submitted At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allEvaluations.map((evaluation) => (
                        <tr key={evaluation.id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{evaluation.id}</td>
                          <td className={styles.tableCell}>
                            {evaluation.form_id}
                          </td>
                          <td className={styles.tableCell}>
                            {evaluation.user_id}
                          </td>
                          <td className={styles.tableCell}>
                            {evaluation.evaluator_id}
                          </td>
                          <td className={styles.tableCell}>
                            {JSON.stringify(evaluation.scores)}
                          </td>
                          <td className={styles.tableCell}>
                            {evaluation.comments || "None"}
                          </td>
                          <td className={styles.tableCell}>
                            {new Date(evaluation.submitted_at).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className={styles.formSelector}>
                <label htmlFor="formSelect">Select Evaluation Form</label>
                <select
                  id="formSelect"
                  className={styles.formSelect}
                  value={selectedFormIndex}
                  onChange={(e) => setSelectedFormIndex(Number(e.target.value))}
                >
                  {allForms.map((form, index) => (
                    <option key={form.id} value={index}>
                      {form.title} ({form.formType})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.peerEvaluationContainer}>
                <div className={styles.peerSelectionPanel}>
                  <h3 className={styles.panelTitle}>
                    Select Peers to Evaluate
                  </h3>
                  <div className={styles.peerList}>
                    {availablePeers.map((peer) => (
                      <div
                        key={peer.id}
                        className={styles.peerCard}
                        onClick={() => handlePeerSelect(peer)}
                      >
                        <div className={styles.peerAvatar}>
                          {peer.name.charAt(0)}
                        </div>
                        <div className={styles.peerInfo}>
                          <h4 className={styles.peerName}>{peer.name}</h4>
                          <p className={styles.peerRole}>{peer.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.evaluationPanel}>
                  <h3 className={styles.panelTitle}>Evaluation</h3>
                  <div className={styles.selectedPeerTabs}>
                    {selectedPeers.map((peer, index) => (
                      <div
                        key={peer.id}
                        className={`${styles.peerTab} ${
                          activePeerIndex === index ? styles.activeTab : ""
                        }`}
                        onClick={() => setActivePeerIndex(index)}
                      >
                        {peer.name}
                        <button
                          className={styles.removePeerButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePeer(index);
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 6L6 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6 6L18 18"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {activePeerIndex !== null && allForms.length > 0 && (
                    <div className={styles.evaluationForm}>
                      <div className={styles.activePeerHeader}>
                        <h4>
                          Evaluating: {selectedPeers[activePeerIndex].name}
                        </h4>
                        <p>
                          {selectedPeers[activePeerIndex].role} | Department ID:{" "}
                          {selectedPeers[activePeerIndex].department_id}
                        </p>
                      </div>

                      {allForms.map((form) => (
                        <div key={form.id}>
                          <h5>
                            {form.title} – {form.description}
                          </h5>
                          <form onSubmit={handleSubmit}>
                            <div className={styles.evaluationTableContainer}>
                              <table className={styles.evaluationTable}>
                                <thead>
                                  <tr>
                                    <th className={styles.tableHeader}>#</th>
                                    <th className={styles.tableHeader}>
                                      Criterion
                                    </th>
                                    <th className={styles.tableHeader}>
                                      Weight
                                    </th>
                                    <th className={styles.tableHeader}>
                                      Rating
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {form.sections.flatMap((section, sIndex) =>
                                    section.criteria.map(
                                      (criterion, cIndex) => (
                                        <tr
                                          key={
                                            criterion.id ||
                                            `${sIndex}-${cIndex}`
                                          }
                                          className={styles.tableRow}
                                        >
                                          <td className={styles.tableCell}>
                                            {sIndex + 1}.{cIndex + 1}
                                          </td>
                                          <td className={styles.tableCell}>
                                            {criterion.name}
                                          </td>
                                          <td className={styles.tableCell}>
                                            {criterion.weight}%
                                          </td>
                                          <td className={styles.tableCell}>
                                            <select
                                              value={
                                                selectedPeers[activePeerIndex]
                                                  .ratings[criterion.id] || ""
                                              }
                                              onChange={(e) =>
                                                handleRatingChange(
                                                  activePeerIndex,
                                                  criterion.id,
                                                  e.target.value
                                                )
                                              }
                                              className={styles.ratingSelect}
                                              required
                                            >
                                              <option value="" disabled>
                                                Select
                                              </option>
                                              {form.ratingScale.map((scale) => (
                                                <option
                                                  key={scale.value}
                                                  value={scale.value}
                                                >
                                                  {scale.value} - {scale.label}
                                                </option>
                                              ))}
                                            </select>
                                          </td>
                                        </tr>
                                      )
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <div className={styles.formActions}>
                              <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <svg
                                      className={styles.spinner}
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className={styles.path}
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="none"
                                        strokeWidth="4"
                                      />
                                    </svg>
                                    Submitting...
                                  </>
                                ) : (
                                  `Submit ${form.title}`
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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

export default PeerEvaluation;
