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

  const departments = [
    "Information Communication Technology",
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Human Resources",
    "Finance",
    "Administration",
    "Academic Affairs",
  ];

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
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData.id;

        if (userId) {
          // Fetch admin user data
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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data");
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    fetchData();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(password);
    setIsGenerated(true);
  };

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEvaluationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSectionChange = (sectionIndex, value) => {
    setEvaluationForm((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].name = value;
      return { ...prev, sections: newSections };
    });
  };

  const handleCriterionChange = (
    sectionIndex,
    criterionIndex,
    field,
    value
  ) => {
    setEvaluationForm((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].criteria[criterionIndex][field] = value;
      return { ...prev, sections: newSections };
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

  const removeSection = (sectionIndex) => {
    setEvaluationForm((prev) => {
      const newSections = prev.sections.filter((_, i) => i !== sectionIndex);
      return { ...prev, sections: newSections };
    });
  };

  const addCriterion = (sectionIndex) => {
    setEvaluationForm((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].criteria.push({
        id: Date.now(),
        name: "",
        weight: "",
      });
      return { ...prev, sections: newSections };
    });
  };

  const removeCriterion = (sectionIndex, criterionIndex) => {
    setEvaluationForm((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].criteria = newSections[
        sectionIndex
      ].criteria.filter((_, i) => i !== criterionIndex);
      return { ...prev, sections: newSections };
    });
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !evaluationForm.title ||
      !evaluationForm.formType ||
      !evaluationForm.targetEvaluator ||
      !evaluationForm.weight ||
      evaluationForm.sections.some(
        (section) =>
          !section.name ||
          section.criteria.some(
            (criterion) => !criterion.name || !criterion.weight
          )
      )
    ) {
      setError(
        "All fields are required, including section and criteria details"
      );
      return;
    }

    if (evaluationForm.weight < 1 || evaluationForm.weight > 100) {
      setError("Form weight must be between 1 and 100");
      return;
    }

    try {
      const formData = {
        title: evaluationForm.title,
        description: evaluationForm.description,
        formType: evaluationForm.formType,
        targetEvaluator: evaluationForm.targetEvaluator,
        weight: parseInt(evaluationForm.weight),
        sections: evaluationForm.sections,
      };
      await api.createEvaluationForm(formData);
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEmployeeForm((prev) => ({
        ...prev,
        profileImage: file,
      }));
      setAdminForm((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmployeeRegistration = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !employeeForm.name ||
      !employeeForm.jobTitle ||
      !employeeForm.level ||
      !employeeForm.email ||
      !employeeForm.department ||
      !employeeForm.team ||
      !employeeForm.phone ||
      !employeeForm.address ||
      !employeeForm.emergencyContact ||
      !employeeForm.salary
    ) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(employeeForm.email)) {
      setError("Invalid email format");
      return;
    }

    if (!password) {
      setError("Please generate a password");
      return;
    }

    try {
      const employeeData = {
        ...employeeForm,
        password,
        status: "active",
        dateRegistered: new Date().toISOString().split("T")[0],
      };

      const newEmployee = await api.createEmployee(employeeData);
      if (employeeForm.profileImage) {
        await api.uploadProfilePicture(
          newEmployee.id,
          employeeForm.profileImage
        );
      }

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

      setSuccess("Employee registered successfully!");
      setEmployeeForm({
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
      setPassword("");
      setIsGenerated(false);
    } catch (error) {
      console.error("Error registering employee:", error);
      setError(error.message || "Failed to register employee");
    }
  };

  const handleUpdateAdmin = async (updatedAdminForm) => {
    setError("");
    setSuccess("");

    // Only validate name and email for admin
    if (!updatedAdminForm.name || !updatedAdminForm.email) {
      setError("Name and email are required");
      return;
    }

    if (!validateEmail(updatedAdminForm.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.id;

      // Ensure department is null for admin
      updatedAdminForm.department = null;

      // Update user profile
      await api.updateUser(userId, {
        name: updatedAdminForm.name,
        email: updatedAdminForm.email,
        department: updatedAdminForm.department,
      });

      // Upload profile image if exists
      if (updatedAdminForm.profileImage) {
        await api.uploadProfilePicture(userId, updatedAdminForm.profileImage);
      }

      const refreshedAdmin = await api.getUserById(userId);
      setAdmin({
        name: refreshedAdmin.name || "Unknown Admin",
        role: "System Administrator",
        department: null,
        avatar:
          refreshedAdmin.profileImage ||
          "/placeholder.svg?height=80&width=80&text=Admin",
      });

      setAdminForm({
        name: refreshedAdmin.name || "",
        email: refreshedAdmin.email || "",
        department: null,
        profileImage: null,
      });

      localStorage.setItem(
        "userData",
        JSON.stringify({
          id: userId,
          email: refreshedAdmin.email,
          role: refreshedAdmin.role,
          name: refreshedAdmin.name,
        })
      );

      setSuccess("Profile updated successfully!");
      setIsEditingAdmin(false);
    } catch (error) {
      console.error("Error updating admin profile:", error);
      setError(error.message || "Failed to update profile");
    }
  };

  const handleTeamCreation = async (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.leader) {
      setError("Team name and leader are required");
      return;
    }

    try {
      const teamData = {
        ...newTeam,
        dateCreated: new Date().toISOString().split("T")[0],
      };
      await api.createTeam(teamData);
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
      setNewTeam({ name: "", leader: "" });
      setSuccess("Team created successfully!");
      setActiveTab("teams");
    } catch (error) {
      console.error("Error creating team:", error);
      setError(error.message || "Failed to create team");
    }
  };

  const handleTeamEdit = (team) => {
    setNewTeam({ name: team.name, leader: team.leader, id: team.id });
  };

  const handleTeamUpdate = async (e) => {
    e.preventDefault();
    if (!newTeam.name || !newTeam.leader) {
      setError("Team name and leader are required");
      return;
    }

    try {
      await api.updateTeam(newTeam.id, newTeam);
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
      setNewTeam({ name: "", leader: "" });
      setSuccess("Team updated successfully!");
    } catch (error) {
      console.error("Error updating team:", error);
      setError(error.message || "Failed to update team");
    }
  };

  const handleTeamDelete = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await api.deleteTeam(teamId);
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
        setSuccess("Team deleted successfully!");
      } catch (error) {
        console.error("Error deleting team:", error);
        setError(error.message || "Failed to delete team");
      }
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsViewingEmployee(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeForm(employee);
    setIsEditingEmployee(true);
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = await api.updateEmployee(
        selectedEmployee.id,
        employeeForm
      );
      if (employeeForm.profileImage) {
        await api.uploadProfilePicture(
          selectedEmployee.id,
          employeeForm.profileImage
        );
      }

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
        alert("No reports found.");
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

      alert("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      alert(error.message || "Failed to generate report");
    }
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
