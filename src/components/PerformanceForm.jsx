"use client"

import { useState } from "react"
import styles from "./PerformanceForm.module.css"

const PerformanceForm = ({ evaluationType = "self", onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeName: "Samuel Hailu Demse",
    position: "Software Programmer IV",
    department: "Information Communication Technology",
    evaluationPeriod: "January 01, 2017 - June 30, 2017",
    supervisor: "Daniel Asfaw",
  })

  const [taskEvaluations, setTaskEvaluations] = useState([
    {
      id: 1,
      task: "Support and maintenance for HRMS, Attendance System, Transport System and Clinic Service System",
      weight: 25,
      rating: 4,
      score: 0,
    },
    {
      id: 2,
      task: "Community and Special School System development and user training",
      weight: 25,
      rating: 4,
      score: 0,
    },
    {
      id: 3,
      task: "Employee ID card printing based on new structure and system improvement",
      weight: 10,
      rating: 4,
      score: 0,
    },
    {
      id: 4,
      task: "ASTU Academic Staff Profile System development",
      weight: 10,
      rating: 3,
      score: 0,
    },
    {
      id: 5,
      task: "Stock and Gate pass Management data collection, design and system development",
      weight: 20,
      rating: 4,
      score: 0,
    },
    {
      id: 6,
      task: "Strategic and Data Management System requirement gathering, analysis and design",
      weight: 10,
      rating: 3,
      score: 0,
    },
  ])

  const [behaviorEvaluations, setBehaviorEvaluations] = useState([
    {
      id: 1,
      behavior: "Anti-corruption attitude and efforts to eliminate corrupt practices",
      weight: 25,
      rating: 4,
      score: 0,
    },
    {
      id: 2,
      behavior: "Efforts to improve competency",
      weight: 20,
      rating: 3,
      score: 0,
    },
    {
      id: 3,
      behavior: "Respect for service users and pride in service delivery",
      weight: 15,
      rating: 4,
      score: 0,
    },
    {
      id: 4,
      behavior: "Efforts to support and empower others",
      weight: 15,
      rating: 4,
      score: 0,
    },
    {
      id: 5,
      behavior: "Efforts and willingness to improve processes and support ICT",
      weight: 15,
      rating: 4,
      score: 0,
    },
    {
      id: 6,
      behavior: "Willingness to give and receive performance feedback timely and appropriately",
      weight: 10,
      rating: 3,
      score: 0,
    },
  ])

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
    const evaluationData = {
      ...formData,
      taskEvaluations,
      behaviorEvaluations,
      totalScore: calculateTotalScore(),
      submittedAt: new Date().toISOString(),
    }
    onSubmit?.(evaluationData)
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <div className={styles.universityHeader}>
          <img src="/astu_logo.svg?height=60&width=60&text=ASTU" alt="ASTU Logo" className={styles.logo} />
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
          </div>
        </section>

        {/* Task Performance Evaluation (70%) */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Task Performance Evaluation (70%)</h2>
          <div className={styles.evaluationTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>No.</div>
              <div className={styles.headerCell}>Planned Activities</div>
              <div className={styles.headerCell}>Weight (%)</div>
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
              <div className={styles.headerCell}>Weight (%)</div>
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
              <span className={styles.scoreValue}>{calculateTotalScore().toFixed(2)}/100</span>
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
              <label htmlFor="supervisorComment">Supervisor's Comment:</label>
              <textarea
                id="supervisorComment"
                className={styles.commentTextarea}
                placeholder="Enter supervisor's comments..."
                rows={4}
              />
            </div>
            <div className={styles.commentBox}>
              <label htmlFor="employeeComment">Employee's Comment:</label>
              <textarea
                id="employeeComment"
                className={styles.commentTextarea}
                placeholder="Enter employee's comments..."
                rows={4}
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button type="submit" className={styles.submitButton}>
            Submit Evaluation
          </button>
        </div>
      </form>
    </div>
  )
}

export default PerformanceForm
