import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import SelfAssessment from "./components/employee/SelfAssessment/SelfAssessment";
import PeerEvaluation from "./components/employee/PeerEvaluation/PeerEvaluation";
import Reports from "./components/employee/Reports/Reports";
import Profile from "./components/employee/Profile/Profile";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          
          {/* Main Application Routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="team_leader"><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          
          {/* Employee Feature Routes */}
          <Route path="/self-assessment" element={<ProtectedRoute requiredRole="team_member"><SelfAssessment /></ProtectedRoute>} />
          <Route path="/peer-evaluation" element={<ProtectedRoute requiredRole="team_member"><PeerEvaluation /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;