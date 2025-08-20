"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import PerformanceForm from "../components/PerformanceForm"
import PerformanceHistory from "../components/PerformanceHistory"

import styles from "./DashboardPage.module.css"
import homeStyles from "./HomePage.module.css"
import { apiFetch } from "../lib/api"

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
  const [teamMembers, setTeamMembers] = useState([])

  // Admin stats
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeEvaluations: 0,
    completedEvaluations: 0,
    pendingApprovals: 0,
    totalDepartments: 0,
    evaluationForms: 0,
  })

  // User stats
  const [dashboardStats, setDashboardStats] = useState({
    totalEvaluations: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageScore: 0,
    currentQuarterScore: 0,
    lastEvaluationDate: "",
    nextEvaluationDue: "",
  })

  // Enhanced forms data with sections and criteria
  const [evaluationForms, setEvaluationForms] = useState([])
  const [evaluationTemplates, setEvaluationTemplates] = useState([])

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
  const [recentActivities, setRecentActivities] = useState([])

  // User evaluations
  const [recentEvaluations, setRecentEvaluations] = useState([])

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

  const saveForm = async () => {
    // Check if user has a team before creating evaluation
    if (teamMembers.length === 0) {
      alert("You must be assigned to a team before you can create evaluations. Please contact an administrator to assign you to a team.")
      return
    }

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

      try {
        // Convert form builder data to backend format
        const evaluationData = {
          type: formBuilder.formType === "workrate" ? "work_rate" : "behavioral",
          evaluationPeriod: formBuilder.title,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          allowSelfEvaluation: formBuilder.targetEvaluator === "self",
          allowPeerEvaluation: formBuilder.targetEvaluator === "peer",
          requireLeaderApproval: false
        }

        // Add criteria based on form type
        if (formBuilder.formType === "workrate") {
          evaluationData.workRateCriteria = formBuilder.sections.map(section => ({
            name: section.name,
            weight: section.weight,
            maxScore: 10
          }))
        } else {
          evaluationData.behavioralCriteria = formBuilder.sections[0].criteria.map(criterion => ({
            name: criterion.name,
            maxScore: 5
          }))
        }

        // Create evaluation in backend
        const newEvaluation = await apiFetch("/evaluations", {
          method: "POST",
          body: JSON.stringify(evaluationData)
        })

        // Update local state
      if (editingForm) {
          setEvaluationForms((prev) => prev.map((f) => (f.id === editingForm.id ? { ...f, ...newEvaluation } : f)))
      } else {
          setEvaluationForms((prev) => [...prev, { ...formBuilder, ...newEvaluation }])
      }

      resetFormBuilder()
      setShowFormBuilder(false)
      setEditingForm(null)

        // Reload evaluations from backend
        const evals = await apiFetch("/evaluations")
        const completed = evals.filter(e => e.status === 'completed').length
        setDashboardStats(s => ({
          ...s,
          totalEvaluations: evals.length,
          completedEvaluations: completed,
          pendingEvaluations: Math.max(0, evals.length - completed),
        }))
        setRecentEvaluations(evals.slice(0, 5).map(e => ({
          id: e._id,
          type: e.type === 'work_rate' ? 'Work Performance' : 'Behavioral',
          evaluator: 'Team Leader',
          score: e.totalScore || 0,
          status: e.status === 'completed' ? 'Completed' : 'Draft',
          date: new Date(e.createdAt).toISOString().slice(0,10),
        })))

        alert("Evaluation created successfully!")
      } catch (error) {
        console.error("Error creating evaluation:", error)
        alert(`Failed to create evaluation: ${error.message}`)
      }
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

  // Distribute forms to team members
  const distributeForms = async (employeeId) => {
    // Check if user has a team before distributing forms
    if (teamMembers.length === 0) {
      alert("You must be assigned to a team before you can distribute evaluation forms. Please contact an administrator to assign you to a team.")
      return
    }

    try {
      // Get the team member's name
      const member = teamMembers.find(m => m.id === employeeId)
      if (!member) {
        alert("Team member not found")
        return
      }

      // Create a work rate evaluation for this member
      const workRateData = {
        type: "work_rate",
        evaluationPeriod: `Work Rate Evaluation - ${member.name} - ${new Date().toLocaleDateString()}`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        allowSelfEvaluation: false,
        allowPeerEvaluation: false,
        requireLeaderApproval: false,
        workRateCriteria: [
          { name: "Quality of Work", weight: 30, maxScore: 10 },
          { name: "Productivity", weight: 25, maxScore: 10 },
          { name: "Technical Skills", weight: 25, maxScore: 10 },
          { name: "Communication", weight: 20, maxScore: 10 }
        ]
      }

      // Create a behavioral evaluation for this member
      const behavioralData = {
        type: "behavioral",
        evaluationPeriod: `Behavioral Evaluation - ${member.name} - ${new Date().toLocaleDateString()}`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        allowSelfEvaluation: true,
        allowPeerEvaluation: true,
        requireLeaderApproval: false,
        behavioralCriteria: [
          { name: "Teamwork", maxScore: 5 },
          { name: "Leadership", maxScore: 5 },
          { name: "Problem Solving", maxScore: 5 },
          { name: "Adaptability", maxScore: 5 },
          { name: "Professionalism", maxScore: 5 }
        ]
      }

      // Create both evaluations
      await Promise.all([
        apiFetch("/evaluations", {
          method: "POST",
          body: JSON.stringify(workRateData)
        }),
        apiFetch("/evaluations", {
          method: "POST",
          body: JSON.stringify(behavioralData)
        })
      ])

      alert(`Evaluations created successfully for ${member.name}!`)
      
      // Reload evaluations
      const evals = await apiFetch("/evaluations")
      const completed = evals.filter(e => e.status === 'completed').length
      setDashboardStats(s => ({
        ...s,
        totalEvaluations: evals.length,
        completedEvaluations: completed,
        pendingEvaluations: Math.max(0, evals.length - completed),
      }))
      setRecentEvaluations(evals.slice(0, 5).map(e => ({
        id: e._id,
        type: e.type === 'work_rate' ? 'Work Performance' : 'Behavioral',
        evaluator: 'Team Leader',
        score: e.totalScore || 0,
        status: e.status === 'completed' ? 'Completed' : 'Draft',
        date: new Date(e.createdAt).toISOString().slice(0,10),
      })))
    } catch (error) {
      console.error("Error distributing forms:", error)
      alert(`Failed to create evaluations: ${error.message}`)
    }
  }

  const handleCreateForm = () => {
    // Check if user has a team before opening form builder
    if (teamMembers.length === 0) {
      alert("You must be assigned to a team before you can create evaluation forms. Please contact an administrator to assign you to a team.")
      return
    }
    
    resetFormBuilder()
    setShowFormBuilder(true)
    setEditingForm(null)
  }

  const createFromTemplate = async (template) => {
    // Check if user has a team before creating evaluation
    if (teamMembers.length === 0) {
      alert("You must be assigned to a team before you can create evaluations. Please contact an administrator to assign you to a team.")
      return
    }

    try {
      const evaluationData = {
        type: template.type,
        evaluationPeriod: `${template.name} - ${new Date().toLocaleDateString()}`,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        allowSelfEvaluation: true,
        allowPeerEvaluation: true,
        requireLeaderApproval: false
      }

      if (template.type === "work_rate") {
        evaluationData.workRateCriteria = template.workRateCriteria
      } else {
        evaluationData.behavioralCriteria = template.behavioralCriteria
      }

      // Create evaluation in backend
      const newEvaluation = await apiFetch("/evaluations", {
        method: "POST",
        body: JSON.stringify(evaluationData)
      })

      alert("Evaluation created from template successfully!")
      
      // Reload evaluations
      const evals = await apiFetch("/evaluations")
      const completed = evals.filter(e => e.status === 'completed').length
      setDashboardStats(s => ({
        ...s,
        totalEvaluations: evals.length,
        completedEvaluations: completed,
        pendingEvaluations: Math.max(0, evals.length - completed),
      }))
      setRecentEvaluations(evals.slice(0, 5).map(e => ({
        id: e._id,
        type: e.type === 'work_rate' ? 'Work Performance' : 'Behavioral',
        evaluator: 'Team Leader',
        score: e.totalScore || 0,
        status: e.status === 'completed' ? 'Completed' : 'Draft',
        date: new Date(e.createdAt).toISOString().slice(0,10),
      })))
    } catch (error) {
      console.error("Error creating evaluation from template:", error)
      alert(`Failed to create evaluation: ${error.message}`)
    }
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

  // Load leader data from backend
  useEffect(() => {
    const load = async () => {
      try {
        const me = await apiFetch("/users/me")
        if (me?.team?._id) {
          const teams = await apiFetch("/teams")
          const myTeam = teams.find(t => (t._id === me.team._id) || (t.id === me.team._id))
          if (myTeam) {
            setTeamMembers((myTeam.members || []).map(m => ({
              id: m._id,
              name: `${m.firstName} ${m.lastName}`,
              role: m.role,
              department: myTeam.name || '',
              status: m.isActive ? 'active' : 'inactive',
              lastEvaluation: '',
              evaluationScore: 0,
              avatar: "/placeholder.svg",
            })))
          }
        }
        
        // Try to load evaluations (will return empty array if no team)
        try {
          const evals = await apiFetch("/evaluations")
          const completed = evals.filter(e => e.status === 'completed').length
          setDashboardStats(s => ({
            ...s,
            totalEvaluations: evals.length,
            completedEvaluations: completed,
            pendingEvaluations: Math.max(0, evals.length - completed),
          }))
          setRecentEvaluations(evals.slice(0, 5).map(e => ({
            id: e._id,
            type: e.type === 'work_rate' ? 'Work Performance' : 'Behavioral',
            evaluator: 'Team Leader',
            score: e.totalScore || 0,
            status: e.status === 'completed' ? 'Completed' : 'Draft',
            date: new Date(e.createdAt).toISOString().slice(0,10),
          })))
        } catch (evalError) {
          console.log("Could not load evaluations (likely no team assigned):", evalError.message)
          // Set empty state for evaluations
          setDashboardStats(s => ({
            ...s,
            totalEvaluations: 0,
            completedEvaluations: 0,
            pendingEvaluations: 0,
          }))
          setRecentEvaluations([])
        }

        // Load evaluation templates
        try {
          const templates = await apiFetch("/evaluations/templates")
          setEvaluationTemplates(templates)
        } catch (templateError) {
          console.log("Could not load templates:", templateError.message)
          setEvaluationTemplates([])
        }
      } catch (err) {
        console.error("Error loading user data:", err)
      }
    }
    load()
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
                  <h3>Team Members</h3>
                  <p>{teamMembers.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Total Evaluations</h3>
                  <p>{dashboardStats.totalEvaluations}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Completed</h3>
                  <p>{dashboardStats.completedEvaluations}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Pending</h3>
                  <p>{dashboardStats.pendingEvaluations}</p>
                </div>
              </div>
            </div>

            {/* Team Setup Check */}
            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Team Setup</h3>
                  <p>Ensure your team is properly configured</p>
                </div>
                <div className={styles.teamSetupSection}>
                  {teamMembers.length > 0 ? (
                    <div className={styles.teamSetupSuccess}>
                      <p><strong>Status:</strong> Team assigned ✓</p>
                      <p><strong>Team Members:</strong> {teamMembers.length}</p>
                      <p><strong>Ready to create evaluations!</strong></p>
                    </div>
                  ) : (
                    <>
                      <p>Before creating evaluations, you need to be assigned to a team by an administrator.</p>
                      <div className={styles.teamSetupInfo}>
                        <p><strong>Status:</strong> No team assigned</p>
                        <p><strong>Action Required:</strong> Contact an administrator to assign you to a team</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Evaluation Creation */}
            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Quick Evaluation Creation</h3>
                  <p>Create evaluations from templates or start from scratch</p>
                </div>
                {teamMembers.length > 0 ? (
                  <div className={styles.templateGrid}>
                    {evaluationTemplates.map((template) => (
                      <div key={template._id} className={styles.templateCard}>
                        <div className={styles.templateInfo}>
                          <h4>{template.name}</h4>
                          <p>{template.description || `${template.type === 'work_rate' ? 'Work Rate' : 'Behavioral'} evaluation template`}</p>
                          <span className={styles.templateType}>{template.type === 'work_rate' ? 'Work Rate' : 'Behavioral'}</span>
                        </div>
                                                 <button 
                           className={styles.createFromTemplateButton}
                           onClick={() => createFromTemplate(template)}
                           disabled={teamMembers.length === 0}
                         >
                           Use Template
                         </button>
                      </div>
                    ))}
                    <div className={styles.templateCard}>
                      <div className={styles.templateInfo}>
                        <h4>Custom Evaluation</h4>
                        <p>Create a completely custom evaluation form</p>
                        <span className={styles.templateType}>Custom</span>
                      </div>
                                           <button 
                       className={styles.createFromTemplateButton}
                       onClick={handleCreateForm}
                       disabled={teamMembers.length === 0}
                     >
                       Create Custom
                     </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.teamSetupInfo}>
                    <p><strong>Evaluation creation is disabled</strong></p>
                    <p>You need to be assigned to a team before you can create evaluations.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Active Evaluations */}
            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Active Evaluations</h3>
                  <p>Currently running evaluations for your team</p>
                </div>
                <div className={styles.evaluationsList}>
                  {teamMembers.length > 0 ? (
                    recentEvaluations.length > 0 ? (
                      recentEvaluations.map((evaluation) => (
                        <div key={evaluation.id} className={styles.evaluationItem}>
                          <div className={styles.evaluationInfo}>
                            <h4>{evaluation.type}</h4>
                            <p>Period: {evaluation.date}</p>
                            <span className={`${styles.statusBadge} ${styles[evaluation.status.toLowerCase()]}`}>
                              {evaluation.status}
                            </span>
                          </div>
                          <div className={styles.evaluationActions}>
                            <button className={styles.viewButton}>View Details</button>
                            {evaluation.status === 'Draft' && (
                              <button className={styles.evaluateButton}>Start Evaluation</button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noEvaluations}>
                        <p>No evaluations created yet. Create your first evaluation using the templates above!</p>
                      </div>
                    )
                  ) : (
                    <div className={styles.teamSetupInfo}>
                      <p><strong>No evaluations available</strong></p>
                      <p>You need to be assigned to a team before you can view evaluations.</p>
                    </div>
                  )}
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
                   {teamMembers.length > 0 ? (
                     <div className={styles.formActionsRow}>
                       <button className={styles.createButton} onClick={handleCreateForm}>
                         Create New Form
                       </button>
                       <button className={styles.distributeButton} onClick={() => distributeForms("selected-employee-id")}>
                         Distribute Evaluation Forms
                       </button>
                     </div>
                   ) : (
                     <div className={styles.teamSetupInfo}>
                       <p><strong>Forms management is disabled</strong></p>
                       <p>You need to be assigned to a team before you can manage evaluation forms.</p>
                     </div>
                   )}
                 </div>
                                 {teamMembers.length > 0 ? (
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
                 ) : (
                   <div className={styles.teamSetupInfo}>
                     <p><strong>No forms available</strong></p>
                     <p>You need to be assigned to a team before you can view or manage evaluation forms.</p>
                   </div>
                 )}
              </>
            )}
          </div>
        )
             case "team":
         return (
           <div className={styles.teamContent}>
             <h2>Team Members</h2>
             {teamMembers.length > 0 ? (
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
                       <button 
                         className={styles.evaluateButton}
                         onClick={() => distributeForms(member.id)}
                       >
                         Evaluate
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className={styles.teamSetupInfo}>
                 <p><strong>No team assigned</strong></p>
                 <p>You need to be assigned to a team by an administrator before you can view team members.</p>
                 <p>Please contact an administrator to assign you to a team.</p>
               </div>
             )}
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
