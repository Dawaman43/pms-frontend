const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://pms-api.astu.edu.et/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    // Auto-logout if 401 Unauthorized
    if (response.status === 401) {
      console.warn("Token expired or invalid. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");

      // Redirect to login
      window.location.href = "/login";

      return; // stop further processing
    }

    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`
    );
  }

  return response.json();
};

const api = {
  // ================== AUTH ==================
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);

    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        name: data.user.name,
      })
    );
    return data;
  },

  // ================== USERS ==================
  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  updateUserPassword: async (userId, oldPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return handleResponse(response);
  },

  uploadProfilePicture: async (userId, file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    const response = await fetch(
      `${API_BASE_URL}/users/${userId}/profile-picture`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      }
    );
    return handleResponse(response);
  },

  // ================== TEAMS ==================
  getTeamMembers: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/teams/members/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getAllTeams: async () => {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createTeam: async (teamData) => {
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(teamData),
    });
    return handleResponse(response);
  },

  updateTeam: async (teamId, teamData) => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(teamData),
    });
    return handleResponse(response);
  },

  deleteTeam: async (teamId) => {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // ================== EMPLOYEES ==================
  getEmployees: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createEmployee: async (employeeData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  updateEmployee: async (employeeId, employeeData) => {
    const response = await fetch(`${API_BASE_URL}/users/${employeeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  deleteEmployee: async (employeeId) => {
    const response = await fetch(`${API_BASE_URL}/users/${employeeId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // ================== EVALUATION FORMS ==================
  getEvaluationForms: async () => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createEvaluationForm: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  updateEvaluationForm: async (formId, formData) => {
    const response = await fetch(`${API_BASE_URL}/forms/${formId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(formData),
    });
    return handleResponse(response);
  },

  deleteEvaluationForm: async (formId) => {
    const response = await fetch(`${API_BASE_URL}/forms/${formId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // 🔹 Form helpers
  getPeerEvaluationForms: async () => {
    const forms = await api.getEvaluationForms();
    return forms.filter((form) => form.formType === "peer_evaluation");
  },

  getSelfAssessmentForms: async () => {
    const forms = await api.getEvaluationForms();
    return forms.filter((form) => form.formType === "self_assessment");
  },

  getFormsGroupedByType: async () => {
    const forms = await api.getEvaluationForms();
    return forms.reduce((acc, form) => {
      if (!acc[form.formType]) acc[form.formType] = [];
      acc[form.formType].push(form);
      return acc;
    }, {});
  },

  // 🔹 Extended helpers
  getTeamPeerEvaluationForms: async (userId) => {
    const [forms, peers] = await Promise.all([
      api.getPeerEvaluationForms(),
      api.getTeamMembers(userId),
    ]);

    // Get all active peer evaluation forms
    const activeForms = forms.filter((f) => f.status === "active");

    // Map peers, excluding current user
    const filteredPeers = peers
      .filter((p) => p.id !== userId)
      .map((p) => ({
        id: p.id,
        name: p.name,
        department: p.department || "N/A",
        role: p.role || "Employee",
      }));

    return { forms: activeForms, peers: filteredPeers };
  },

  getUserSelfAssessmentForms: async (userId) => {
    const forms = await api.getSelfAssessmentForms();
    const validForms = forms.filter((form) => {
      const isValidRatingScale =
        Array.isArray(form.ratingScale) &&
        form.ratingScale.every(
          (scale) => typeof scale === "object" && scale.value && scale.label
        );
      if (!isValidRatingScale) {
        console.warn(
          `Invalid self-assessment form filtered out: ID ${form.id}`
        );
        return false;
      }
      return true;
    });
    const activeForm = validForms.find((f) => f.status === "active") || null;
    return { form: activeForm, userId };
  },

  // ================== EVALUATIONS ==================
  distributeForms: async (employeeId, formAssignments) => {
    const response = await fetch(`${API_BASE_URL}/evaluations/distribute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ employeeId, formAssignments }),
    });
    return handleResponse(response);
  },

  getEvaluatesByUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/evaluations/user/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  submitEvaluation: async (evaluationData) => {
    const response = await fetch(`${API_BASE_URL}/evaluations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(evaluationData),
    });
    return handleResponse(response);
  },

  // ================== REPORTS ==================
  generatePerformanceReport: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/performance`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  generateEmployeeReport: async (userId) => {
    if (!userId) throw new Error("User ID is required to generate report");
    const response = await fetch(`${API_BASE_URL}/reports/employee/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // ================== TASKS ==================
  getUpcomingTasks: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/tasks?userId=${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export default api;
