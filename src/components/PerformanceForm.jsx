"use client"

import { useState, useEffect } from "react"
import styles from "./PerformanceForm.module.css"

const PerformanceForm = ({ employeeId, onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeName: "",
    position: "",
    department: "",
    evaluationPeriod: "",
    supervisor: "",
  })

  const [taskEvaluations, setTaskEvaluations] = useState([])
  const [behaviorEvaluations, setBehaviorEvaluations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch employee data and evaluation criteria
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // In a real app, these would be API calls
        const employeeResponse = await fetch(`/api/employees/${employeeId}`)
        const employeeData = await employeeResponse.json()
        
        const evaluationCriteriaResponse = await fetch('/api/evaluation-criteria')
        const criteriaData = await evaluationCriteriaResponse.json()
        
        // Set form data from employee record
        setFormData({
          employeeName: employeeData.fullName,
          position: employeeData.position,
          department: employeeData.department,
          evaluationPeriod: getCurrentEvaluationPeriod(),
          supervisor: employeeData.supervisor || "Not specified",
        })
        
        // Set evaluation tasks from criteria
        setTaskEvaluations(criteriaData.tasks.map(task => ({
          id: task.id,
          task: task.description,
          weight: task.weight,
          rating: 3, // Default to average rating
          score: (task.weight * 3) / 5, // Calculate initial score
        })))
        
        // Set behavioral evaluations from criteria
        setBehaviorEvaluations(criteriaData.behaviors.map(behavior => ({
          id: behavior.id,
          behavior: behavior.description,
          weight: behavior.weight,
          rating: 3, // Default to average rating
          score: (behavior.weight * 3) / 5, // Calculate initial score
        })))
        
      } catch (err) {
        setError("Failed to load employee data. Please try again.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    
    if (employeeId) {
      fetchData()
    }
  }, [employeeId])

  const getCurrentEvaluationPeriod = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    
    // Assuming biannual evaluations (Jan-Jun and Jul-Dec)
    if (month < 6) {
      return `January 01, ${year} - June 30, ${year}`
    } else {
      return `July 01, ${year} - December 31, ${year}`
    }
  }

  const handleTaskRatingChange = (taskId, newRating) => {
    setTaskEvaluations((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, rating: newRating, score: (task.weight * newRating) / 5 } : task,
      ),
    )
  }

  const handleBehaviorRatingChange = (behaviorId, newRating) => {
    setBehaviorEvaluations((prev) =>
      prev.map((behavior) =>
        behavior.id === behaviorId
          ? { ...behavior, rating: newRating, score: (behavior.weight * newRating) / 5 }
          : behavior,
      ),
    )
  }

  const calculateTotalScore = () => {
    const taskTotal = taskEvaluations.reduce((sum, task) => sum + (task.weight * task.rating) / 5, 0)
    const behaviorTotal = behaviorEvaluations.reduce(
      (sum, behavior) => sum + (behavior.weight * behavior.rating) / 5,
      0,
    )
    return taskTotal * 0.7 + behaviorTotal * 0.3
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (loading) return
    
    const evaluationData = {
      ...formData,
      employeeId,
      taskEvaluations,
      behaviorEvaluations,
      totalScore: calculateTotalScore(),
      evaluatedAt: new Date().toISOString(),
      evaluatorComments: e.target.supervisorComment.value,
    }
    
    onSubmit?.(evaluationData)
  }

  if (loading) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.loadingMessage}>Loading employee data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    )
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.universityHeader}>
          <img src="/astu_logo.svg" alt="ASTU Logo" className={styles.logo} />
          <div className={styles.universityInfo}>
            <h1>Adama Science & Technology University</h1>
            <p>Performance Evaluation Form</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.evaluationForm}>
        {/* Employee Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Employee Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Employee Name:</label>
              <span>{formData.employeeName}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Position:</label>
              <span>{formData.position}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Department:</label>
              <span>{formData.department}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Evaluation Period:</label>
              <span>{formData.evaluationPeriod}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Supervisor:</label>
              <span>{formData.supervisor}</span>
            </div>
          </div>
        </section>

        {/* Task Performance Evaluation (70%) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Task Performance Evaluation (70%)</h2>
          <div className={styles.evaluationTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>No.</div>
              <div className={styles.headerCell}>Planned Activities</div>
              <div className={styles.headerCell}>Weight</div>
              <div className={styles.headerCell}>Performance Rating</div>
              <div className={styles.headerCell}>Score</div>
            </div>

            {taskEvaluations.map((task, index) => (
              <div key={task.id} className={styles.tableRow}>
                <div className={styles.cell}>{index + 1}</div>
                <div className={styles.cell}>{task.task}</div>
                <div className={styles.cell}>{task.weight}%</div>
                <div className={styles.cell}>
                  <div className={styles.ratingButtons}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={`${styles.ratingButton} ${task.rating === rating ? styles.active : ""}`}
                        onClick={() => handleTaskRatingChange(task.id, rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.cell}>{((task.weight * task.rating) / 5).toFixed(2)}</div>
              </div>
            ))}

            <div className={styles.totalRow}>
              <div className={styles.cell}></div>
              <div className={styles.cell}>
                <strong>Total Task Score (70%)</strong>
              </div>
              <div className={styles.cell}></div>
              <div className={styles.cell}></div>
              <div className={styles.cell}>
                <strong>
                  {(taskEvaluations.reduce((sum, task) => sum + (task.weight * task.rating) / 5, 0) * 0.7).toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Behavioral Evaluation (30%) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Behavioral Evaluation (30%)</h2>
          <div className={styles.evaluationTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>No.</div>
              <div className={styles.headerCell}>Behavioral Indicators</div>
              <div className={styles.headerCell}>Weight</div>
              <div className={styles.headerCell}>Performance Rating</div>
              <div className={styles.headerCell}>Score</div>
            </div>

            {behaviorEvaluations.map((behavior, index) => (
              <div key={behavior.id} className={styles.tableRow}>
                <div className={styles.cell}>{index + 1}</div>
                <div className={styles.cell}>{behavior.behavior}</div>
                <div className={styles.cell}>{behavior.weight}%</div>
                <div className={styles.cell}>
                  <div className={styles.ratingButtons}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className={`${styles.ratingButton} ${behavior.rating === rating ? styles.active : ""}`}
                        onClick={() => handleBehaviorRatingChange(behavior.id, rating)}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.cell}>{((behavior.weight * behavior.rating) / 5).toFixed(2)}</div>
              </div>
            ))}

            <div className={styles.totalRow}>
              <div className={styles.cell}></div>
              <div className={styles.cell}>
                <strong>Total Behavioral Score (30%)</strong>
              </div>
              <div className={styles.cell}></div>
              <div className={styles.cell}></div>
              <div className={styles.cell}>
                <strong>
                  {(
                    behaviorEvaluations.reduce((sum, behavior) => sum + (behavior.weight * behavior.rating) / 5, 0) *
                    0.3
                  ).toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* Overall Score */}
        <section className={styles.section}>
          <div className={styles.overallScore}>
            <h3>Overall Performance Score</h3>
            <div className={styles.scoreDisplay}>
              <span className={styles.scoreValue}>{calculateTotalScore().toFixed(2)}</span>
              <span className={styles.scoreGrade}>
                {calculateTotalScore() >= 90
                  ? "Excellent"
                  : calculateTotalScore() >= 80
                    ? "Very Good"
                    : calculateTotalScore() >= 70
                      ? "Good"
                      : calculateTotalScore() >= 60
                        ? "Satisfactory"
                        : "Needs Improvement"}
              </span>
            </div>
          </div>
        </section>

        {/* Comments Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Comments</h2>
          <div className={styles.commentsGrid}>
            <div className={styles.commentBox}>
              <label htmlFor="supervisorComment">Evaluator's Comment:</label>
              <textarea
                id="supervisorComment"
                name="supervisorComment"
                className={styles.commentTextarea}
                placeholder="Enter your evaluation comments..."
                rows={4}
                required
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            Submit Evaluation
          </button>
        </div>
      </form>
    </div>
  )
}

export default PerformanceForm