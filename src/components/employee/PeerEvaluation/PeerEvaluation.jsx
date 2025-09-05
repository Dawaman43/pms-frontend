"use client";

import { useState, useEffect, useRef } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allEvaluations, setAllEvaluations] = useState([]);
  const [showEvaluations, setShowEvaluations] = useState(false);
  const [activePopout, setActivePopout] = useState(null);
  const hasFetched = useRef(false);
  const location = useLocation();

  // Navigation links (same as SelfAssessment.jsx)
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
      active: location.pathname === "/home",
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

  // Hardcoded rating scale (aligned with SelfAssessment.jsx)
  const ratingScale = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Excellent" },
  ];

  // Calculate point for a single criterion: ((weight * level) / 4) * formWeight
  const calculatePoint = (criterionWeight, level, formWeight) => {
    if (!criterionWeight || !level || !formWeight) return 0;
    // Formula: ((criterionWeight * level) / 4) * (formWeight / 100)
    // formWeight is assumed to be a percentage (e.g., 70 for 70%)
    return parseFloat(
      (((criterionWeight * level) / 4) * (formWeight / 100)).toFixed(2)
    );
  };

  // Calculate total points and average for a peer's evaluation
  const calculatePeerTotals = (peer, form) => {
    if (!peer || !peer.ratings || !form || !form.sections || !form.weight) {
      return { totalPoints: 0, average: 0 };
    }

    // Total points: sum of raw user-selected scores (levels)
    const totalPoints = form.sections
      .flatMap((section) => section.criteria)
      .reduce((sum, criterion) => {
        const score = parseFloat(peer.ratings[criterion.id] || 0);
        return sum + (score || 0);
      }, 0);

    // Average: sum of calculated points
    const totalCalculatedPoints = form.sections
      .flatMap((section) => section.criteria)
      .reduce((sum, criterion) => {
        const score = parseFloat(peer.ratings[criterion.id] || 0);
        const criterionWeight = parseFloat(criterion.weight || 0);
        const formWeight = parseFloat(form.weight || 0);
        return (
          sum + (score ? calculatePoint(criterionWeight, score, formWeight) : 0)
        );
      }, 0);

    const average = parseFloat(totalCalculatedPoints.toFixed(2));
    return { totalPoints, average };
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActivePopout(null);
  };

  const togglePopout = (item) => {
    setActivePopout(activePopout === item ? null : item);
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const tokenData = localStorage.getItem("userData");
        if (!tokenData) throw new Error("User not logged in");
        const userData = JSON.parse(tokenData);
        const userResponse = await api.getUserById(userData.id);
        setUser({
          id: userResponse.id,
          name: userResponse.name,
          email: userResponse.email,
          role: userResponse.role,
          department:
            userResponse.department || "Information Communication Technology",
          position: userResponse.jobTitle || "Employee",
          avatar: userResponse.profileImage
            ? `${userResponse.profileImage}?t=${new Date().getTime()}`
            : "/assets/avatar-placeholder.png",
          employeeId:
            userResponse.employeeId ||
            `ASTU-ICT-${String(userResponse.id).padStart(3, "0")}`,
          phone: userResponse.phone || "",
        });

        // Fetch universal peer evaluation forms
        const formsData = await api.getTeamPeerEvaluationForms(null);
        const forms = (formsData.forms || formsData).map((form) => {
          let parsedForm = { ...form };
          try {
            if (typeof form.sections === "string") {
              parsedForm.sections = JSON.parse(form.sections);
            }
            if (
              !Array.isArray(parsedForm.sections) ||
              !parsedForm.sections.every(
                (section) =>
                  Array.isArray(section.criteria) && section.criteria.length
              )
            ) {
              console.warn(
                `Invalid sections for form ${form.id}:`,
                parsedForm.sections
              );
              parsedForm.sections = [];
            }
          } catch (e) {
            console.error(`Failed to parse sections for form ${form.id}:`, e);
            parsedForm.sections = [];
          }

          // Assign fixed rating scale (aligned with SelfAssessment)
          parsedForm.ratingScale = ratingScale;

          return parsedForm;
        });

        setAllForms(forms);

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

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    fetchData();
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
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

      // Validate that all criteria have ratings
      const allCriteriaRated = form.sections
        .flatMap((section) => section.criteria)
        .every((criterion) => peer.ratings[criterion.id]);

      if (!allCriteriaRated) {
        throw new Error("Please provide ratings for all criteria");
      }

      const evaluationData = {
        form_id: form.id,
        user_id: peer.id,
        evaluator_id: user.id,
        scores: selectedPeers[activePeerIndex].ratings,
        comments: "",
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

  if (loading || !user) {
    return (
      <div className={HomePageStyles.homeContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading peer evaluation data...</p>
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
                  onError={(e) => {
                    console.error("Header avatar failed to load:", user.avatar);
                    e.target.src = "/assets/avatar-placeholder.png";
                  }}
                />
                <div className={HomePageStyles.statusIndicator}></div>
              </div>
            </div>
          </div>
        </header>

        <main className={HomePageStyles.mainContent}>
          <section className={HomePageStyles.section}>
            <div className={styles.contentSection}>
              {error ? (
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

                      {allForms[selectedFormIndex] && (
                        <div key={allForms[selectedFormIndex].id}>
                          <h5>
                            {allForms[selectedFormIndex].title} –{" "}
                            {allForms[selectedFormIndex].description}
                          </h5>
                          <p>
                            <strong>Form Weight:</strong>{" "}
                            {allForms[selectedFormIndex].weight || "N/A"}%
                          </p>
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
                                      Score
                                    </th>
                                    <th className={styles.tableHeader}>
                                      Calculated Point
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allForms[selectedFormIndex].sections.flatMap(
                                    (section, sIndex) =>
                                      section.criteria.map(
                                        (criterion, cIndex) => {
                                          const score = parseFloat(
                                            selectedPeers[activePeerIndex]
                                              .ratings[criterion.id] || 0
                                          );
                                          const calculatedPoint = score
                                            ? calculatePoint(
                                                criterion.weight,
                                                score,
                                                allForms[selectedFormIndex]
                                                  .weight
                                              )
                                            : 0;
                                          return (
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
                                                {criterion.weight
                                                  ? `${criterion.weight}%`
                                                  : "N/A"}
                                              </td>
                                              <td className={styles.tableCell}>
                                                <select
                                                  value={
                                                    selectedPeers[
                                                      activePeerIndex
                                                    ].ratings[criterion.id] ||
                                                    ""
                                                  }
                                                  onChange={(e) =>
                                                    handleRatingChange(
                                                      activePeerIndex,
                                                      criterion.id,
                                                      e.target.value
                                                    )
                                                  }
                                                  className={
                                                    styles.ratingSelect
                                                  }
                                                  required
                                                >
                                                  <option value="" disabled>
                                                    Select
                                                  </option>
                                                  {ratingScale.map((scale) => (
                                                    <option
                                                      key={scale.value}
                                                      value={scale.value}
                                                    >
                                                      {scale.value} -{" "}
                                                      {scale.label}
                                                    </option>
                                                  ))}
                                                </select>
                                              </td>
                                              <td className={styles.tableCell}>
                                                {calculatedPoint.toFixed(2)}
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )
                                  )}
                                </tbody>
                              </table>
                              {selectedPeers[activePeerIndex] && (
                                <div className={styles.totals}>
                                  <p>
                                    <strong>Total Score:</strong>{" "}
                                    {calculatePeerTotals(
                                      selectedPeers[activePeerIndex],
                                      allForms[selectedFormIndex]
                                    ).totalPoints.toFixed(0)}
                                  </p>
                                  <p>
                                    <strong>Average (Weighted Points):</strong>{" "}
                                    {calculatePeerTotals(
                                      selectedPeers[activePeerIndex],
                                      allForms[selectedFormIndex]
                                    ).average.toFixed(2)}
                                    %
                                  </p>
                                </div>
                              )}
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
                                  `Submit ${allForms[selectedFormIndex].title}`
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
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
