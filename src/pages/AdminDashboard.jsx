"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import MainContent from "../components/admin/MainContent";
import Footer from "../components/admin/Footer";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newTeam, setNewTeam] = useState({ name: "", leader: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admin, setAdmin] = useState({
    name: "Dr. Bekele Tadesse",
    role: "System Administrator",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=80&width=80&text=Admin",
  });
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    department: "",
    profileImage: null,
  });
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({
    title: "",
    description: "",
    formType: "",
    targetEvaluator: "",
    weight: "",
    sections: [{ name: "", criteria: [{ id: 1, name: "", weight: "" }] }],
  });
  const [systemStats, setSystemStats] = useState({
    totalEmployees: 0,
    activeTeams: 0,
    pendingRegistrations: 0,
    evaluationsThisMonth: 0,
  });
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    jobTitle: "",
    level: "",
    email: "",
    department: "",
    team: "",
    phone: "",
    address: "",
    emergencyContact: "",
    salary: "",
    profileImage: null,
  });
  const [password, setPassword] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isViewingEmployee, setIsViewingEmployee] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentActivities, setRecentActivities] = useState([]);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const jobLevels = [
    "I - Entry Level",
    "II - Intermediate",
    "III - Professional",
    "IV - Senior Professional",
    "V - Lead",
    "VI - Manager",
    "VII - Director",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setError(""); // Clear previous errors
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData.id;
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setError("No user ID or token found. Please log in again.");
          navigate("/login");
          return;
        }

        // Fetch admin user data
        try {
          const adminResponse = await api.getUserById(userId);
          setAdmin({
            name: adminResponse.name || "Unknown Admin",
            role: "System Administrator",
            department: adminResponse.department || "N/A",
            avatar:
              adminResponse.profileImage ||
              "/placeholder.svg?height=80&width=80&text=Admin",
          });
          setAdminForm({
            name: adminResponse.name || "",
            email: adminResponse.email || "",
            department: adminResponse.department || "",
            profileImage: null,
          });
        } catch (adminError) {
          console.warn("Failed to fetch admin data:", adminError.message);
          setAdmin({
            name: "Unknown Admin",
            role: "System Administrator",
            department: "N/A",
            avatar: "/placeholder.svg?height=80&width=80&text=Admin",
          });
        }

        // Fetch all users
        const users = await api.getAllUsers();
        const mappedEmployees = users.map((user) => ({
          id: user.id,
          name: user.name,
          jobTitle: user.jobTitle || "N/A",
          level: user.level || "N/A",
          email: user.email,
          department: user.department || "N/A",
          team: user.teamName || "N/A",
          status: user.status,
          dateRegistered: user.dateRegistered,
          phone: user.phone || "N/A",
          address: user.address || "N/A",
          emergencyContact: user.emergencyContact || "N/A",
          salary: user.salary || "N/A",
          profileImage: user.profileImage || null,
        }));
        setEmployees(mappedEmployees);

        // Fetch all teams
        const teamsResponse = await api.getAllTeams();
        const mappedTeams = teamsResponse.map((team) => ({
          id: team.id,
          name: team.name,
          leader: team.leader,
          members: team.members ? team.members.length : 0,
          dateCreated: team.dateCreated,
        }));
        setTeams(mappedTeams);

        // Fetch all departments
        const departmentsResponse = await api.getAllDepartments();
        setDepartments(departmentsResponse); // Store full objects: [{ id, name }, ...]

        // Fetch evaluations for the current month
        const evaluations = await api.getEvaluatesByUser(userId);
        const currentMonth = new Date().toISOString().slice(0, 7);
        const evaluationsThisMonth = evaluations.filter((e) =>
          e.submissionDate?.startsWith(currentMonth)
        ).length;

        // Calculate system stats
        setSystemStats({
          totalEmployees: users.length,
          activeTeams: teamsResponse.length,
          pendingRegistrations: users.filter((u) => u.status === "pending")
            .length,
          evaluationsThisMonth,
        });

        // Populate recent activities
        const activities = users
          .filter((user) => user.dateRegistered)
          .map((user) => ({
            description: `New employee ${user.name} registered`,
            time: new Date(user.dateRegistered).toLocaleString(),
          }))
          .slice(0, 5);
        setRecentActivities(activities);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, [navigate]);

  const generatePassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setPassword(password);
    setIsGenerated(true);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeForm((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleEmployeeRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(employeeForm.email)) {
      setError("Please enter a valid email address");
      return;
    }

    const dataToSubmit = { ...employeeForm, password };
    if (employeeForm.role === "team_leader") {
      delete dataToSubmit.jobTitle;
      delete dataToSubmit.level;
      delete dataToSubmit.team;
    }

    try {
      await api.createEmployee(dataToSubmit);
      setSuccess("Employee registered successfully!");
      setEmployeeForm({
        name: "",
        jobTitle: "",
        level: "",
        email: "",
        department: "",
        team: "",
        role: "",
        phone: "",
        salary: "",
        address: "",
        emergencyContact: "",
        profileImage: null,
      });
      setPassword("");
      setIsGenerated(false);

      const users = await api.getAllUsers();
      setEmployees(
        users.map((user) => ({
          id: user.id,
          name: user.name,
          jobTitle: user.jobTitle || "N/A",
          level: user.level || "N/A",
          email: user.email,
          department: user.department || "N/A",
          team: user.teamName || "N/A",
          status: user.status,
          dateRegistered: user.dateRegistered,
          phone: user.phone || "N/A",
          address: user.address || "N/A",
          emergencyContact: user.emergencyContact || "N/A",
          salary: user.salary || "N/A",
          profileImage: user.profileImage || null,
        }))
      );
    } catch (error) {
      console.error("Error registering employee:", error);
      setError(error.message || "Failed to register employee");
    }
  };

  const handleTeamCreation = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { memberIds, ...teamCoreData } = newTeam;
      const teamResult = await api.createTeam(teamCoreData);
      setSuccess("Team created successfully!");
      setNewTeam({ name: "", department: "", leader_id: "", memberIds: [] });

      const teamsResponse = await api.getAllTeams();
      setTeams(
        teamsResponse.map((team) => ({
          id: team.id,
          name: team.name,
          leader: team.leader,
          members: team.members ? team.members.length : 0,
          dateCreated: team.dateCreated,
        }))
      );
    } catch (error) {
      console.error("Error creating team:", error);
      setError(error.message || "Failed to create team");
    }
  };

  const handleTeamEdit = (team) => {
    setNewTeam({
      id: team.id,
      name: team.name,
      department: team.department,
      leader_id: team.leader_id,
      memberIds: team.members ? team.members.map((m) => m.id) : [],
    });
  };

  const handleTeamUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const { memberIds, ...teamCoreData } = newTeam;
      await api.updateTeam(newTeam.id, teamCoreData);
      setSuccess("Team updated successfully!");
      setNewTeam({ name: "", department: "", leader_id: "", memberIds: [] });

      const teamsResponse = await api.getAllTeams();
      setTeams(
        teamsResponse.map((team) => ({
          id: team.id,
          name: team.name,
          leader: team.leader,
          members: team.members ? team.members.length : 0,
          dateCreated: team.dateCreated,
        }))
      );
    } catch (error) {
      console.error("Error updating team:", error);
      setError(error.message || "Failed to update team");
    }
  };

  const handleTeamDelete = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await api.deleteTeam(teamId);
        setSuccess("Team deleted successfully!");
        const teamsResponse = await api.getAllTeams();
        setTeams(
          teamsResponse.map((team) => ({
            id: team.id,
            name: team.name,
            leader: team.leader,
            members: team.members ? team.members.length : 0,
            dateCreated: team.dateCreated,
          }))
        );
      } catch (error) {
        console.error("Error deleting team:", error);
        setError(error.message || "Failed to delete team");
      }
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewingEmployee(true);
    setIsEditingEmployee(false);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      jobTitle: employee.jobTitle,
      level: employee.level,
      email: employee.email,
      department: employee.department,
      team: employee.team,
      role: employee.role || "staff",
      phone: employee.phone,
      address: employee.address,
      emergencyContact: employee.emergencyContact,
      salary: employee.salary,
      profileImage: null,
    });
    setIsEditingEmployee(true);
    setIsViewingEmployee(false);
  };

  const handleUpdateEmployee = async (employeeId) => {
    try {
      await api.updateUser(employeeId, employeeForm);
      const users = await api.getAllUsers();
      setEmployees(
        users.map((user) => ({
          id: user.id,
          name: user.name,
          jobTitle: user.jobTitle || "N/A",
          level: user.level || "N/A",
          email: user.email,
          department: user.department || "N/A",
          team: user.teamName || "N/A",
          status: user.status,
          dateRegistered: user.dateRegistered,
          phone: user.phone || "N/A",
          address: user.address || "N/A",
          emergencyContact: user.emergencyContact || "N/A",
          salary: user.salary || "N/A",
          profileImage: user.profileImage || null,
        }))
      );

      setIsEditingEmployee(false);
      setSelectedEmployee(null);
      setEmployeeForm({
        name: "",
        jobTitle: "",
        level: "",
        email: "",
        department: "",
        team: "",
        role: "",
        phone: "",
        address: "",
        emergencyContact: "",
        salary: "",
        profileImage: null,
      });
      setSuccess("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      setError(error.message || "Failed to update employee");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.deleteEmployee(employeeId);
        const users = await api.getAllUsers();
        setEmployees(
          users.map((user) => ({
            id: user.id,
            name: user.name,
            jobTitle: user.jobTitle || "N/A",
            level: user.level || "N/A",
            email: user.email,
            department: user.department || "N/A",
            team: user.teamName || "N/A",
            status: user.status,
            dateRegistered: user.dateRegistered,
            phone: user.phone || "N/A",
            address: user.address || "N/A",
            emergencyContact: user.emergencyContact || "N/A",
            salary: user.salary || "N/A",
            profileImage: user.profileImage || null,
          }))
        );
        setSuccess("Employee deleted successfully!");
      } catch (error) {
        console.error("Error deleting employee:", error);
        setError(error.message || "Failed to delete employee");
      }
    }
  };

  const handleGenerateReport = async () => {
    try {
      const reports = await api.generatePerformanceReport();
      if (!reports || reports.length === 0) {
        setError("No reports found.");
        return;
      }

      const csvRows = [];
      const headers = Object.keys(reports[0]);
      csvRows.push(headers.join(","));

      for (const report of reports) {
        const row = headers.map((key) => {
          let value = report[key];
          if (typeof value === "object" && value !== null) {
            value = JSON.stringify(value);
          }
          value = String(value).replace(/"/g, '""');
          return `"${value}"`;
        });
        csvRows.push(row.join(","));
      }

      const csv = csvRows.join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `employee_performance_report.csv`;
      link.click();
      URL.revokeObjectURL(url);

      setSuccess("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      setError(error.message || "Failed to generate report");
    }
  };

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAdmin = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.id;
      await api.updateUser(userId, adminForm);
      const adminResponse = await api.getUserById(userId);
      setAdmin({
        name: adminResponse.name || "Unknown Admin",
        role: "System Administrator",
        department: adminResponse.department || "N/A",
        avatar:
          adminResponse.profileImage ||
          "/placeholder.svg?height=80&width=80&text=Admin",
      });
      setSuccess("Admin profile updated successfully!");
      setIsEditingAdmin(false);
    } catch (error) {
      console.error("Error updating admin:", error);
      setError(error.message || "Failed to update admin profile");
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEvaluationForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    setEvaluationForm((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], [name]: value };
      return { ...prev, sections };
    });
  };

  const handleCriterionChange = (sectionIndex, criterionIndex, e) => {
    const { name, value } = e.target;
    setEvaluationForm((prev) => {
      const sections = [...prev.sections];
      const criteria = [...sections[sectionIndex].criteria];
      criteria[criterionIndex] = { ...criteria[criterionIndex], [name]: value };
      sections[sectionIndex] = { ...sections[sectionIndex], criteria };
      return { ...prev, sections };
    });
  };

  const addSection = () => {
    setEvaluationForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { name: "", criteria: [{ id: Date.now(), name: "", weight: "" }] },
      ],
    }));
  };

  const removeSection = (index) => {
    setEvaluationForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const addCriterion = (sectionIndex) => {
    setEvaluationForm((prev) => {
      const sections = [...prev.sections];
      sections[sectionIndex].criteria.push({
        id: Date.now(),
        name: "",
        weight: "",
      });
      return { ...prev, sections };
    });
  };

  const removeCriterion = (sectionIndex, criterionIndex) => {
    setEvaluationForm((prev) => {
      const sections = [...prev.sections];
      sections[sectionIndex].criteria = sections[sectionIndex].criteria.filter(
        (_, i) => i !== criterionIndex
      );
      return { ...prev, sections };
    });
  };

  const handleCreateForm = async () => {
    try {
      await api.createEvaluationForm(evaluationForm);
      setSuccess("Evaluation form created successfully!");
      setEvaluationForm({
        title: "",
        description: "",
        formType: "",
        targetEvaluator: "",
        weight: "",
        sections: [{ name: "", criteria: [{ id: 1, name: "", weight: "" }] }],
      });
    } catch (error) {
      console.error("Error creating evaluation form:", error);
      setError(error.message || "Failed to create evaluation form");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        admin={admin}
      />
      <div
        className={`${styles.mainWrapper} ${
          !isSidebarOpen ? styles.mainWrapperFull : ""
        }`}
      >
        <Header
          admin={admin}
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
        />
        <MainContent
          activeTab={activeTab}
          employees={employees}
          teams={teams}
          newTeam={newTeam}
          setNewTeam={setNewTeam}
          employeeForm={employeeForm}
          setEmployeeForm={setEmployeeForm}
          password={password}
          isGenerated={isGenerated}
          generatePassword={generatePassword}
          handleEmployeeFormChange={handleEmployeeFormChange}
          handleImageUpload={handleImageUpload}
          validateEmail={validateEmail}
          handleEmployeeRegistration={handleEmployeeRegistration}
          handleTeamCreation={handleTeamCreation}
          handleTeamEdit={handleTeamEdit}
          handleTeamUpdate={handleTeamUpdate}
          handleTeamDelete={handleTeamDelete}
          handleViewEmployee={handleViewEmployee}
          handleEditEmployee={handleEditEmployee}
          handleUpdateEmployee={handleUpdateEmployee}
          handleDeleteEmployee={handleDeleteEmployee}
          handleGenerateReport={handleGenerateReport}
          selectedEmployee={selectedEmployee}
          isViewingEmployee={isViewingEmployee}
          setIsViewingEmployee={setIsViewingEmployee}
          isEditingEmployee={isEditingEmployee}
          setIsEditingEmployee={setIsEditingEmployee}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          recentActivities={recentActivities}
          systemStats={systemStats}
          departments={departments}
          setDepartments={setDepartments}
          jobLevels={jobLevels}
          error={error}
          success={success}
          itemsPerPage={itemsPerPage}
          adminForm={adminForm}
          setAdminForm={setAdminForm}
          handleAdminFormChange={handleAdminFormChange}
          handleUpdateAdmin={handleUpdateAdmin}
          isEditingAdmin={isEditingAdmin}
          setIsEditingAdmin={setIsEditingAdmin}
          evaluationForm={evaluationForm}
          setEvaluationForm={setEvaluationForm}
          handleFormChange={handleFormChange}
          handleSectionChange={handleSectionChange}
          handleCriterionChange={handleCriterionChange}
          addSection={addSection}
          removeSection={removeSection}
          addCriterion={addCriterion}
          removeCriterion={removeCriterion}
          handleCreateForm={handleCreateForm}
        />
        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
