"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import PerformanceForm from "../components/PerformanceForm"
import PerformanceHistory from "../components/PerformanceHistory"

import styles from "./DashboardPage.module.css"
import homeStyles from "./HomePage.module.css"

const DashboardPage = () => {
  // Dashboard state (unchanged)
  const [activeTab, setActiveTab] = useState("overview")
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [editingForm, setEditingForm] = useState(null)

  // Form types definition
  const formTypes = [
    { id: "workrate", name: "Work Performance" },
    { id: "behavioral", name: "Behavioral Evaluation" },
  ]

  // Evaluator types definition
  const evaluatorTypes = [
    { id: "admin", name: "Administrator/Manager" },
    { id: "peer", name: "Peer/Colleague" },
    { id: "self", name: "Self-Evaluation" },
  ]

  // Admin data
  const [admin] = useState({
    name: "Dr. Bekele Tadesse",
    role: "System Administrator",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=80&width=80&text=Admin",
  })

  // User data
  const [user] = useState({
    name: "Team Leader",
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    employeeId: "ASTU-ICT-001",
    avatar: "/placeholder.svg?height=80&width=80&text=User",
  })

  // Team members data
  const [teamMembers] = useState([
    {
      id: 1,
      name: "Daniel Asfaw",
      role: "Senior Software Engineer",
      department: "ICT",
      status: "active",
      lastEvaluation: "2024-02-28",
      evaluationScore: 92.1,
      avatar: "/placeholder.svg?height=80&width=80&text=DA",
    },
    {
      id: 2,
      name: "Banchirga Nurye",
      role: "Project Manager",
      department: "Computer Science",
      status: "active",
      lastEvaluation: "2024-03-10",
      evaluationScore: 78.2,
      avatar: "/placeholder.svg?height=80&width=80&text=BN",
    },
    {
      id: 3,
      name: "Meron Tesfaye",
      role: "UI/UX Designer",
      department: "ICT",
      status: "active",
      lastEvaluation: "2024-01-15",
      evaluationScore: 88.5,
      avatar: "/placeholder.svg?height=80&width=80&text=MT",
    },
  ])

  // Admin stats
  const [systemStats] = useState({
    totalUsers: 245,
    activeEvaluations: 18,
    completedEvaluations: 127,
    pendingApprovals: 12,
    totalDepartments: 8,
    evaluationForms: 5,
  })

  // User stats
  const [dashboardStats] = useState({
    totalEvaluations: 12,
    pendingEvaluations: 3,
    completedEvaluations: 9,
    averageScore: 85.2,
    currentQuarterScore: 87.5,
    lastEvaluationDate: "2024-03-15",
    nextEvaluationDue: "2024-06-15",
  })

  // Enhanced forms data with sections and criteria
  const [evaluationForms, setEvaluationForms] = useState([
    {
      id: 1,
      title: "Work Performance Evaluation (70%)",
      description: "Evaluation of employee work performance by manager",
      formType: "workrate",
      targetEvaluator: "admin",
      weight: 70,
      status: "active",
      createdDate: "2024-01-15",
      lastModified: "2024-03-10",
      usageCount: 45,
      sections: [
        {
          id: 1,
          name: "Task Performance",
          weight: 70,
          criteria: [
            { id: 1, name: "Quality of Work", weight: 40 },
            { id: 2, name: "Timeliness", weight: 30 },
            { id: 3, name: "Efficiency", weight: 30 },
          ],
        },
      ],
      ratingScale: {
        min: 1,
        max: 4,
        labels: ["Poor", "Fair", "Good", "Excellent"],
      },
    },
    {
      id: 2,
      title: "Behavioral Evaluation (Admin - 10%)",
      description: "Evaluation of employee behavior by manager",
      formType: "behavioral",
      targetEvaluator: "admin",
      weight: 10,
      status: "active",
      createdDate: "2024-01-20",
      lastModified: "2024-02-28",
      usageCount: 32,
      sections: [
        {
          id: 1,
          name: "Behavioral Indicators",
          weight: 100,
          criteria: [
            { id: 1, name: "Anti-corruption attitude and action", weight: 25 },
            { id: 2, name: "Effort to improve competence", weight: 20 },
            { id: 3, name: "Respect and pride in service", weight: 15 },
            { id: 4, name: "Effort to support others", weight: 15 },
            { id: 5, name: "Effort to improve process", weight: 15 },
            { id: 6, name: "Feedback acceptance", weight: 10 },
          ],
        },
      ],
      ratingScale: {
        min: 1,
        max: 4,
        labels: ["Poor", "Fair", "Good", "Excellent"],
      },
    },
    {
      id: 3,
      title: "Administrative Staff Evaluation",
      description: "Performance evaluation for administrative personnel",
      targetRole: "academic_worker",
      status: "active",
      createdDate: "2024-01-20",
      lastModified: "2024-02-28",
      usageCount: 32,
      sections: [
        {
          id: 1,
          name: "Task Performance",
          weight: 70,
          criteria: [
            { id: 1, name: "Quality of Work", weight: 40 },
            { id: 2, name: "Timeliness", weight: 30 },
            { id: 3, name: "Efficiency", weight: 30 },
          ],
        },
        {
          id: 2,
          name: "Behavioral Indicators",
          weight: 30,
          criteria: [
            { id: 1, name: "Communication Skills", weight: 50 },
            { id: 2, name: "Teamwork", weight: 50 },
          ],
        },
      ],
      ratingScale: {
        min: 1,
        max: 4,
        labels: ["Poor", "Fair", "Good", "Excellent"],
      },
    },
  ])

  // Form builder state
  const [formBuilder, setFormBuilder] = useState({
    title: "",
    description: "",
    formType: "workrate",
    targetEvaluator: "admin",
    weight: 70,
    sections: [],
    ratingScale: {
      min: 1,
      max: 4,
      labels: ["Poor", "Fair", "Good", "Excellent"],
    },
  })

  const [currentSection, setCurrentSection] = useState({
    name: "",
    weight: 0,
    criteria: [],
  })

  const [currentCriterion, setCurrentCriterion] = useState({
    name: "",
    weight: 0,
  })

  // Admin activities
  const [recentActivities] = useState([
    {
      id: 1,
      type: "form_created",
      title: "New Evaluation Form Created",
      description: "Leadership Performance Review form has been created",
      user: "Dr. Bekele Tadesse",
      time: "2 hours ago",
      status: "info",
    },
    {
      id: 2,
      type: "evaluation_submitted",
      title: "Evaluation Submitted",
      description: "Samuel Hailu completed his quarterly evaluation",
      user: "Samuel Hailu Demse",
      time: "4 hours ago",
      status: "success",
    },
    {
      id: 3,
      type: "approval_pending",
      title: "Approval Required",
      description: "5 evaluations are pending supervisor approval",
      user: "System",
      time: "6 hours ago",
      status: "warning",
    },
  ])

  // User evaluations
  const [recentEvaluations] = useState([
    {
      id: 1,
      type: "Quarterly Review",
      evaluator: "Daniel Asfaw",
      score: 85.5,
      status: "Completed",
      date: "2024-03-15",
    },
    {
      id: 2,
      type: "Peer Review",
      evaluator: "Banchirga Nurye",
      score: 87.1,
      status: "Completed",
      date: "2024-02-28",
    },
    {
      id: 3,
      type: "Self Assessment",
      evaluator: "Self",
      score: 0,
      status: "Pending",
      date: "Due: 2024-06-15",
    },
  ])

  // User tasks
  const [upcomingTasks] = useState([
    {
      id: 1,
      title: "Complete Q2 Self-Assessment",
      dueDate: "2024-06-15",
      priority: "High",
      type: "Self Evaluation",
    },
    {
      id: 2,
      title: "Peer Evaluation for John Doe",
      dueDate: "2024-06-20",
      priority: "Medium",
      type: "Peer Evaluation",
    },
    {
      id: 3,
      title: "Submit Development Goals",
      dueDate: "2024-06-30",
      priority: "Low",
      type: "Goal Setting",
    },
  ])

  // Form builder functions (unchanged)
  const addCriterionToSection = () => {
    if (currentCriterion.name && currentCriterion.weight > 0) {
      setCurrentSection((prev) => ({
        ...prev,
        criteria: [
          ...prev.criteria,
          {
            id: Date.now(),
            ...currentCriterion,
          },
        ],
      }))
      setCurrentCriterion({ name: "", weight: 0 })
    }
  }

  const removeCriterionFromSection = (criterionId) => {
    setCurrentSection((prev) => ({
      ...prev,
      criteria: prev.criteria.filter((c) => c.id !== criterionId),
    }))
  }

  const addSectionToForm = () => {
    if (currentSection.name && currentSection.weight > 0 && currentSection.criteria.length > 0) {
      const totalCriteriaWeight = currentSection.criteria.reduce((sum, c) => sum + c.weight, 0)
      if (totalCriteriaWeight === 100) {
        setFormBuilder((prev) => ({
          ...prev,
          sections: [
            ...prev.sections,
            {
              id: Date.now(),
              ...currentSection,
            },
          ],
        }))
        setCurrentSection({ name: "", weight: 0, criteria: [] })
      } else {
        alert("Criteria weights must total 100% for the section")
      }
    }
  }

  const removeSectionFromForm = (sectionId) => {
    setFormBuilder((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }))
  }

  const saveForm = () => {
    if (formBuilder.title && formBuilder.sections.length > 0) {
      if (formBuilder.formType === "behavioral") {
        const behavioralSection = formBuilder.sections[0]
        if (behavioralSection.weight !== 100) {
          alert("Behavioral evaluation sections must total 100% weight")
          return
        }
      }

      if (formBuilder.formType === "workrate") {
        const totalWeight = formBuilder.sections.reduce((sum, s) => sum + s.weight, 0)
        if (totalWeight !== 100) {
          alert("Work rate evaluation sections must total 100% weight")
          return
        }
      }

      const newForm = {
        id: editingForm ? editingForm.id : Date.now(),
        ...formBuilder,
        status: editingForm ? editingForm.status : "draft",
        createdDate: editingForm ? editingForm.createdDate : new Date().toISOString().split("T")[0],
        lastModified: new Date().toISOString().split("T")[0],
        usageCount: editingForm ? editingForm.usageCount : 0,
      }

      if (editingForm) {
        setEvaluationForms((prev) => prev.map((f) => (f.id === editingForm.id ? newForm : f)))
      } else {
        setEvaluationForms((prev) => [...prev, newForm])
      }
      resetFormBuilder()
      setShowFormBuilder(false)
      setEditingForm(null)
    }
  }

  const resetFormBuilder = () => {
    setFormBuilder({
      title: "",
      description: "",
      formType: "workrate",
      targetEvaluator: "admin",
      weight: 70,
      sections: [],
      ratingScale: {
        min: 1,
        max: 4,
        labels: ["Poor", "Fair", "Good", "Excellent"],
      },
    })
    setCurrentSection({ name: "", weight: 0, criteria: [] })
    setCurrentCriterion({ name: "", weight: 0 })
  }

  const editForm = (form) => {
    setEditingForm(form)
    setFormBuilder({
      title: form.title,
      description: form.description,
      formType: form.formType,
      targetEvaluator: form.targetEvaluator,
      weight: form.weight,
      sections: form.sections,
      ratingScale: form.ratingScale,
    })
    setShowFormBuilder(true)
  }

  // Distribute forms (unchanged)
  const distributeForms = (employeeId) => {
    createForm(employeeId, "admin", "workrate", 70)
    createForm(employeeId, "admin", "behavioral", 10)
    createForm(employeeId, "peer", "behavioral", 15)
    createForm(employeeId, "self", "behavioral", 5)
  }

  const createForm = (employeeId, evaluator, formType, weight) => {
    console.log(
      `Creating ${formType} form for employee ${employeeId} to be evaluated by ${evaluator} with weight ${weight}%`,
    )
  }

  const handleCreateForm = () => {
    resetFormBuilder()
    setShowFormBuilder(true)
    setEditingForm(null)
  }

  const handleEditForm = (formId) => {
    const form = evaluationForms.find((f) => f.id === formId)
    if (form) {
      editForm(form)
    }
  }

  const handleToggleFormStatus = (formId) => {
    setEvaluationForms((prev) =>
      prev.map((form) =>
        form.id === formId ? { ...form, status: form.status === "active" ? "inactive" : "active" } : form,
      ),
    )
  }

  const handleDeleteForm = (formId) => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      setEvaluationForms((prev) => prev.filter((form) => form.id !== formId))
    }
  }

  // NEW: Home-style sidebar behavior (copied logic)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Sidebar uses dashboard's menuItems
  const menuItems = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "myEvaluations", label: "New Evaluation", icon: "form" },
    { id: "forms", label: "Forms Management", icon: "form" },
    { id: "team", label: "Team Members", icon: "users" },
    { id: "myHistory", label: "My History", icon: "history" },
    { id: "reports", label: "Reports", icon: "chart" },
    { id: "myProfile", label: "My Profile", icon: "user" },
  ]

  // Map icon keys to inline SVGs (reusing the style from Home)
  const Icon = ({ name }) => {
    const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }
    switch (name) {
      case "dashboard":
        return (
          <svg {...common}>
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
        )
      case "form":
        return (
          <svg {...common}>
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
            <path d="M17 16H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case "users":
        return (
          <svg {...common}>
            <path
              d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
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
        )
      case "history":
        return (
          <svg {...common}>
            <path
              d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 9V13L15 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M3 13L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case "chart":
        return (
          <svg {...common}>
            <path
              d="M9 17V7M15 17V12M21 21H3V3H21V21Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "user":
        return (
          <svg {...common}>
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
        )
      default:
        return null
    }
  }

  // Dashboard tab renderer (unchanged content, same as your code)
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.overviewContent}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Total Users</h3>
                  <p>{systemStats.totalUsers}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Active Evaluations</h3>
                  <p>{systemStats.activeEvaluations}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Completed</h3>
                  <p>{systemStats.completedEvaluations}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Pending Approvals</h3>
                  <p>{systemStats.pendingApprovals}</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Recent Activities</h3>
                </div>
                <div className={styles.activitiesList}>
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className={styles.activityItem}>
                      <div className={styles.activityInfo}>
                        <h4>{activity.title}</h4>
                        <p>{activity.description}</p>
                        <span className={styles.activityMeta}>
                          {activity.user} • {activity.time}
                        </span>
                      </div>
                      <div className={styles.activityStatus}>
                        <span className={`${styles.statusBadge} ${styles[activity.status]}`}>{activity.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      case "forms":
        return (
          <div className={styles.formsContent}>
            {showFormBuilder ? (
              <div className={styles.formBuilderContainer}>
                <div className={styles.formBuilderHeader}>
                  <h2>{editingForm ? "Edit Evaluation Form" : "Create New Evaluation Form"}</h2>
                  <div className={styles.formBuilderActions}>
                    <button className={styles.saveFormButton} onClick={saveForm}>
                      Save Form
                    </button>
                    <button
                      className={styles.cancelFormButton}
                      onClick={() => {
                        setShowFormBuilder(false)
                        setEditingForm(null)
                        resetFormBuilder()
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className={styles.formBuilderContent}>
                  {/* Form Details */}
                  <div className={styles.formBuilderSection}>
                    <h3>Form Details</h3>
                    <div className={styles.formBuilderGrid}>
                      <div className={styles.formField}>
                        <label>Form Title</label>
                        <input
                          type="text"
                          value={formBuilder.title}
                          onChange={(e) => setFormBuilder((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter form title"
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Form Type</label>
                        <select
                          value={formBuilder.formType}
                          onChange={(e) =>
                            setFormBuilder((prev) => ({
                              ...prev,
                              formType: e.target.value,
                              weight:
                                e.target.value === "workrate"
                                  ? 70
                                  : e.target.value === "behavioral" && formBuilder.targetEvaluator === "admin"
                                    ? 10
                                    : e.target.value === "behavioral" && formBuilder.targetEvaluator === "peer"
                                      ? 15
                                      : e.target.value === "behavioral" && formBuilder.targetEvaluator === "self"
                                        ? 5
                                        : 0,
                            }))
                          }
                          className={styles.formSelect}
                        >
                          {formTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label>Target Evaluator</label>
                        <select
                          value={formBuilder.targetEvaluator}
                          onChange={(e) =>
                            setFormBuilder((prev) => ({
                              ...prev,
                              targetEvaluator: e.target.value,
                              weight:
                                prev.formType === "workrate"
                                  ? 70
                                  : e.target.value === "admin"
                                    ? 10
                                    : e.target.value === "peer"
                                      ? 15
                                      : 5,
                            }))
                          }
                          className={styles.formSelect}
                        >
                          {evaluatorTypes.map((evaluator) => (
                            <option key={evaluator.id} value={evaluator.id}>
                              {evaluator.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label>Weight (%)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={formBuilder.weight}
                          onChange={(e) =>
                            setFormBuilder((prev) => ({ ...prev, weight: Number.parseInt(e.target.value) || 0 }))
                          }
                          className={styles.formInput}
                          disabled={formBuilder.formType === "workrate"}
                        />
                      </div>
                      <div className={styles.formField + " " + styles.fullWidth}>
                        <label>Description</label>
                        <textarea
                          value={formBuilder.description}
                          onChange={(e) => setFormBuilder((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Enter form description"
                          className={styles.formTextarea}
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section Builder */}
                  <div className={styles.formBuilderSection}>
                    <h3>Add Section</h3>
                    <div className={styles.formBuilderGrid}>
                      <div className={styles.formField}>
                        <label>Section Name</label>
                        <input
                          type="text"
                          value={currentSection.name}
                          onChange={(e) => setCurrentSection((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter section name"
                          className={styles.formInput}
                        />
                      </div>
                      <div className={styles.formField}>
                        <label>Section Weight (%)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={currentSection.weight}
                          onChange={(e) =>
                            setCurrentSection((prev) => ({ ...prev, weight: Number.parseInt(e.target.value) || 0 }))
                          }
                          placeholder="Enter weight percentage"
                          className={styles.formInput}
                          disabled={formBuilder.formType === "behavioral"}
                        />
                      </div>
                    </div>

                    {/* Criteria Builder */}
                    <div className={styles.criteriaBuilder}>
                      <h4>Add Evaluation Criteria</h4>
                      <div className={styles.criteriaInputs}>
                        <div className={styles.formField}>
                          <label>Criterion Name</label>
                          <input
                            type="text"
                            value={currentCriterion.name}
                            onChange={(e) => setCurrentCriterion((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter criterion name"
                            className={styles.formInput}
                          />
                        </div>
                        <div className={styles.formField}>
                          <label>Criterion Weight (%)</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={currentCriterion.weight}
                            onChange={(e) =>
                              setCurrentCriterion((prev) => ({ ...prev, weight: Number.parseInt(e.target.value) || 0 }))
                            }
                            placeholder="Enter weight percentage"
                            className={styles.formInput}
                          />
                        </div>
                        <button onClick={addCriterionToSection} className={styles.addCriterionButton}>
                          Add Criterion
                        </button>
                      </div>

                      {/* Current Section Criteria */}
                      {currentSection.criteria.length > 0 && (
                        <div className={styles.currentCriteria}>
                          <h5>Section Criteria:</h5>
                          <div className={styles.criteriaList}>
                            {currentSection.criteria.map((criterion) => (
                              <div key={criterion.id} className={styles.criterionItem}>
                                <span>
                                  {criterion.name} ({criterion.weight}%)
                                </span>
                                <button
                                  onClick={() => removeCriterionFromSection(criterion.id)}
                                  className={styles.removeCriterionButton}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <div className={styles.criteriaTotal}>
                              Total: {currentSection.criteria.reduce((sum, c) => sum + c.weight, 0)}%
                            </div>
                          </div>
                        </div>
                      )}
                      <button
                        onClick={addSectionToForm}
                        className={styles.addSectionButton}
                        disabled={
                          !currentSection.name || currentSection.weight === 0 || currentSection.criteria.length === 0
                        }
                      >
                        Add Section to Form
                      </button>
                    </div>
                  </div>

                  {/* Form Preview */}
                  {formBuilder.sections.length > 0 && (
                    <div className={styles.formBuilderSection}>
                      <h3>Form Preview - Total Weight: {formBuilder.weight}%</h3>
                      <div className={styles.formPreview}>
                        {formBuilder.sections.map((section) => (
                          <div key={section.id} className={styles.previewSection}>
                            <div className={styles.previewSectionHeader}>
                              <h4>{section.name}</h4>
                              <div className={styles.previewSectionActions}>
                                <span className={styles.sectionWeight}>{section.weight}%</span>
                                <button
                                  onClick={() => removeSectionFromForm(section.id)}
                                  className={styles.removeSectionButton}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className={styles.previewCriteria}>
                              {section.criteria.map((criterion) => (
                                <div key={criterion.id} className={styles.previewCriterion}>
                                  <span>{criterion.name}</span>
                                  <span className={styles.criterionWeight}>{criterion.weight}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className={styles.formsHeader}>
                  <h2>Evaluation Forms Management</h2>
                  <div className={styles.formActionsRow}>
                    <button className={styles.createButton} onClick={handleCreateForm}>
                      Create New Form
                    </button>
                    <button className={styles.distributeButton} onClick={() => distributeForms("selected-employee-id")}>
                      Distribute Evaluation Forms
                    </button>
                  </div>
                </div>
                <div className={styles.formsGrid}>
                  {evaluationForms.map((form) => (
                    <div key={form.id} className={styles.formCard}>
                      <div className={styles.formHeader}>
                        <h3>{form.title}</h3>
                        <div className={styles.formActions}>
                          <span className={`${styles.statusBadge} ${styles[form.status]}`}>{form.status}</span>
                          <div className={styles.actionButtons}>
                            <button className={styles.editButton} onClick={() => handleEditForm(form.id)}>
                              Edit
                            </button>
                            <button className={styles.toggleButton} onClick={() => handleToggleFormStatus(form.id)}>
                              {form.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                            <button className={styles.deleteButton} onClick={() => handleDeleteForm(form.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className={styles.formDescription}>{form.description}</p>
                      <div className={styles.formDetails}>
                        <div className={styles.formMeta}>
                          <span>
                            Evaluator: <strong>{form.targetEvaluator}</strong>
                          </span>
                          <span>
                            Type: <strong>{form.formType}</strong>
                          </span>
                          <span>
                            Weight: <strong>{form.weight}%</strong>
                          </span>
                        </div>
                        <div className={styles.formSections}>
                          <h4>Form Sections:</h4>
                          {form.sections.map((section, index) => (
                            <div key={index} className={styles.sectionItem}>
                              <span>{section.name}</span>
                              <span className={styles.sectionWeight}>{section.weight}%</span>
                            </div>
                          ))}
                        </div>
                        <div className={styles.formDates}>
                          <small>Created: {new Date(form.createdDate).toLocaleDateString()}</small>
                          <small>Modified: {new Date(form.lastModified).toLocaleDateString()}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      case "team":
        return (
          <div className={styles.teamContent}>
            <h2>Team Members</h2>
            <div className={styles.teamGrid}>
              {teamMembers.map((member) => (
                <div key={member.id} className={styles.teamCard}>
                  <div className={styles.teamMemberHeader}>
                    <img src={member.avatar || "/placeholder.svg"} alt={member.name} className={styles.teamAvatar} />
                    <div className={styles.teamMemberInfo}>
                      <h3>{member.name}</h3>
                      <p>{member.role}</p>
                      <span className={styles.teamDepartment}>{member.department}</span>
                    </div>
                  </div>
                  <div className={styles.teamMemberStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Last Evaluation</span>
                      <span className={styles.statValue}>{new Date(member.lastEvaluation).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Score</span>
                      <span className={styles.statValue}>{member.evaluationScore}%</span>
                    </div>
                  </div>
                  <div className={styles.teamMemberActions}>
                    <button className={styles.viewButton}>View Profile</button>
                    <button className={styles.evaluateButton}>Evaluate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "reports":
        return (
          <div className={styles.reportsContent}>
            <h2>System Reports & Analytics</h2>
            <div className={styles.reportsGrid}>
              <div className={styles.reportCard}>
                <h3>Performance Analytics</h3>
                <p>Comprehensive performance analysis across all departments</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>Evaluation Trends</h3>
                <p>Track evaluation completion rates and score trends</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>User Activity</h3>
                <p>Monitor user engagement and system usage statistics</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>Goal Achievement</h3>
                <p>Track goal completion and performance improvement</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
            </div>
          </div>
        )
      case "myEvaluations":
        return <PerformanceForm onSubmit={(data) => console.log("Evaluation submitted:", data)} />
      case "myHistory":
        return <PerformanceHistory />
      case "myProfile":
        return (
          <div className={styles.profileContent}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <img src={user.avatar || "/placeholder.svg"} alt="Profile" className={styles.profileAvatar} />
                <div className={styles.profileInfo}>
                  <h2>{user.name}</h2>
                  <p>{user.role}</p>
                  <p>{user.department}</p>
                  <p>Employee ID: {user.employeeId}</p>
                </div>
              </div>
              <div className={styles.profileDetails}>
                <h3>Profile Information</h3>
                <div className={styles.profileGrid}>
                  <div className={styles.profileField}>
                    <label>Full Name</label>
                    <input type="text" value={user.name} readOnly />
                  </div>
                  <div className={styles.profileField}>
                    <label>Position</label>
                    <input type="text" value={user.role} readOnly />
                  </div>
                  <div className={styles.profileField}>
                    <label>Department</label>
                    <input type="text" value={user.department} readOnly />
                  </div>
                  <div className={styles.profileField}>
                    <label>Employee ID</label>
                    <input type="text" value={user.employeeId} readOnly />
                  </div>
                </div>
                <button className={styles.editButton}>Edit Profile</button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  // RENDER: Home-style layout shell + dashboard content
  return (
    <div className={homeStyles.homeContainer}>
      {/* Sidebar (Home style) */}
      <aside className={`${homeStyles.sidebar} ${isSidebarOpen ? homeStyles.sidebarOpen : ""}`}>
        <div className={homeStyles.sidebarHeader}>
          <div className={homeStyles.sidebarLogo}>
            <img src="/astu_logo.svg" alt="ASTU Logo" className={homeStyles.sidebarLogoImage} />
            {isSidebarOpen && (
              <div className={homeStyles.sidebarTitle}>
                <h3>PMS</h3>
                <p>ASTU</p>
              </div>
            )}
          </div>
          <button className={homeStyles.sidebarToggle} onClick={toggleSidebar}>
            {isSidebarOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 12H20M20 12L13 5M20 12L13 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        <nav className={homeStyles.sidebarNav}>
          <ul>
            {menuItems.map((item) => {
              const isActive = activeTab === item.id
              return (
                <li key={item.id}>
                  <div className={homeStyles.navItemContainer}>
                    <button
                      type="button"
                      className={`${homeStyles.navLink} ${isActive ? homeStyles.active : ""}`}
                      onClick={() => setActiveTab(item.id)}
                      style={{ background: "transparent", border: "none", width: "100%", textAlign: "left" }}
                    >
                      <div className={homeStyles.navIcon}>
                        <Icon name={item.icon} />
                      </div>
                      {isSidebarOpen && <span>{item.label}</span>}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        {isSidebarOpen && (
          <div className={homeStyles.sidebarFooter}>
            <div className={homeStyles.userInfo}>
              <img src={admin.avatar || "/placeholder.svg"} alt="User Avatar" className={homeStyles.userAvatar} />
              <div>
                <h4>{admin.name.split(" ")[0]}</h4>
                <p>{admin.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Wrapper (Home style) */}
      <div className={`${homeStyles.mainWrapper} ${!isSidebarOpen ? homeStyles.mainWrapperFull : ""}`}>
        {/* Header (Home style) */}
        <header className={homeStyles.header}>
          <div className={homeStyles.headerContent}>
            <div className={homeStyles.headerLeft}>
              {isMobile && (
                <button className={homeStyles.mobileMenuButton} onClick={toggleSidebar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              <div className={homeStyles.systemTitle}>
                <h1>Performance Management System</h1>
                <p>Adama Science & Technology University</p>
              </div>
            </div>
            <div className={homeStyles.userSection}>
              <div className={homeStyles.userInfo}>
                <span className={homeStyles.userName}>{admin.name}</span>
                <span className={homeStyles.userRole}>{admin.role}</span>
              </div>
              <div className={homeStyles.avatarContainer}>
                <img src={admin.avatar || "/placeholder.svg"} alt="User Avatar" className={homeStyles.userAvatar} />
                <div className={homeStyles.statusIndicator}></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content (combine home + dashboard classes) */}
        <main className={`${homeStyles.mainContent} ${styles.mainContent}`}>{renderTabContent()}</main>

        {/* Footer (Home style) */}
        <footer className={homeStyles.footer}>
          <div className={homeStyles.footerContent}>
            <p>&copy; {new Date().getFullYear()} Adama Science & Technology University. All rights reserved.</p>
            <div className={homeStyles.footerLinks}>
              <Link to="/help">Help</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DashboardPage
