import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import TeamLeaderDashboard from "./pages/TeamLeaderDashboard";
import SelfAssessment from "./components/employee/SelfAssessment/SelfAssessment";
import PeerEvaluation from "./components/employee/PeerEvaluation/PeerEvaluation";
import Reports from "./components/employee/Reports/Reports";
import Profile from "./components/employee/Profile/Profile";
import MyTeam from "./components/employee/Team/MyTeam";

import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

// ---------------- Root Redirect Component ----------------
const DefaultRoute = () => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = userData.role;

  if (!token) return <Navigate to="/login" replace />;

  switch (role) {
    case "admin":
      return <Navigate to="/admin-dashboard" replace />;
    case "team_leader":
      return <Navigate to="/team-leader-dashboard" replace />;
    case "staff":
      return <Navigate to="/home" replace />;
    default:
      return <Navigate to="/home" replace />;
  }
};

// ---------------- Login Redirect Component ----------------
const LoginRedirect = () => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const role = userData.role;

  if (token) {
    if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (role === "team_leader")
      return <Navigate to="/team-leader-dashboard" replace />;
    return <Navigate to="/home" replace />;
  }

  return <LoginPage />;
};

// ---------------- App Component ----------------
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Root → role-based redirect */}
          <Route path="/" element={<DefaultRoute />} />

          {/* Login → redirect if already logged in */}
          <Route path="/login" element={<LoginRedirect />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["staff", "team_leader"]}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["staff", "team_leader"]}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-leader-dashboard"
            element={
              <ProtectedRoute allowedRoles={["team_leader"]}>
                <TeamLeaderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Employee routes */}
          <Route
            path="/self-assessment"
            element={
              <ProtectedRoute allowedRoles={["staff", "team_leader"]}>
                <SelfAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/peer-evaluation"
            element={
              <ProtectedRoute allowedRoles={["staff", "team_leader"]}>
                <PeerEvaluation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={["staff", "team_leader"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team"
            element={
              <ProtectedRoute allowedRoles={["staff", "team_leader"]}>
                <MyTeam />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["staff", "team_leader", "admin"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
