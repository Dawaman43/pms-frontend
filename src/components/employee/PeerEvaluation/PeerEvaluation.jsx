// components/EvaluatePeers.jsx
"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./peerEvaluation.module.css";
import HomePageStyles from "../../../pages/HomePage.module.css";

const  PeerEvaluation = ({ employeeId }) => {
  const [peers, setPeers] = useState([{ id: "", ratings: {} }]);
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFormConfig = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockForm = {
          sections: [
            {
              name: "Behavioral Indicators",
              criteria: [
                { id: 1, name: "Teamwork", weight: 50 },
                { id: 2, name: "Communication", weight: 50 },
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
          weight: 15,
        };
        setFormConfig(mockForm);
        setLoading(false);
      }, 500);
    };
    fetchFormConfig();
  }, []);

  const handlePeerIdChange = (index, value) => {
    const newPeers = [...peers];
    newPeers[index].id = value;
    setPeers(newPeers);
  };

  const addPeer = () => {
    setPeers([...peers, { id: "", ratings: {} }]);
  };

  const removePeer = (index) => {
    if (peers.length <= 1) return;
    const newPeers = peers.filter((_, i) => i !== index);
    setPeers(newPeers);
  };

  const handleRatingChange = (peerIndex, criterionId, value) => {
    const newPeers = [...peers];
    newPeers[peerIndex].ratings[criterionId] = parseInt(value) || 0;
    setPeers(newPeers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate all peer IDs and ratings
    const hasEmptyPeer = peers.some(peer => !peer.id);
    const hasMissingRatings = peers.some(peer => {
      return formConfig.sections[0].criteria.some(criterion => !peer.ratings[criterion.id]);
    });
    
    if (hasEmptyPeer || hasMissingRatings) {
      alert("Please fill all peer IDs and provide ratings for all criteria.");
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Peer evaluations submitted:", peers);
      setSuccess("Peer evaluations submitted successfully!");
      setIsSubmitting(false);
      setTimeout(() => setSuccess(""), 5000);
    }, 1000);
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
            <p>Loading evaluation form...</p>
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
            <h2 className={styles.pageTitle}>Peer Evaluation</h2>
            <p className={styles.pageSubtitle}>Review and evaluate your colleagues</p>
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

          <form onSubmit={handleSubmit} className={styles.evaluationForm}>
            {peers.map((peer, peerIndex) => (
              <div key={peerIndex} className={styles.peerContainer}>
                <div className={styles.peerHeader}>
                  <div className={styles.peerInputGroup}>
                    <label className={styles.peerLabel}>Peer {peerIndex + 1} ID</label>
                    <input
                      type="text"
                      value={peer.id}
                      onChange={(e) => handlePeerIdChange(peerIndex, e.target.value)}
                      className={styles.peerInput}
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  {peers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePeer(peerIndex)}
                      className={styles.removeButton}
                    >
                      Remove Peer
                    </button>
                  )}
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
                              value={peer.ratings[criterion.id] || ""}
                              onChange={(e) => handleRatingChange(peerIndex, criterion.id, e.target.value)}
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
              </div>
            ))}

            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={addPeer}
                className={styles.addButton}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Another Peer
              </button>
              
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
                  "Submit Evaluations"
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
  );
};

export default PeerEvaluation;