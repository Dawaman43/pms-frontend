"use client"

import { useState } from "react"
import styles from "./PerformanceHistory.module.css"

const PerformanceHistory = ({ employeeId, isAdminView = false }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Demo employee data
  const demoEmployeeInfo = {
    id: employeeId || "ASTU-ICT-001",
    fullName: "Samuel Hailu Demse",
    position: "Software Programmer IV",
    department: "Information Communication Technology",
    employeeId: "ASTU-ICT-001",
    avatar: "/placeholder-user.jpg"
  }

  // Demo evaluation history data
  const demoEvaluationHistory = [
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
      comments: "Excellent performance this quarter with timely delivery of all projects.",
      tasks: [
        { task: "HRMS system maintenance", weight: 25, rating: 4, score: 20 },
        { task: "Attendance system upgrade", weight: 25, rating: 5, score: 25 },
        { task: "New employee portal", weight: 30, rating: 4, score: 24 },
        { task: "Database optimization", weight: 20, rating: 4, score: 16 }
      ],
      behaviors: [
        { behavior: "Team collaboration", weight: 30, rating: 4, score: 24 },
        { behavior: "Problem solving", weight: 25, rating: 5, score: 25 },
        { behavior: "Initiative", weight: 20, rating: 3, score: 12 },
        { behavior: "Communication", weight: 25, rating: 4, score: 20 }
      ]
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
      comments: "Consistent performance throughout the year with notable improvements.",
      tasks: [
        { task: "System documentation", weight: 20, rating: 4, score: 16 },
        { task: "User training sessions", weight: 30, rating: 4, score: 24 },
        { task: "Code refactoring", weight: 30, rating: 5, score: 30 },
        { task: "Bug fixes", weight: 20, rating: 3, score: 12 }
      ],
      behaviors: [
        { behavior: "Adaptability", weight: 30, rating: 4, score: 24 },
        { behavior: "Work ethic", weight: 25, rating: 4, score: 20 },
        { behavior: "Technical skills", weight: 25, rating: 5, score: 25 },
        { behavior: "Time management", weight: 20, rating: 3, score: 12 }
      ]
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
      comments: "Excellent team player who consistently delivers quality work.",
      tasks: [
        { task: "Project collaboration", weight: 40, rating: 5, score: 40 },
        { task: "Code reviews", weight: 30, rating: 4, score: 24 },
        { task: "Knowledge sharing", weight: 30, rating: 4, score: 24 }
      ],
      behaviors: [
        { behavior: "Teamwork", weight: 40, rating: 5, score: 40 },
        { behavior: "Communication", weight: 30, rating: 4, score: 24 },
        { behavior: "Reliability", weight: 30, rating: 4, score: 24 }
      ]
    },
    {
      id: 4,
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
      comments: "",
      tasks: [],
      behaviors: []
    }
  ]

  const filteredHistory = demoEvaluationHistory.filter((evaluation) => {
    const periodMatch = selectedPeriod === "all" || evaluation.period.includes(selectedPeriod)
    const typeMatch = selectedType === "all" || evaluation.type.toLowerCase().includes(selectedType.toLowerCase())
    return periodMatch && typeMatch
  })

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#10b981"
      case "pending":
        return "#f59e0b"
      case "overdue":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getGradeColor = (grade) => {
    switch (grade.toLowerCase()) {
      case "excellent":
        return "#059669"
      case "very good":
        return "#10b981"
      case "good":
        return "#3b82f6"
      case "satisfactory":
        return "#f59e0b"
      case "needs improvement":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const calculateAverageScore = () => {
    const completedEvaluations = filteredHistory.filter((evaluation) => evaluation.status === "Completed")
    if (completedEvaluations.length === 0) return 0
    const total = completedEvaluations.reduce((sum, evaluation) => sum + evaluation.score, 0)
    return (total / completedEvaluations.length).toFixed(1)
  }

  const handleViewEvaluation = (evaluationId) => {
    const evaluation = demoEvaluationHistory.find(evaluationItem => evaluationItem.id === evaluationId)
    if (evaluation) {
      console.log("Viewing evaluation:", evaluation)
      alert(`Viewing evaluation for ${evaluation.period}\nScore: ${evaluation.score}\nComments: ${evaluation.comments}`)
    }
  }

  const handleCompleteEvaluation = (evaluationId) => {
    console.log("Completing evaluation:", evaluationId)
    alert(`Redirecting to complete evaluation ${evaluationId}`)
  }

  return (
    <div className={styles.historyContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isAdminView ? "Employee Performance History" : "My Performance History"}
        </h2>
        <p className={styles.subtitle}>
          {isAdminView 
            ? `Tracking performance evaluations for ${demoEmployeeInfo.fullName}`
            : "Track your performance evaluations over time"}
        </p>
      </div>

      {/* Employee Info (Admin View) */}
      {isAdminView && (
        <div className={styles.employeeInfoSection}>
          <div className={styles.employeeInfoCard}>
            <div className={styles.employeeAvatar}>
              {demoEmployeeInfo.avatar ? (
                <img src={demoEmployeeInfo.avatar} alt={`${demoEmployeeInfo.fullName}'s avatar`} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {demoEmployeeInfo.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className={styles.employeeDetails}>
              <h3>{demoEmployeeInfo.fullName}</h3>
              <p>{demoEmployeeInfo.position}</p>
              <p>{demoEmployeeInfo.department}</p>
              <p>Employee ID: {demoEmployeeInfo.employeeId}</p>
            </div>
          </div>
        </div>
      )}

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
            {isAdminView && <option value="admin">Admin Evaluation</option>}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <h3>Average Score</h3>
            <p>{calculateAverageScore()}/100</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <h3>Completed</h3>
            <p>{filteredHistory.filter((evaluation) => evaluation.status === "Completed").length}</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryContent}>
            <h3>Pending</h3>
            <p>{filteredHistory.filter((evaluation) => evaluation.status === "Pending").length}</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
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
                    {evaluation.status === "Completed" ? `${evaluation.taskScore?.toFixed(1) || 'N/A'}%` : "-"}
                  </td>
                  <td className={styles.scoreCell}>
                    {evaluation.status === "Completed" ? `${evaluation.behaviorScore?.toFixed(1) || 'N/A'}%` : "-"}
                  </td>
                  <td className={styles.scoreCell}>
                    <span className={styles.overallScore}>
                      {evaluation.status === "Completed" ? `${evaluation.score?.toFixed(1) || 'N/A'}%` : "-"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.gradeBadge} style={{ backgroundColor: getGradeColor(evaluation.grade) }}>
                      {evaluation.grade || 'N/A'}
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
                        <button 
                          className={styles.viewButton}
                          onClick={() => handleViewEvaluation(evaluation.id)}
                        >
                          View
                        </button>
                      ) : (
                        <button 
                          className={styles.completeButton}
                          onClick={() => handleCompleteEvaluation(evaluation.id)}
                        >
                          Complete
                        </button>
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
          <h3>No evaluations found</h3>
          <p>No evaluations match your current filter criteria.</p>
        </div>
      )}
    </div>
  )
}

export default PerformanceHistory