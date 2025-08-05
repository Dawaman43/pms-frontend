"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import PerformanceForm from "../components/PerformanceForm"
import PerformanceHistory from "../components/PerformanceHistory"
import styles from "./DashboardPage.module.css"

const EmployeeRegistration = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    level: "",
    email: "",
    department: "",
  });

  const [password, setPassword] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const departments = [
    "Information Communication Technology",
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Human Resources",
    "Finance",
    "Administration",
    "Academic Affairs"
  ];

  const jobLevels = [
    "I - Entry Level",
    "II - Intermediate",
    "III - Professional",
    "IV - Senior Professional",
    "V - Lead",
    "VI - Manager",
    "VII - Director"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
    let newPassword = "";
    for (let i = 0; i < 10; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    setIsGenerated(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isGenerated) {
      setError("Please generate a password first");
      return;
    }
    if (!formData.name || !formData.email || !formData.jobTitle || !formData.department) {
      setError("Please fill all required fields");
      return;
    }

    setError("");
    onRegister({ ...formData, password });
    setSuccess("Employee registered successfully!");
    
    // Reset form
    setFormData({
      name: "",
      jobTitle: "",
      level: "",
      email: "",
      department: "",
    });
    setPassword("");
    setIsGenerated(false);
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(""), 5000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.registrationHeader}>
        <h3>Register New Employee</h3>
        <p className={styles.registrationSubtitle}>Fill in the details below to create a new employee account</p>
      </div>
      
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      
      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="Enter employee's full name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Job Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={styles.formSelect}
            >
              <option value="">Select job level</option>
              {jobLevels.map((level, index) => (
                <option key={index} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={styles.formSelect}
              required
            >
              <option value="">Select department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.formInput}
              placeholder="employee@astu.edu.et"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Temporary Password</label>
            <div className={styles.passwordContainer}>
              <input
                type="text"
                value={password}
                readOnly
                className={styles.passwordInput}
                placeholder="Click generate to create password"
              />
              <div className={styles.passwordActions}>
                <button
                  type="button"
                  onClick={generatePassword}
                  className={styles.generateButton}
                >
                  Generate
                </button>
                {password && (
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className={styles.copyButton}
                    title="Copy to clipboard"
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>
            <div className={styles.passwordStrength}>
              {password && (
                <>
                  <span className={password.length >= 10 ? styles.strong : styles.weak}>
                    Password strength: {password.length >= 10 ? "Strong" : "Weak"}
                  </span>
                  <span className={styles.passwordHint}>
                    The password will be shown only once
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton}>
            Register Employee
          </button>
        </div>
      </form>
    </div>
  );
};

// Rest of your DashboardPage component remains the same...
const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [showFormBuilder, setShowFormBuilder] = useState(false)
  const [editingForm, setEditingForm] = useState(null)
  const [employees, setEmployees] = useState([])

  // Admin data
  const [admin] = useState({
    name: "Dr. Bekele Tadesse",
    role: "System Administrator",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=80&width=80&text=Admin",
  })

  // User data (kept for reference but not displayed in UI)
  const [user] = useState({
    name: "Samuel Hailu Demse",
    role: "Software Programmer IV",
    department: "Information Communication Technology",
    employeeId: "ASTU-ICT-001",
    avatar: "/placeholder.svg?height=80&width=80&text=User",
  })

  // Admin stats
  const [systemStats] = useState({
    totalUsers: 245,
    activeEvaluations: 18,
    completedEvaluations: 127,
    pendingApprovals: 12,
    totalDepartments: 8,
    evaluationForms: 5,
  })

  // User stats (now integrated into admin dashboard)
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
      title: "Academic Staff Performance Evaluation",
      description: "Comprehensive evaluation form for teaching staff",
      targetRole: "teacher",
      status: "active",
      createdDate: "2024-01-15",
      lastModified: "2024-03-10",
      usageCount: 45,
      sections: [
        {
          id: 1,
          name: "Teaching Performance",
          weight: 40,
          criteria: [
            { id: 1, name: "Lesson Planning and Preparation", weight: 25 },
            { id: 2, name: "Student Engagement and Interaction", weight: 35 },
            { id: 3, name: "Assessment and Feedback Methods", weight: 40 },
          ],
        },
        {
          id: 2,
          name: "Research Activities",
          weight: 30,
          criteria: [
            { id: 1, name: "Publications and Papers", weight: 50 },
            { id: 2, name: "Research Projects and Grants", weight: 50 },
          ],
        },
        {
          id: 3,
          name: "Service Activities",
          weight: 20,
          criteria: [
            { id: 1, name: "Committee Participation", weight: 60 },
            { id: 2, name: "Community Service", weight: 40 },
          ],
        },
        {
          id: 4,
          name: "Professional Development",
          weight: 10,
          criteria: [{ id: 1, name: "Training and Workshops Attendance", weight: 100 }],
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
    targetRole: "",
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

  // Admin users
  const [users] = useState([
    {
      id: 1,
      name: "Samuel Hailu Demse",
      role: "teacher",
      department: "Information Communication Technology",
      status: "active",
      lastEvaluation: "2024-03-15",
      evaluationScore: 85.5,
    },
    {
      id: 2,
      name: "Banchirga Nurye",
      role: "academic_worker",
      department: "Computer Science & Engineering",
      status: "active",
      lastEvaluation: "2024-03-10",
      evaluationScore: 78.2,
    },
    {
      id: 3,
      name: "Daniel Asfaw",
      role: "admin",
      department: "Information Communication Technology",
      status: "active",
      lastEvaluation: "2024-02-28",
      evaluationScore: 92.1,
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

  // Form builder functions
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
        alert("Criteria weights must total 100%")
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
      const totalWeight = formBuilder.sections.reduce((sum, s) => sum + s.weight, 0)
      if (totalWeight === 100) {
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
      } else {
        alert("Section weights must total 100%")
      }
    }
  }

  const resetFormBuilder = () => {
    setFormBuilder({
      title: "",
      description: "",
      targetRole: "",
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
      targetRole: form.targetRole,
      sections: form.sections,
      ratingScale: form.ratingScale,
    })
    setShowFormBuilder(true)
  }

  // Admin form handlers
  const handleCreateForm = () => {
    setShowFormBuilder(true)
  }

  const handleEditForm = (formId) => {
    const form = evaluationForms.find((f) => f.id === formId)
    if (form) {
      editForm(form)
    }
  }

  const handleDeleteForm = (formId) => {
    setEvaluationForms((forms) => forms.filter((form) => form.id !== formId))
  }

  const handleToggleFormStatus = (formId) => {
    setEvaluationForms((forms) =>
      forms.map((form) =>
        form.id === formId ? { ...form, status: form.status === "active" ? "inactive" : "active" } : form,
      ),
    )
  }

  // Employee registration handler
  const handleRegisterEmployee = (employee) => {
    setEmployees([...employees, employee]);
    // Here you would typically make an API call to save the employee to your database
    console.log("New employee registered:", employee);
  };

  // Menu data structure for integrated dashboard - REORDERED as requested
  const menuItems = [
    { id: "overview", label: "📊 Overview", icon: "dashboard" },
    { id: "myEvaluations", label: "📝 New Evaluation", icon: "form" },
    { id: "forms", label: "📝 Forms Management", icon: "form" },
    { id: "users", label: "👥 User Management", icon: "users" },
    { id: "myHistory", label: "📋 My History", icon: "history" },
    { id: "reports", label: "📈 Reports", icon: "chart" },
    { id: "myProfile", label: "👤 My Profile", icon: "user" },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className={styles.overviewContent}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statContent}>
                  <h3>Total Users</h3>
                  <p>{systemStats.totalUsers}</p>
                  <span className={styles.statTrend}>+12 this month</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📝</div>
                <div className={styles.statContent}>
                  <h3>Active Evaluations</h3>
                  <p>{systemStats.activeEvaluations}</p>
                  <span className={styles.statTrend}>In progress</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statContent}>
                  <h3>Completed</h3>
                  <p>{systemStats.completedEvaluations}</p>
                  <span className={styles.statTrend}>This quarter</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statContent}>
                  <h3>Pending Approvals</h3>
                  <p>{systemStats.pendingApprovals}</p>
                  <span className={styles.statTrend}>Needs attention</span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className={styles.activitiesSection}>
              <h3 className={styles.sectionTitle}>Recent System Activities</h3>
              <div className={styles.activitiesList}>
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityStatus} ${styles[activity.status]}`}></div>
                    <div className={styles.activityContent}>
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <span className={styles.activityTime}>
                        {activity.user} • {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
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
                  <h2>{editingForm ? "Edit Form" : "Create New Form"}</h2>
                  <div className={styles.formBuilderActions}>
                    <button className={styles.saveFormButton} onClick={saveForm}>
                      💾 Save Form
                    </button>
                    <button
                      className={styles.cancelFormButton}
                      onClick={() => {
                        setShowFormBuilder(false)
                        setEditingForm(null)
                        resetFormBuilder()
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
                <div className={styles.formBuilderContent}>
                  {/* Form Details Section */}
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
                        <label>Target Role</label>
                        <select
                          value={formBuilder.targetRole}
                          onChange={(e) => setFormBuilder((prev) => ({ ...prev, targetRole: e.target.value }))}
                          className={styles.formSelect}
                        >
                          <option value="">Select target role</option>
                          <option value="teacher">Teacher</option>
                          <option value="academic_worker">Academic Worker</option>
                          <option value="admin">Administrator</option>
                        </select>
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
                            setCurrentSection((prev) => ({ ...prev, weight: parseInt(e.target.value) || 0 }))
                          }
                          placeholder="Enter weight percentage"
                          className={styles.formInput}
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
                              setCurrentCriterion((prev) => ({ ...prev, weight: parseInt(e.target.value) || 0 }))
                            }
                            placeholder="Enter weight percentage"
                            className={styles.formInput}
                          />
                        </div>
                        <button onClick={addCriterionToSection} className={styles.addCriterionButton}>
                          ➕ Add Criterion
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
                                  🗑️
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
                        ➕ Add Section to Form
                      </button>
                    </div>
                  </div>

                  {/* Form Preview */}
                  {formBuilder.sections.length > 0 && (
                    <div className={styles.formBuilderSection}>
                      <h3>
                        Form Preview - Total Weight:{" "}
                        {formBuilder.sections.reduce((sum, s) => sum + s.weight, 0)}%
                      </h3>
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
                                  🗑️
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
                  <button className={styles.createButton} onClick={handleCreateForm}>
                    ➕ Create New Form
                  </button>
                </div>
                <div className={styles.formsGrid}>
                  {evaluationForms.map((form) => (
                    <div key={form.id} className={styles.formCard}>
                      <div className={styles.formHeader}>
                        <h3>{form.title}</h3>
                        <div className={styles.formActions}>
                          <span className={`${styles.statusBadge} ${styles[form.status]}`}>{form.status}</span>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEditForm(form.id)}
                            >
                              ✏️
                            </button>
                            <button
                              className={styles.toggleButton}
                              onClick={() => handleToggleFormStatus(form.id)}
                            >
                              {form.status === "active" ? "⏸️" : "▶️"}
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDeleteForm(form.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className={styles.formDescription}>{form.description}</p>
                      <div className={styles.formDetails}>
                        <div className={styles.formMeta}>
                          <span>
                            Target Role: <strong>{form.targetRole}</strong>
                          </span>
                          <span>
                            Usage: <strong>{form.usageCount} times</strong>
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

      case "users":
        return (
          <div className={styles.usersContent}>
            <div className={styles.usersHeader}>
              <h2>User Management</h2>
              <div className={styles.userFilters}>
                <select className={styles.filterSelect}>
                  <option value="all">All Roles</option>
                  <option value="teacher">Teachers</option>
                  <option value="academic_worker">Academic Workers</option>
                  <option value="admin">Administrators</option>
                </select>
                <select className={styles.filterSelect}>
                  <option value="all">All Departments</option>
                  <option value="ict">ICT</option>
                  <option value="cse">Computer Science</option>
                  <option value="hr">Human Resources</option>
                </select>
              </div>
            </div>
            
            {/* Employee Registration Form */}
            <EmployeeRegistration onRegister={handleRegisterEmployee} />
            
            <div className={styles.usersTable}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Last Evaluation</th>
                    <th>Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className={styles.userName}>{user.name}</td>
                      <td>
                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>{user.role}</span>
                      </td>
                      <td>{user.department}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[user.status]}`}>{user.status}</span>
                      </td>
                      <td>{new Date(user.lastEvaluation).toLocaleDateString()}</td>
                      <td className={styles.scoreCell}>{user.evaluationScore}%</td>
                      <td>
                        <div className={styles.userActions}>
                          <button className={styles.viewButton}>👁️</button>
                          <button className={styles.editButton}>✏️</button>
                          <button className={styles.evaluateButton}>📝</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      case "reports":
        return (
          <div className={styles.reportsContent}>
            <h2>System Reports & Analytics</h2>
            <div className={styles.reportsGrid}>
              <div className={styles.reportCard}>
                <h3>📊 Performance Analytics</h3>
                <p>Comprehensive performance analysis across all departments</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>📈 Evaluation Trends</h3>
                <p>Track evaluation completion rates and score trends</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>👥 User Activity</h3>
                <p>Monitor user engagement and system usage statistics</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
              <div className={styles.reportCard}>
                <h3>🎯 Goal Achievement</h3>
                <p>Track goal completion and performance improvement</p>
                <button className={styles.generateButton}>Generate Report</button>
              </div>
            </div>
          </div>
        )

      // User dashboard tabs integrated into admin dashboard
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

      // Adding a new My Performance tab
      case "myPerformance":
        return (
          <div className={styles.overviewContent}>
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statContent}>
                  <h3>Average Score</h3>
                  <p>{dashboardStats.averageScore}%</p>
                  <span className={styles.statTrend}>+2.3% from last quarter</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statContent}>
                  <h3>Completed</h3>
                  <p>{dashboardStats.completedEvaluations}</p>
                  <span className={styles.statTrend}>This year</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>⏳</div>
                <div className={styles.statContent}>
                  <h3>Pending</h3>
                  <p>{dashboardStats.pendingEvaluations}</p>
                  <span className={styles.statTrend}>Due soon</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🎯</div>
                <div className={styles.statContent}>
                  <h3>Current Quarter</h3>
                  <p>{dashboardStats.currentQuarterScore}%</p>
                  <span className={styles.statTrend}>Q2 2024</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
              {/* Recent Evaluations */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Recent Evaluations</h3>
                  <Link to="/evaluations" className={styles.viewAllLink}>
                    View All
                  </Link>
                </div>
                <div className={styles.evaluationsList}>
                  {recentEvaluations.map((evaluation) => (
                    <div key={evaluation.id} className={styles.evaluationItem}>
                      <div className={styles.evaluationInfo}>
                        <h4>{evaluation.type}</h4>
                        <p>Evaluator: {evaluation.evaluator}</p>
                        <span className={styles.evaluationDate}>{evaluation.date}</span>
                      </div>
                      <div className={styles.evaluationScore}>
                        {evaluation.status === "Completed" ? (
                          <span className={styles.scoreValue}>{evaluation.score}%</span>
                        ) : (
                          <span className={styles.pendingStatus}>Pending</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Upcoming Tasks</h3>
                  <span className={styles.taskCount}>{upcomingTasks.length} tasks</span>
                </div>
                <div className={styles.tasksList}>
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className={styles.taskItem}>
                      <div className={styles.taskInfo}>
                        <h4>{task.title}</h4>
                        <p>{task.type}</p>
                        <span className={styles.taskDue}>Due: {task.dueDate}</span>
                      </div>
                      <div className={styles.taskPriority}>
                        <span className={`${styles.priorityBadge} ${styles[task.priority.toLowerCase()]}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className={styles.chartCard}>
              <h3>Performance Trend</h3>
              <div className={styles.chartPlaceholder}>
                <div className={styles.chartBars}>
                  <div className={styles.chartBar} style={{ height: "60%" }}>
                    <span>Q1</span>
                  </div>
                  <div className={styles.chartBar} style={{ height: "75%" }}>
                    <span>Q2</span>
                  </div>
                  <div className={styles.chartBar} style={{ height: "85%" }}>
                    <span>Q3</span>
                  </div>
                  <div className={styles.chartBar} style={{ height: "90%" }}>
                    <span>Q4</span>
                  </div>
                </div>
                <p className={styles.chartDescription}>Your performance scores over the last 4 quarters</p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <img src="/astu_logo.svg?height=50&width=50&text=ASTU" alt="ASTU Logo" className={styles.logo} />
            <div className={styles.systemTitle}>
              <h1>Performance Management System</h1>
              <p>Adama Science & Technology University</p>
            </div>
          </div>
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{admin.name}</span>
              <span className={styles.userRole}>{admin.role}</span>
            </div>
            <img src={admin.avatar || "/placeholder.svg"} alt="User Avatar" className={styles.userAvatar} />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={styles.navigation}>
        <div className={styles.navTabs}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navTab} ${activeTab === item.id ? styles.active : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>{renderTabContent()}</main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 Adama Science & Technology University. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link to="/help">Help</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default DashboardPage