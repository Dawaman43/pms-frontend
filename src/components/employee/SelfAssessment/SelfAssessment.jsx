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
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    ratings: {},
    comments: "",
  });
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activePopout, setActivePopout] = useState(null);
  const location = useLocation();
  const hasFetched = useRef(false);

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
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUserAndForms = async () => {
      try {
        setLoading(true);
        setError("");
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

        setFormData((prev) => ({
          ...prev,
          employeeName: userResponse.name || "",
          employeeId:
            userResponse.employeeId ||
            `ASTU-ICT-${String(userResponse.id).padStart(3, "0")}`,
        }));

        // Fetch evaluation forms
        const evaluationForms = await api.getEvaluationForms();
        const defaultRatingScale = [
          { value: 1, label: "Bad" },
          { value: 2, label: "Good" },
          { value: 3, label: "Very Good" },
          { value: 4, label: "Excellent" },
        ];

        const selfAssessmentForms = evaluationForms
          .filter(
            (f) => f.formType === "self_assessment" && f.status === "active"
          )
          .map((form) => {
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

            // Assign fixed rating scale
            parsedForm.ratingScale = defaultRatingScale;

            const initialRatings = {};
            parsedForm.sections.forEach((section, sIndex) => {
              section.criteria.forEach((criterion, cIndex) => {
                initialRatings[
                  criterion.id || `${form.id}-${sIndex}-${cIndex}`
                ] = 0;
              });
            });
            parsedForm.ratings = initialRatings;
            return parsedForm;
          })
          .filter(
            (form) =>
              form.sections.length &&
              form.sections.every((section) => section.criteria?.length)
          );

        if (!selfAssessmentForms.length) {
          setError("No valid self-assessment forms found.");
          setForms([]);
        } else {
          setForms(selfAssessmentForms);
        }

        console.log("User:", userResponse);
        console.log("Self-assessment forms:", selfAssessmentForms);
      } catch (err) {
        console.error("Error fetching user or forms:", err);
        setError("Failed to fetch data. Please try again.");
        setForms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndForms();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setActivePopout(null);
  };

  const togglePopout = (item) => {
    setActivePopout(activePopout === item ? null : item);
  };

  const handleRatingChange = (formId, criterionId, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              ratings: {
                ...form.ratings,
                [criterionId]: parseInt(value) || 0,
              },
            }
          : form
      )
    );
  };

  const handleSubmit = async (e, formId) => {
    e.preventDefault();
    const form = forms.find((f) => f.id === formId);
    if (!form) {
      setError("Form not found.");
      return;
    }

    if (!Object.values(form.ratings).some((rating) => rating > 0)) {
      setError("Please provide ratings for all criteria.");
      return;
    }

    const evaluationData = {
      user_id: user.id,
      form_id: form.id,
      scores: form.ratings,
      comments: formData.comments,
    };

    setIsSubmitting(true);
    try {
      const response = await api.submitEvaluation(evaluationData);
      setSuccess("Self-assessment submitted successfully!");
      setError("");
      setForms((prevForms) => prevForms.filter((f) => f.id !== formId));
      setFormData((prev) => ({ ...prev, comments: "" }));
      console.log("Submitted:", response);
    } catch (error) {
      console.error("Error submitting self-assessment:", error);
      setError("Failed to submit self-assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className={HomePageStyles.homeContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading self-assessment...</p>
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
          <section className={styles.contentSection}>
            <div className={styles.headerSection}>
              <h2 className={styles.pageTitle}>Self-Assessment</h2>
              <p className={styles.pageSubtitle}>
                Complete your quarterly self-evaluation
              </p>
            </div>

            {success && (
              <div className={styles.successMessage}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
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
                <span>{success}</span>
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
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {forms.length === 0 ? (
              <div className={styles.noDataMessage}>
                No self-assessment forms available. Please contact the
                administrator.
              </div>
            ) : (
              forms.map((form) => (
                <form
                  key={form.id}
                  onSubmit={(e) => handleSubmit(e, form.id)}
                  className={styles.assessmentForm}
                >
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Employee Name</label>
                      <input
                        type="text"
                        name="employeeName"
                        value={formData.employeeName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            employeeName: e.target.value,
                          }))
                        }
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
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            employeeId: e.target.value,
                          }))
                        }
                        className={styles.formInput}
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className={styles.evaluationTableContainer}>
                    <h3 className={styles.formTitle}>{form.title}</h3>
                    <p className={styles.formDescription}>{form.description}</p>
                    {form.sections?.length ? (
                      <table className={styles.evaluationTable}>
                        <thead>
                          <tr>
                            <th className={styles.tableHeader}>No</th>
                            <th className={styles.tableHeader}>
                              Behavioral Indicators
                            </th>
                            <th className={styles.tableHeader}>Weight</th>
                            <th className={styles.tableHeader}>Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.sections.flatMap((section, sIndex) =>
                            section.criteria?.map((criterion, cIndex) => (
                              <tr key={`${form.id}-${sIndex}-${cIndex}`}>
                                <td>
                                  {sIndex + 1}.{cIndex + 1}
                                </td>
                                <td>{criterion.name}</td>
                                <td>{criterion.weight}%</td>
                                <td>
                                  <select
                                    value={
                                      form.ratings[
                                        criterion.id ||
                                          `${form.id}-${sIndex}-${cIndex}`
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleRatingChange(
                                        form.id,
                                        criterion.id ||
                                          `${form.id}-${sIndex}-${cIndex}`,
                                        e.target.value
                                      )
                                    }
                                    required
                                    className={styles.formInput}
                                  >
                                    <option value="">Select</option>
                                    {form.ratingScale?.length &&
                                    Array.isArray(form.ratingScale) ? (
                                      form.ratingScale.map(
                                        (scale, scaleIndex) => (
                                          <option
                                            key={scale.value ?? scaleIndex}
                                            value={scale.value}
                                          >
                                            {scale.value} - {scale.label}
                                          </option>
                                        )
                                      )
                                    ) : (
                                      <option disabled>
                                        No valid ratings available
                                      </option>
                                    )}
                                  </select>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
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
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          comments: e.target.value,
                        }))
                      }
                      className={styles.commentsTextarea}
                      placeholder="Provide any additional comments about your performance..."
                      rows={4}
                    />
                  </div>

                  <div className={styles.formActions}>
                    <Link to="/home" className={styles.cancelButton}>
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting || !form.sections?.length}
                    >
                      {isSubmitting ? (
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
                          Submitting...
                        </>
                      ) : (
                        "Submit Assessment"
                      )}
                    </button>
                  </div>
                </form>
              ))
            )}
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

export default SelfAssessment;
