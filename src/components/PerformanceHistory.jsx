"use client"

import { useState } from "react"
import styles from "./PerformanceHistory.module.css"

const PerformanceHistory = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  const [evaluationHistory] = useState([
    {
      id: 1,
      period: "2024 Q1",
      type: "Quarterly Review",
      evaluator: "Daniel Asfaw",
      evaluatorRole: "Supervisor",
      score: 85.5,
      status: "Completed",
      submittedDate: "2024-03-15",
      taskScore: 88.2,
      behaviorScore: 82.8,
      grade: "Very Good",
    },
    {
      id: 2,
      period: "2023 Q4",
      type: "Annual Review",
      evaluator: "Self Assessment",
      evaluatorRole: "Self",
      score: 82.3,
      status: "Completed",
      submittedDate: "2023-12-20",
      taskScore: 85.0,
      behaviorScore: 79.6,
      grade: "Good",
    },
    {
      id: 3,
      period: "2023 Q3",
      type: "Peer Review",
      evaluator: "Banchirga Nurye",
      evaluatorRole: "Peer",
      score: 87.1,
      status: "Completed",
      submittedDate: "2023-09-30",
      taskScore: 89.5,
      behaviorScore: 84.7,
      grade: "Very Good",
    },
    {
      id: 4,
      period: "2023 Q2",
      type: "Quarterly Review",
      evaluator: "Daniel Asfaw",
      evaluatorRole: "Supervisor",
      score: 79.8,
      status: "Completed",
      submittedDate: "2023-06-15",
      taskScore: 82.1,
      behaviorScore: 77.5,
      grade: "Good",
    },
    {
      id: 5,
      period: "2024 Q2",
      type: "Quarterly Review",
      evaluator: "Daniel Asfaw",
      evaluatorRole: "Supervisor",
      score: 0,
      status: "Pending",
      submittedDate: null,
      taskScore: 0,
      behaviorScore: 0,
      grade: "Pending",
    },
  ])

  const filteredHistory = evaluationHistory.filter((evaluation) => {
    const periodMatch = selectedPeriod === "all" || evaluation.period.includes(selectedPeriod)
    const typeMatch = selectedType === "all" || evaluation.type.toLowerCase().includes(selectedType.toLowerCase())
    return periodMatch && typeMatch
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#48bb78"
      case "pending":
        return "#ed8936"
      case "overdue":
        return "#f56565"
      default:
        return "#718096"
    }
  }

  const getGradeColor = (grade) => {
    switch (grade.toLowerCase()) {
      case "excellent":
        return "#38a169"
      case "very good":
        return "#48bb78"
      case "good":
        return "#4299e1"
      case "satisfactory":
        return "#ed8936"
      case "needs improvement":
        return "#f56565"
      default:
        return "#718096"
    }
  }

  const calculateAverageScore = () => {
    const completedEvaluations = filteredHistory.filter((evaluation) => evaluation.status === "Completed")
    if (completedEvaluations.length === 0) return 0
    const total = completedEvaluations.reduce((sum, evaluation) => sum + evaluation.score, 0)
    return (total / completedEvaluations.length).toFixed(1)
  }

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Performance Evaluation History</h2>
        <p className={styles.subtitle}>Track your performance evaluations over time</p>
      </div>

      {/* Filters */}
      <div className={styles.filtersSection}>
        <div className={styles.filterGroup}>
          <label htmlFor="periodFilter" className={styles.filterLabel}>
            Filter by Period:
          </label>
          <select
            id="periodFilter"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Periods</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="typeFilter" className={styles.filterLabel}>
            Filter by Type:
          </label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="quarterly">Quarterly Review</option>
            <option value="annual">Annual Review</option>
            <option value="peer">Peer Review</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>📊</div>
          <div className={styles.summaryContent}>
            <h3>Average Score</h3>
            <p>{calculateAverageScore()}/100</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>✅</div>
          <div className={styles.summaryContent}>
            <h3>Completed</h3>
            <p>{filteredHistory.filter((evaluation) => evaluation.status === "Completed").length}</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>⏳</div>
          <div className={styles.summaryContent}>
            <h3>Pending</h3>
            <p>{filteredHistory.filter((evaluation) => evaluation.status === "Pending").length}</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>📈</div>
          <div className={styles.summaryContent}>
            <h3>Total Reviews</h3>
            <p>{filteredHistory.length}</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableContainer}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Period</th>
                <th>Type</th>
                <th>Evaluator</th>
                <th>Task Score</th>
                <th>Behavior Score</th>
                <th>Overall Score</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((evaluation) => (
                <tr key={evaluation.id} className={styles.tableRow}>
                  <td className={styles.periodCell}>{evaluation.period}</td>
                  <td>{evaluation.type}</td>
                  <td>
                    <div className={styles.evaluatorInfo}>
                      <span className={styles.evaluatorName}>{evaluation.evaluator}</span>
                      <span className={styles.evaluatorRole}>({evaluation.evaluatorRole})</span>
                    </div>
                  </td>
                  <td className={styles.scoreCell}>
                    {evaluation.status === "Completed" ? `${evaluation.taskScore.toFixed(1)}%` : "-"}
                  </td>
                  <td className={styles.scoreCell}>
                    {evaluation.status === "Completed" ? `${evaluation.behaviorScore.toFixed(1)}%` : "-"}
                  </td>
                  <td className={styles.scoreCell}>
                    <span className={styles.overallScore}>
                      {evaluation.status === "Completed" ? `${evaluation.score.toFixed(1)}%` : "-"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(evaluation.grade) }}>
                      {evaluation.grade}
                    </span>
                  </td>
                  <td>
                    <span className={styles.statusBadge} style={{ backgroundColor: getStatusColor(evaluation.status) }}>
                      {evaluation.status}
                    </span>
                  </td>
                  <td className={styles.dateCell}>
                    {evaluation.submittedDate ? new Date(evaluation.submittedDate).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      {evaluation.status === "Completed" ? (
                        <button className={styles.viewButton}>View</button>
                      ) : (
                        <button className={styles.completeButton}>Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>No evaluations found</h3>
          <p>No evaluations match your current filter criteria.</p>
        </div>
      )}
    </div>
  )
}

export default PerformanceHistory
