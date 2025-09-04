"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Sidebar from "../components/teamLeader/Sidebar";
import Header from "../components/teamLeader/Header";
import MainContent from "../components/teamLeader/MainContent";
import Footer from "../components/teamLeader/Footer";
import ErrorBoundary from "../components/teamLeader/ErrorBoundary";
import styles from "./TeamLeaderDashboard.module.css";

const TeamLeaderDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [teamMembers, setTeamMembers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    evaluationsCompleted: 0,
    averageTeamScore: 0,
  });
  const [leader, setLeader] = useState({
    name: "Team Leader",
    role: "Team Manager",
    department: "",
    avatar: "/placeholder.svg?height=80&width=80&text=Leader",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData.id;
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          setError("No user ID or token found. Please log in again.");
          navigate("/login");
          return;
        }

        // Fetch team leader data
        const leaderResponse = await api.getUserById(userId);
        setLeader({
          name: leaderResponse.name || "Team Leader",
          role: "Team Manager",
          department: leaderResponse.department || "N/A",
          avatar:
            leaderResponse.profileImage ||
            "/placeholder.svg?height=80&width=80&text=Leader",
        });

        // Fetch teams
        const teamsResponse = await api.getAllTeams();
        setTeams(Array.isArray(teamsResponse) ? teamsResponse : []);

        // Fetch departments
        const departmentsResponse = await api.getAllDepartments();
        setDepartments(
          Array.isArray(departmentsResponse) ? departmentsResponse : []
        );

        // Fetch full team members (leader + peers)
        const teamResponse = await api.getMyFullTeam();
        const members = Array.isArray(teamResponse.members)
          ? teamResponse.members
          : [];
        setTeamMembers(members);

        // Fetch evaluations (by teamId from response)
        const teamId = teamResponse.id || teamResponse.teamId;
        const teamEvaluations = await api.getTeamPeerEvaluationForms(teamId);
        const evaluations = Array.isArray(teamEvaluations)
          ? teamEvaluations
          : [];
        const completedEvaluations = evaluations.filter(
          (e) => e.status === "completed"
        );
        const averageScore =
          completedEvaluations.length > 0
            ? completedEvaluations.reduce((sum, e) => sum + (e.score || 0), 0) /
              completedEvaluations.length
            : 0;

        setEvaluations(evaluations);
        setTeamStats({
          totalMembers: teamResponse.membersCount || members.length,
          evaluationsCompleted: completedEvaluations.length,
          averageTeamScore: parseFloat(averageScore.toFixed(1)),
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data. Please try again.");
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    fetchData();

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={styles.teamLeaderContainer}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leader={leader}
      />
      <div
        className={`${styles.mainWrapper} ${
          !isSidebarOpen ? styles.mainWrapperFull : ""
        }`}
      >
        <Header
          leader={leader}
          isMobile={isMobile}
          toggleSidebar={toggleSidebar}
        />
        <ErrorBoundary>
          <MainContent
            activeTab={activeTab}
            teamMembers={teamMembers}
            teams={teams}
            evaluations={evaluations}
            teamStats={teamStats}
            departments={departments}
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            itemsPerPage={itemsPerPage}
            navigate={navigate}
          />
        </ErrorBoundary>
        <Footer />
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
