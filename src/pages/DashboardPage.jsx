"use client"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import PerformanceForm from "../components/PerformanceForm"
import PerformanceHistory from "../components/PerformanceHistory"
import api from "../api"
import styles from "./DashboardPage.module.css"
import homeStyles from "./HomePage.module.css"

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [editingForm, setEditingForm] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 6
  const navigate = useNavigate()

  const formTypes = [
    { id: "workrate", name: "Work Performance" },
    { id: "behavioral", name: "Behavioral Evaluation" },
  ]

  const evaluatorTypes = [
    { id: "admin", name: "Administrator/Manager" },
    { id: "peer", name: "Peer/Colleague" },
    { id: "self", name: "Self-Evaluation" },
  ]

  const [admin, setAdmin] = useState({
    name: "Dr. Bekele Tadesse",
    role: "System Administrator",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=80&width=80&text=Admin",
  })

  const [user, setUser] = useState({
    name: "Team Leader",
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    employeeId: "ASTU-ICT-001",
    avatar: "/placeholder.svg?height=80&width=80&text=User",
  })

  const [teamMembers, setTeamMembers] = useState([])
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeEvaluations: 0,
    completedEvaluations: 0,
    pendingApprovals: 0,
    totalDepartments: 0,
    evaluationForms: 0,
  })

  const [dashboardStats, setDashboardStats] = useState({
    totalEvaluations: 0,
    pendingEvaluations: 0,
    completedEvaluations: 0,
    averageScore: 0,
    currentQuarterScore: 0,
    lastEvaluationDate: "",
    nextEvaluationDue: "",
  })

  const [evaluationForms, setEvaluationForms] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [recentEvaluations, setRecentEvaluations] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isViewingProfile, setIsViewingProfile] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: "", avatar: null })

  const [formBuilder, setFormBuilder] = useState({
    title: "",
    description: "",
    formType: "workrate",
    targetEvaluator: "admin",
    weight: 70,
    sections: [],
    ratingScale: { min: 1, max: 4, labels: ["Poor", "Fair", "Good", "Excellent"] },
  })

  const [currentSection, setCurrentSection] = useState({ name: "", weight: 0, criteria: [] })
  const [currentCriterion, setCurrentCriterion] = useState({ name: "", weight: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}")
        const userId = userData.id

        if (userId) {
          // Fetch admin and user data
          const adminResponse = await api.getUserById(userId)
          setAdmin({
            name: adminResponse.name,
            role: "System Administrator",
            department: adminResponse.department,
            avatar: adminResponse.profileImage || "/placeholder.svg?height=80&width=80&text=Admin",
          })
          setUser({
            name: adminResponse.name,
            role: adminResponse.jobTitle,
            department: adminResponse.department,
            employeeId: adminResponse.employeeId || "ASTU-ICT-001",
            avatar: adminResponse.profileImage || "/placeholder.svg?height=80&width=80&text=User",
          })
          setProfileForm({ name: adminResponse.name, avatar: null })

          // Fetch team members
          const members = await api.getTeamMembers(userId)
          setTeamMembers(members.map(member => ({
            id: member.id,
            name: member.name,
            role: member.jobTitle,
            department: member.department,
            status: member.status,
            lastEvaluation: member.lastEvaluation,
            evaluationScore: member.evaluationScore || 0,
            avatar: member.profileImage || `/placeholder.svg?height=80&width=80&text=${member.name.charAt(0)}`,
          })))

          // Fetch system stats
          const users = await api.getAllUsers()
          const forms = await api.getEvaluationForms()
          const evaluations = await api.getEvaluationsByUser(userId)
          const currentMonth = new Date().toISOString().slice(0, 7)
          setSystemStats({
            totalUsers: users.length,
            activeEvaluations: evaluations.filter(e => e.status === "pending").length,
            completedEvaluations: evaluations.filter(e => e.status === "completed").length,
            pendingApprovals: evaluations.filter(e => e.status === "pending_approval").length,
            totalDepartments: new Set(users.map(u => u.department)).size,
            evaluationForms: forms.length,
          })

          // Fetch dashboard stats
          const userEvaluations = await api.getUserEvaluations(userId)
          setDashboardStats({
            totalEvaluations: userEvaluations.length,
            pendingEvaluations: userEvaluations.filter(e => e.status === "pending").length,
            completedEvaluations: userEvaluations.filter(e => e.status === "completed").length,
            averageScore: userEvaluations.length ? (userEvaluations.reduce((sum, e) => sum + e.score, 0) / userEvaluations.length).toFixed(1) : 0,
            currentQuarterScore: userEvaluations.filter(e => e.date.startsWith(currentMonth)).reduce((sum, e) => sum + e.score, 0) / userEvaluations.filter(e => e.date.startsWith(currentMonth)).length || 0,
            lastEvaluationDate: userEvaluations[0]?.date || "",
            nextEvaluationDue: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
          })

          // Fetch evaluation forms
          setEvaluationForms(forms.map(form => ({
            id: form.id,
            title: form.title,
            description: form.description,
            formType: form.formType,
            targetEvaluator: form.targetEvaluator,
            weight: form.weight,
            status: form.status,
            createdDate: form.createdDate,
            lastModified: form.lastModified,
            usageCount: form.usageCount,
            sections: form.sections,
            ratingScale: form.ratingScale,
          })))

          // Fetch recent activities, evaluations, and tasks
          setRecentActivities((await api.getRecentActivities()).slice(0, 3))
          setRecentEvaluations(userEvaluations.slice(0, 3))
          setUpcomingTasks(await api.getUpcomingTasks(userId))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError(error.message || "Failed to load data")
      }
    }

    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    fetchData()

    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const addCriterionToSection = () => {
    if (currentCriterion.name && currentCriterion.weight > 0) {
      setCurrentSection(prev => ({
        ...prev,
        criteria: [...prev.criteria, { id: Date.now(), ...currentCriterion }],
      }))
      setCurrentCriterion({ name: "", weight: 0 })
    }
  }

  const removeCriterionFromSection = criterionId => {
    setCurrentSection(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== criterionId),
    }))
  }

  const addSectionToForm = () => {
    if (currentSection.name && currentSection.weight > 0 && currentSection.criteria.length > 0) {
      const totalCriteriaWeight = currentSection.criteria.reduce((sum, c) => sum + c.weight, 0)
      if (totalCriteriaWeight === 100) {
        setFormBuilder(prev => ({
          ...prev,
          sections: [...prev.sections, { id: Date.now(), ...currentSection }],
        }))
        setCurrentSection({ name: "", weight: 0, criteria: [] })
      } else {
        setError("Criteria weights must total 100% for the section")
      }
    } else {
      setError("Section name, weight, and criteria are required")
    }
  }

  const removeSectionFromForm = sectionId => {
    setFormBuilder(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId),
    }))
  }

  const saveForm = async () => {
    if (formBuilder.title && formBuilder.sections.length > 0) {
      if (formBuilder.formType === "behavioral" && formBuilder.sections[0].weight !== 100) {
        setError("Behavioral evaluation sections must total 100% weight")
        return
      }
      if (formBuilder.formType === "workrate") {
        const totalWeight = formBuilder.sections.reduce((sum, s) => sum + s.weight, 0)
        if (totalWeight !== 100) {
          setError("Work rate evaluation sections must total 100% weight")
          return
        }
      }

      try {
        const newForm = {
          id: editingForm ? editingForm.id : Date.now(),
          ...formBuilder,
          status: editingForm ? editingForm.status : "draft",
          createdDate: editingForm ? editingForm.createdDate : new Date().toISOString().split("T")[0],
          lastModified: new Date().toISOString().split("T")[0],
          usageCount: editingForm ? editingForm.usageCount : 0,
        }

        if (editingForm) {
          await api.updateEvaluationForm(newForm.id, newForm)
        } else {
          await api.createEvaluationForm(newForm)
        }

        const forms = await api.getEvaluationForms()
        setEvaluationForms(forms.map(form => ({
          id: form.id,
          title: form.title,
          description: form.description,
          formType: form.formType,
          targetEvaluator: form.targetEvaluator,
          weight: form.weight,
          status: form.status,
          createdDate: form.createdDate,
          lastModified: form.lastModified,
          usageCount: form.usageCount,
          sections: form.sections,
          ratingScale: form.ratingScale,
        })))
        setSuccess("Form saved successfully!")
        resetFormBuilder()
        setShowFormBuilder(false)
        setEditingForm(null)
      } catch (error) {
        console.error("Error saving form:", error)
        setError(error.message || "Failed to save form")
      }
    } else {
      setError("Form title and sections are required")
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
      ratingScale: { min: 1, max: 4, labels: ["Poor", "Fair", "Good", "Excellent"] },
    })
    setCurrentSection({ name: "", weight: 0, criteria: [] })
    setCurrentCriterion({ name: "", weight: 0 })
  }

  const editForm = form => {
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

  const distributeForms = async employeeId => {
    try {
      await api.distributeForms(employeeId, [
        { evaluator: "admin", formType: "workrate", weight: 70 },
        { evaluator: "admin", formType: "behavioral", weight: 10 },
        { evaluator: "peer", formType: "behavioral", weight: 15 },
        { evaluator: "self", formType: "behavioral", weight: 5 },
      ])
      setSuccess("Forms distributed successfully!")
    } catch (error) {
      console.error("Error distributing forms:", error)
      setError(error.message || "Failed to distribute forms")
    }
  }

  const handleCreateForm = () => {
    resetFormBuilder()
    setShowFormBuilder(true)
    setEditingForm(null)
  }

  const handleEditForm = formId => {
    const form = evaluationForms.find(f => f.id === formId)
    if (form) editForm(form)
  }

  const handleToggleFormStatus = async formId => {
    try {
      const form = evaluationForms.find(f => f.id === formId)
      const newStatus = form.status === "active" ? "inactive" : "active"
      await api.updateEvaluationForm(formId, { ...form, status: newStatus })
      setEvaluationForms(prev => prev.map(f => (f.id === formId ? { ...f, status: newStatus } : f)))
      setSuccess(`Form ${newStatus} successfully!`)
    } catch (error) {
      console.error("Error toggling form status:", error)
      setError(error.message || "Failed to toggle form status")
    }
  }

  const handleDeleteForm = async formId => {
    if (window.confirm("Are you sure you want to delete this form?")) {
      try {
        await api.deleteEvaluationForm(formId)
        setEvaluationForms(prev => prev.filter(form => form.id !== formId))
        setSuccess("Form deleted successfully!")
      } catch (error) {
        console.error("Error deleting form:", error)
        setError(error.message || "Failed to delete form")
      }
    }
  }

  const handleViewProfile = employee => {
    setSelectedEmployee(employee)
    setIsViewingProfile(true)
  }

  const handleEvaluate = employee => {
    setSelectedEmployee(employee)
    setActiveTab("myEvaluations")
  }

  const handleEditProfile = () => {
    setIsEditingProfile(true)
    setProfileForm({ name: user.name, avatar: null })
  }

  const handleProfileUpdate = async e => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("name", profileForm.name)
      if (profileForm.avatar) formData.append("avatar", profileForm.avatar)
      const userData = JSON.parse(localStorage.getItem("userData") || "{}")
      await api.updateUser(userData.id, formData)
      const updatedUser = await api.getUserById(userData.id)
      setUser({
        name: updatedUser.name,
        role: updatedUser.jobTitle,
        department: updatedUser.department,
        employeeId: updatedUser.employeeId,
        avatar: updatedUser.profileImage || user.avatar,
      })
      setAdmin(prev => ({ ...prev, name: updatedUser.name, avatar: updatedUser.profileImage || prev.avatar }))
      setSuccess("Profile updated successfully!")
      setIsEditingProfile(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userData")
    localStorage.removeItem("userRole")
    navigate("/login")
  }

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const paginatedTeamMembers = filteredTeamMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredTeamMembers.length / itemsPerPage)

  const menuItems = [
    { id: "overview", label: "Overview", icon: "dashboard" },
    { id: "myEvaluations", label: "New Evaluation", icon: "form" },
    { id: "forms", label: "Forms Management", icon: "form" },
    { id: "team", label: "Team Members", icon: "users" },
    { id: "myHistory", label: "My History", icon: "history" },
    { id: "reports", label: "Reports", icon: "chart" },
    { id: "myProfile", label: "My Profile", icon: "user" },
  ]

  const Icon = ({ name }) => {
    const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }
    switch (name) {
      case "dashboard":
        return (
          <svg {...common}>
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case "form":
        return (
          <svg {...common}>
            <path d="M21 3H3V21H21V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 8H15V12H9V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 16H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case "users":
        return (
          <svg {...common}>
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case "history":
        return (
          <svg {...common}>
            <path d="M12 22C16.9706 22 21 17.9706 21 13C21 8.02944 16.9706 4 12 4C7.02944 4 3 8.02944 3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9V13L15 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 13L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case "chart":
        return (
          <svg {...common}>
            <path d="M9 17V7M15 17V12M21 21H3V3H21V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case "user":
        return (
          <svg {...common}>
            <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 20C6 17.7909 7.79086 16 10 16H14C16.2091 16 18 17.7909 18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      default:
        return null
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.overviewContent}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Total Evaluations</h3>
                  <p>{dashboardStats.totalEvaluations}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Pending Evaluations</h3>
                  <p>{dashboardStats.pendingEvaluations}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Average Score</h3>
                  <p>{dashboardStats.averageScore}%</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3>Next Evaluation Due</h3>
                  <p>{new Date(dashboardStats.nextEvaluationDue).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className={styles.contentGrid}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Recent Activities</h3>
                </div>
                <div className={styles.activitiesList}>
                  {recentActivities.map(activity => (
                    <div key={activity.id} className={styles.activityItem}>
                      <div className={styles.activityInfo}>
                        <h4>{activity.title}</h4>
                        <p>{activity.description}</p>
                        <span className={styles.activityMeta}>{activity.user} • {activity.time}</span>
                      </div>
                      <div className={styles.activityStatus}>
                        <span className={`${styles.statusBadge} ${styles[activity.status]}`}>{activity.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Upcoming Tasks</h3>
                </div>
                <div className={styles.activitiesList}>
                  {upcomingTasks.map(task => (
                    <div key={task.id} className={styles.activityItem}>
                      <div className={styles.activityInfo}>
                        <h4>{task.title}</h4>
                        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        <span className={styles.activityMeta}>Priority: {task.priority}</span>
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
                    <button className={styles.saveFormButton} onClick={saveForm}>Save Form</button>
                    <button className={styles.cancelFormButton} onClick={() => { setShowFormBuilder(false); setEditingForm(null); resetFormBuilder(); }}>
                      Cancel
                    </button>
                  </div>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}
                <div className={styles.formBuilderContent}>
                  <div className={styles.formBuilderSection}>
                    <h3>Form Details</h3>
                    <div className={styles.formBuilderGrid}>
                      <div className={styles.formField}>
                        <label>Form Title</label>
                        <input type="text" value={formBuilder.title} onChange={e => setFormBuilder(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter form title" className={styles.formInput} />
                      </div>
                      <div className={styles.formField}>
                        <label>Form Type</label>
                        <select value={formBuilder.formType} onChange={e => setFormBuilder(prev => ({ ...prev, formType: e.target.value, weight: e.target.value === "workrate" ? 70 : e.target.value === "behavioral" && prev.targetEvaluator === "admin" ? 10 : prev.targetEvaluator === "peer" ? 15 : 5 }))} className={styles.formSelect}>
                          {formTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label>Target Evaluator</label>
                        <select value={formBuilder.targetEvaluator} onChange={e => setFormBuilder(prev => ({ ...prev, targetEvaluator: e.target.value, weight: prev.formType === "workrate" ? 70 : e.target.value === "admin" ? 10 : e.target.value === "peer" ? 15 : 5 }))} className={styles.formSelect}>
                          {evaluatorTypes.map(evaluator => <option key={evaluator.id} value={evaluator.id}>{evaluator.name}</option>)}
                        </select>
                      </div>
                      <div className={styles.formField}>
                        <label>Weight (%)</label>
                        <input type="number" min="1" max="100" value={formBuilder.weight} onChange={e => setFormBuilder(prev => ({ ...prev, weight: Number.parseInt(e.target.value) || 0 }))} className={styles.formInput} disabled={formBuilder.formType === "workrate"} />
                      </div>
                      <div className={styles.formField + " " + styles.fullWidth}>
                        <label>Description</label>
                        <textarea value={formBuilder.description} onChange={e => setFormBuilder(prev => ({ ...prev, description: e.target.value }))} placeholder="Enter form description" className={styles.formTextarea} rows="3" />
                      </div>
                    </div>
                  </div>
                  <div className={styles.formBuilderSection}>
                    <h3>Add Section</h3>
                    <div className={styles.formBuilderGrid}>
                      <div className={styles.formField}>
                        <label>Section Name</label>
                        <input type="text" value={currentSection.name} onChange={e => setCurrentSection(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter section name" className={styles.formInput} />
                      </div>
                      <div className={styles.formField}>
                        <label>Section Weight (%)</label>
                        <input type="number" min="1" max="100" value={currentSection.weight} onChange={e => setCurrentSection(prev => ({ ...prev, weight: Number.parseInt(e.target.value) || 0 }))} placeholder="Enter weight percentage" className={styles.formInput} disabled={formBuilder.formType === "behavioral"} />
                      </div>
                    </div>
                    <div className={styles.criteriaBuilder}>
                      <h4>Add Evaluation Criteria</h4>
                      <div className={styles.criteriaInputs}>
                        <div className={styles.formField}>
                          <label>Criterion Name</label>
                          <input type="text" value={currentCriterion.name} onChange={e => setCurrentCriterion(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter criterion name" className={styles.formInput} />
                        </div>
                        <div className={styles.formField}>
                          <label>Criterion Weight (%)</label>
                          <input type="number" min="1" max="100" value={currentCriterion.weight} onChange={e => setCurrentCriterion(prev => ({ ...prev, weight: Number.parseInt(e.target.value) || 0 }))} placeholder="Enter weight percentage" className={styles.formInput} />
                        </div>
                        <button onClick={addCriterionToSection} className={styles.addCriterionButton}>Add Criterion</button>
                      </div>
                      {currentSection.criteria.length > 0 && (
                        <div className={styles.currentCriteria}>
                          <h5>Section Criteria:</h5>
                          <div className={styles.criteriaList}>
                            {currentSection.criteria.map(criterion => (
                              <div key={criterion.id} className={styles.criterionItem}>
                                <span>{criterion.name} ({criterion.weight}%)</span>
                                <button onClick={() => removeCriterionFromSection(criterion.id)} className={styles.removeCriterionButton}>Remove</button>
                              </div>
                            ))}
                            <div className={styles.criteriaTotal}>Total: {currentSection.criteria.reduce((sum, c) => sum + c.weight, 0)}%</div>
                          </div>
                        </div>
                      )}
                      <button onClick={addSectionToForm} className={styles.addSectionButton} disabled={!currentSection.name || currentSection.weight === 0 || currentSection.criteria.length === 0}>Add Section to Form</button>
                    </div>
                  </div>
                  {formBuilder.sections.length > 0 && (
                    <div className={styles.formBuilderSection}>
                      <h3>Form Preview - Total Weight: {formBuilder.weight}%</h3>
                      <div className={styles.formPreview}>
                        {formBuilder.sections.map(section => (
                          <div key={section.id} className={styles.previewSection}>
                            <div className={styles.previewSectionHeader}>
                              <h4>{section.name}</h4>
                              <div className={styles.previewSectionActions}>
                                <span className={styles.sectionWeight}>{section.weight}%</span>
                                <button onClick={() => removeSectionFromForm(section.id)} className={styles.removeSectionButton}>Remove</button>
                              </div>
                            </div>
                            <div className={styles.previewCriteria}>
                              {section.criteria.map(criterion => (
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
                    <button className={styles.createButton} onClick={handleCreateForm}>Create New Form</button>
                    <button className={styles.distributeButton} onClick={() => distributeForms(teamMembers[0]?.id || "selected-employee-id")}>Distribute Evaluation Forms</button>
                  </div>
                </div>
                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>{success}</div>}
                <div className={styles.formsGrid}>
                  {evaluationForms.map(form => (
                    <div key={form.id} className={styles.formCard}>
                      <div className={styles.formHeader}>
                        <h3>{form.title}</h3>
                        <div className={styles.formActions}>
                          <span className={`${styles.statusBadge} ${styles[form.status]}`}>{form.status}</span>
                          <div className={styles.actionButtons}>
                            <button className={styles.editButton} onClick={() => handleEditForm(form.id)}>Edit</button>
                            <button className={styles.toggleButton} onClick={() => handleToggleFormStatus(form.id)}>{form.status === "active" ? "Deactivate" : "Activate"}</button>
                            <button className={styles.deleteButton} onClick={() => handleDeleteForm(form.id)}>Delete</button>
                          </div>
                        </div>
                      </div>
                      <p className={styles.formDescription}>{form.description}</p>
                      <div className={styles.formDetails}>
                        <div className={styles.formMeta}>
                          <span>Evaluator: <strong>{form.targetEvaluator}</strong></span>
                          <span>Type: <strong>{form.formType}</strong></span>
                          <span>Weight: <strong>{form.weight}%</strong></span>
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
        if (isViewingProfile && selectedEmployee) {
          return (
            <div className={styles.employeeDetails}>
              <div className={styles.detailsHeader}>
                <button onClick={() => setIsViewingProfile(false)} className={styles.backButton}>← Back to Team</button>
                <h2>{selectedEmployee.name}'s Profile</h2>
              </div>
              <div className={styles.employeeCard}>
                <div className={styles.employeeInfo}>
                  <img src={selectedEmployee.avatar} alt="Profile" className={styles.profileAvatar} />
                  <div className={styles.employeeBasicInfo}>
                    <h3>{selectedEmployee.name}</h3>
                    <p>{selectedEmployee.role}</p>
                    <span className={`${styles.statusBadge} ${styles[selectedEmployee.status]}`}>{selectedEmployee.status}</span>
                  </div>
                </div>
                <div className={styles.employeeDetailsGrid}>
                  <div className={styles.detailItem}><label>Department:</label><span>{selectedEmployee.department}</span></div>
                  <div className={styles.detailItem}><label>Last Evaluation:</label><span>{new Date(selectedEmployee.lastEvaluation).toLocaleDateString()}</span></div>
                  <div className={styles.detailItem}><label>Score:</label><span>{selectedEmployee.evaluationScore}%</span></div>
                </div>
                <div className={styles.employeeActions}>
                  <button onClick={() => handleEvaluate(selectedEmployee)} className={styles.evaluateButton}>Evaluate</button>
                </div>
              </div>
            </div>
          )
        }
        return (
          <div className={styles.teamContent}>
            <div className={styles.teamHeader}>
              <h2>Team Members ({filteredTeamMembers.length})</h2>
              <input type="text" placeholder="Search team members..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className={styles.searchInput} />
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            <div className={styles.teamGrid}>
              {paginatedTeamMembers.length > 0 ? (
                paginatedTeamMembers.map(member => (
                  <div key={member.id} className={styles.teamCard}>
                    <div className={styles.teamMemberHeader}>
                      <img src={member.avatar} alt={member.name} className={styles.teamAvatar} />
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
                      <button className={styles.viewButton} onClick={() => handleViewProfile(member)}>View Profile</button>
                      <button className={styles.evaluateButton} onClick={() => handleEvaluate(member)}>Evaluate</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>No team members found</div>
              )}
            </div>
            <div className={styles.pagination}>
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={styles.paginationButton}>Previous</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={styles.paginationButton}>Next</button>
            </div>
          </div>
        )
      case "reports":
        return (
          <div className={styles.reportsContent}>
            <div className={styles.reportsHeader}>
              <h2>Performance Reports</h2>
              <p>View and generate performance analytics</p>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>{success}</div>}
            <div className={styles.reportsTable}>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Evaluation Type</th>
                    <th>Score</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvaluations.map(evaluation => (
                    <tr key={evaluation.id}>
                      <td>{evaluation.evaluator}</td>
                      <td>{evaluation.type}</td>
                      <td>{evaluation.score}%</td>
                      <td>{new Date(evaluation.date).toLocaleDateString()}</td>
                      <td>
                        <button className={styles.generateButton} onClick={async () => {
                          try {
                            const report = await api.generatePerformanceReport(user.id)
                            console.log("Performance Report:", report)
                            setSuccess("Report generated successfully!")
                          } catch (error) {
                            console.error("Error generating report:", error)
                            setError(error.message || "Failed to generate report")
                          }
                        }}>Generate Report</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          <div className={styles.chartContainer}>
  <h3>Performance Trends</h3>
  <Line
    data={{
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Average Employee Score",
          data: [85, 87, 90, 88, 92, 91],
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          fill: true,
        },
      ],
    }}
    options={{
      responsive: true,
      scales: {
        y: { beginAtZero: true, max: 100 },
      },
    }}
  />
</div>

          </div>
        )
      case "myEvaluations":
        return <PerformanceForm onSubmit={async data => {
          try {
            await api.submitEvaluation({ ...data, employeeId: selectedEmployee?.id || user.id })
            setSuccess("Evaluation submitted successfully!")
            const userEvaluations = await api.getUserEvaluations(user.id)
            setRecentEvaluations(userEvaluations.slice(0, 3))
          } catch (error) {
            console.error("Error submitting evaluation:", error)
            setError(error.message || "Failed to submit evaluation")
          }
        }} employee={selectedEmployee} />
      case "myHistory":
        return <PerformanceHistory evaluations={recentEvaluations} />
      case "myProfile":
        if (isEditingProfile) {
          return (
            <div className={styles.profileContent}>
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <h2>Edit Profile</h2>
                </div>
                <form onSubmit={handleProfileUpdate} className={styles.profileForm}>
                  <div className={styles.formField}>
                    <label>Full Name</label>
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))} required />
                  </div>
                  <div className={styles.formField}>
                    <label>Profile Image</label>
                    <input type="file" accept="image/*" onChange={e => setProfileForm(prev => ({ ...prev, avatar: e.target.files[0] }))} />
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton}>Save Changes</button>
                    <button type="button" className={styles.cancelButton} onClick={() => setIsEditingProfile(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
        return (
          <div className={styles.profileContent}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <img src={user.avatar} alt="Profile" className={styles.profileAvatar} />
                <div className={styles.profileInfo}>
                  <h2>{user.name}</h2>
                  <p>{user.role}</p>
                  <p>{user.department}</p>
                  <p>Employee ID: {user.employeeId}</p>
                </div>
              </div>
              {error && <div className={styles.errorMessage}>{error}</div>}
              {success && <div className={styles.successMessage}>{success}</div>}
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
                <button className={styles.editButton} onClick={handleEditProfile}>Edit Profile</button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={homeStyles.homeContainer}>
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
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M20 12L13 5M20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        <nav className={homeStyles.sidebarNav}>
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <div className={homeStyles.navItemContainer}>
                  <button type="button" className={`${homeStyles.navLink} ${activeTab === item.id ? homeStyles.active : ""}`} onClick={() => setActiveTab(item.id)} style={{ background: "transparent", border: "none", width: "100%", textAlign: "left" }}>
                    <div className={homeStyles.navIcon}><Icon name={item.icon} /></div>
                    {isSidebarOpen && <span>{item.label}</span>}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        {isSidebarOpen && (
          <div className={homeStyles.sidebarFooter}>
            <div className={homeStyles.userInfo}>
              <img src={admin.avatar} alt="User Avatar" className={homeStyles.userAvatar} />
              <div>
                <h4>{admin.name.split(" ")[0]}</h4>
                <p>{admin.role}</p>
              </div>
              <button onClick={handleLogout} className={homeStyles.logoutButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </aside>
      <div className={`${homeStyles.mainWrapper} ${!isSidebarOpen ? homeStyles.mainWrapperFull : ""}`}>
        <header className={homeStyles.header}>
          <div className={homeStyles.headerContent}>
            <div className={homeStyles.headerLeft}>
              {isMobile && (
                <button className={homeStyles.mobileMenuButton} onClick={toggleSidebar}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                <img src={admin.avatar} alt="User Avatar" className={homeStyles.userAvatar} />
                <div className={homeStyles.statusIndicator}></div>
              </div>
            </div>
          </div>
        </header>
        <main className={`${homeStyles.mainContent} ${styles.mainContent}`}>{renderTabContent()}</main>
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
