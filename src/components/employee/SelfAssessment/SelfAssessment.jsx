"use client";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./SelfAssessment.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";
import Sidebar from "../sidebar";
import api from "../../../api";

const SelfAssessment = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePopout, setActivePopout] = useState(null);
  const location = useLocation();
  const hasFetched = useRef(false);
  const popoutRef = useRef(null);

  // Navigation links (aligned with PeerEvaluation.jsx)
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

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close popout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoutRef.current && !popoutRef.current.contains(event.target)) {
        setActivePopout(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch forms and user data
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const userDataRaw = localStorage.getItem("userData") || "{}";
        const userDataStored = JSON.parse(userDataRaw);
        if (!userDataStored.id) {
          throw new Error("User not authenticated");
        }

        const user = await api.getUserById(userDataStored.id);
        console.log("Fetched user:", user); // Debug user object

        // --- START OF THE FIX ---
        // Format the user data to match what the Sidebar component expects.
        const formattedUser = {
          id: user.id,
          name: user.name || "Unknown User",
          email: user.email || "",
          role: user.role || "User",
          position: user.jobTitle || "Employee",
          avatar: user.profileImage // Use 'profileImage' from API
            ? `${user.profileImage}`
            : "/assets/avatar-placeholder.png", // Provide a fallback
          employeeId: user.id || "",
          phone: user.phone || "",
        };
        setUser(formattedUser);
        // --- END OF THE FIX ---

        const formsData = await api.getEvaluationForms();
        const selfAssessmentForms = formsData
          .filter(
            (f) => f.formType === "self_assessment" && f.status === "active"
          )
          .map((f) => ({
            ...f,
            ratings: {},
            criteria: f.criteria?.map((criterion, index) => ({
              ...criterion,
              id: criterion.id || `temp-id-${index}`,
            })),
          }));

        setForms(selfAssessmentForms);
        setFormData(
          selfAssessmentForms.reduce(
            (acc, form) => ({
              ...acc,
              [form.id]: {
                employeeName: formattedUser.name || "",
                employeeId: formattedUser.id || "",
                comments: "",
              },
            }),
            {}
          )
        );

        // Log forms to debug missing criterion IDs
        selfAssessmentForms.forEach((form) => {
          if (form.criteria.some((criterion) => !criterion.id)) {
            console.warn(
              `Form ${form.id} has criteria with missing IDs:`,
              form.criteria
            );
          }
        });
      } catch (err) {
        setError(err.message || "Failed to fetch forms or user data");
        if (err.message.includes("User not authenticated")) {
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hardcoded rating scale (aligned with PeerEvaluation.jsx)
  const ratingScale = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Excellent" },
  ];

  // Calculate point for a single criterion: ((weight * level) / 4) * formWeight
  const calculatePoint = (criterionWeight, level, formWeight) => {
    if (!criterionWeight || !level || !formWeight) return 0;
    return parseFloat(
      (((criterionWeight * level) / 4) * (formWeight / 100)).toFixed(2)
    );
  };

  // Calculate total points and average for a form
  const calculateFormTotals = (formId) => {
    const form = forms.find((f) => f.id === formId);
    if (!form || !form.ratings || !form.criteria || !form.weight) {
      return { totalPoints: 0, average: 0 };
    }
    const totalPoints = form.criteria.reduce((sum, criterion) => {
      const score = parseFloat(form.ratings[criterion.id] || 0);
      return sum + (score || 0);
    }, 0);
    const totalCalculatedPoints = form.criteria.reduce((sum, criterion) => {
      const score = parseFloat(form.ratings[criterion.id] || 0);
      const criterionWeight = parseFloat(criterion.weight || 0);
      const formWeight = parseFloat(form.weight || 0);
      return (
        sum + (score ? calculatePoint(criterionWeight, score, formWeight) : 0)
      );
    }, 0);
    const average = parseFloat(totalCalculatedPoints.toFixed(2));
    return { totalPoints, average };
  };

  // Handle rating change
  const handleRatingChange = (formId, criterionId, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              ratings: {
                ...form.ratings,
                [criterionId]: value,
              },
            }
          : form
      )
    );
  };

  // Submit assessment
  const handleSubmit = async (e, formId) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const form = forms.find((f) => f.id === formId);
      if (!form || !form.criteria) throw new Error("Form not found");

      const scores = {};
      let allCriteriaRated = true;
      form.criteria.forEach((criterion, index) => {
        const id = criterion.id || `temp-id-${index}`;
        const score = parseFloat(form.ratings[id] ?? 0);
        if (isNaN(score) || score === 0) allCriteriaRated = false;
        scores[id] = score;
      });

      if (!allCriteriaRated) throw new Error("Please rate all criteria");

      const evaluationData = {
        user_id: user.id,
        form_id: formId,
        scores: JSON.stringify(scores),
        comments: formData[formId]?.comments || "",
        period_id: form.period_id || 1,
      };

      await api.submitEvaluation(evaluationData);
      setSuccess("Self-assessment submitted successfully!");
      setForms((prev) =>
        prev.map((f) => (f.id === formId ? { ...f, ratings: {} } : f))
      );
      setFormData((prev) => ({
        ...prev,
        [formId]: { ...prev[formId], comments: "" },
      }));
    } catch (err) {
      setError(err.message || "Failed to submit self-assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActivePopout(null);
  };

  const togglePopout = (item) => {
    setActivePopout(activePopout === item ? null : item);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    return names
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className={styles.container}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        navLinks={navLinks}
        activePopout={activePopout}
        togglePopout={togglePopout}
        user={user} // Now passing correctly formatted user object
      />
      <div
        className={`${styles.mainContent} ${
          isSidebarOpen ? "" : styles.mainContentFull
        }`}
      >
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className={styles.mobileMenuButton}
                  aria-label="Toggle sidebar"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 12H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 18H21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              <h1 className={styles.title}>Self Assessment</h1>
            </div>
            <div className={styles.headerRight}>
              <div className={styles.userInfo} ref={popoutRef}>
                {user ? (
                  <button
                    className={styles.profileButton}
                    onClick={() => togglePopout("profile")}
                    aria-label="User profile"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="User avatar"
                        className={styles.userAvatar}
                        onError={(e) => {
                          console.error("Avatar load failed:", user.avatar);
                          e.target.style.display = "none";
                          setUser((prev) => ({ ...prev, avatar: null })); // fallback to initials
                        }}
                      />
                    ) : (
                      <div
                        className={`${styles.userAvatar} ${styles.userAvatarInitials}`}
                      >
                        {getInitials(user.name || "Unknown User")}
                      </div>
                    )}
                  </button>
                ) : (
                  <div
                    className={`${styles.userAvatar} ${styles.userAvatarInitials}`}
                  >
                    <span>Loading...</span>
                  </div>
                )}
                {activePopout === "profile" && user && (
                  <div className={styles.popout}>
                    <Link to="/profile">Profile</Link>
                    <Link to="/settings">Settings</Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem("userData");
                        window.location.href = "/login";
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className={styles.main}>
          <section className={styles.contentSection}>
            {loading && (
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
                <p>Loading self-assessment forms...</p>
              </div>
            )}
            {error && (
              <div className={styles.errorMessage}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className={styles.successMessage}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}
            {!forms.length && !error && (
              <div className={styles.noDataMessage}>
                No self-assessment forms available at the moment.
              </div>
            )}
            {forms.map((form) => {
              const { totalPoints, average } = calculateFormTotals(form.id);
              return (
                <form
                  key={form.id}
                  onSubmit={(e) => handleSubmit(e, form.id)}
                  className={styles.assessmentForm}
                  aria-label={`Self-assessment form: ${form.title}`}
                >
                  <div className={styles.formHeader}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Employee Name</label>
                      <input
                        type="text"
                        value={
                          formData[form.id]?.employeeName || user?.name || ""
                        }
                        className={styles.formInput}
                        disabled
                        aria-readonly="true"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Employee ID</label>
                      <input
                        type="text"
                        value={formData[form.id]?.employeeId || user?.id || ""}
                        className={styles.formInput}
                        disabled
                        aria-readonly="true"
                      />
                    </div>
                  </div>
                  <div className={styles.evaluationTableContainer}>
                    <h3 className={styles.formTitle}>{form.title}</h3>
                    <p className={styles.formDescription}>{form.description}</p>
                    <p>
                      <strong>Form Weight:</strong> {form.weight || "N/A"}%
                    </p>
                    {form.criteria?.length ? (
                      <>
                        <table
                          className={styles.evaluationTable}
                          aria-label="Evaluation criteria"
                        >
                          <thead>
                            <tr>
                              <th scope="col" className={styles.tableHeader}>
                                No
                              </th>
                              <th scope="col" className={styles.tableHeader}>
                                Behavioral Indicators
                              </th>
                              <th scope="col" className={styles.tableHeader}>
                                Weight
                              </th>
                              <th scope="col" className={styles.tableHeader}>
                                Score
                              </th>
                              <th scope="col" className={styles.tableHeader}>
                                Calculated Point
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.criteria.map((criterion, index) => {
                              const score = parseFloat(
                                form.ratings[criterion.id] || 0
                              );
                              const calculatedPoint = score
                                ? calculatePoint(
                                    criterion.weight,
                                    score,
                                    form.weight
                                  )
                                : 0;
                              const rowKey = criterion.id
                                ? `${form.id}-${criterion.id}`
                                : `${form.id}-index-${index}`;
                              return (
                                <tr key={rowKey} className={styles.tableRow}>
                                  <td className={styles.tableCell}>
                                    {index + 1}
                                  </td>
                                  <td className={styles.tableCell}>
                                    {criterion.name || "Unnamed Criterion"}
                                  </td>
                                  <td className={styles.tableCell}>
                                    {criterion.weight
                                      ? `${criterion.weight}%`
                                      : "N/A"}
                                  </td>
                                  <td className={styles.tableCell}>
                                    <select
                                      value={form.ratings[criterion.id] || ""}
                                      onChange={(e) =>
                                        handleRatingChange(
                                          form.id,
                                          criterion.id || `temp-id-${index}`,
                                          e.target.value
                                        )
                                      }
                                      required
                                      className={styles.ratingSelect}
                                      aria-label={`Rate ${
                                        criterion.name || "criterion"
                                      }`}
                                    >
                                      <option value="">Select</option>
                                      {ratingScale.map((scale) => (
                                        <option
                                          key={scale.value}
                                          value={scale.value}
                                        >
                                          {scale.value} - {scale.label}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className={styles.tableCell}>
                                    {calculatedPoint.toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className={styles.totals}>
                          <p>
                            <strong>Total Score:</strong>{" "}
                            {totalPoints.toFixed(0)}
                          </p>
                          <p>
                            <strong>Average (Weighted Points):</strong>{" "}
                            {average.toFixed(2)}%
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className={styles.noDataMessage}>
                        No evaluation criteria available for this form.
                      </div>
                    )}
                  </div>
                  <div className={styles.commentsSection}>
                    <label className={styles.formLabel}>
                      Additional Comments
                    </label>
                    <textarea
                      name="comments"
                      value={formData[form.id]?.comments || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [form.id]: {
                            ...prev[form.id],
                            comments: e.target.value,
                          },
                        }))
                      }
                      className={styles.commentsTextarea}
                      placeholder="Provide any additional comments about your performance..."
                      rows={4}
                      aria-label="Additional comments"
                    />
                  </div>
                  <div className={styles.formActions}>
                    <Link
                      to="/home"
                      className={styles.cancelButton}
                      aria-label="Cancel assessment"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting || !form.criteria?.length}
                      aria-label="Submit assessment"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className={styles.spinner}
                            viewBox="0 0 24 24"
                            aria-hidden="true"
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
                        "Submit Assessment"
                      )}
                    </button>
                  </div>
                </form>
              );
            })}
          </section>
        </main>
        <footer className={HomePageStyles.footer}>
          <div className={HomePageStyles.footerContent}>
            <p>
              &copy; {new Date().getFullYear()} Adama Science & Technology
              University. All rights reserved.
            </p>
            <div className={HomePageStyles.footerLinks}>
              <Link to="/help" aria-label="Help page">
                Help
              </Link>
              <Link to="/privacy" aria-label="Privacy policy">
                Privacy
              </Link>
              <Link to="/terms" aria-label="Terms of service">
                Terms
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SelfAssessment;
