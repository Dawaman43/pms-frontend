const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/** Get authorization headers if token exists */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Handle API response and errors */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {}
    if (response.status === 401) {
      console.warn("Unauthorized. Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      window.location.href = "/login";
      return;
    }
    throw new Error(
      errorData.message || `HTTP error! Status: ${response.status}`
    );
  }
  return response.json();
};

/** Helper function for GET requests */
const get = (url) =>
  fetch(`${API_BASE_URL}${url}`, { headers: getAuthHeaders() }).then(
    handleResponse
  );

/** Helper function for POST/PUT requests */
const send = (url, method, data, isFormData = false) => {
  const headers = isFormData
    ? getAuthHeaders()
    : { "Content-Type": "application/json", ...getAuthHeaders() };
  const body = isFormData ? data : JSON.stringify(data);
  return fetch(`${API_BASE_URL}${url}`, { method, headers, body }).then(
    handleResponse
  );
};

/** API object */
const api = {
  // ================= AUTH =================
  login: async (email, password) => {
    const data = await send("/auth/login", "POST", { email, password });
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

  // ================= USERS =================
  getUserById: (id) => get(`/users/${id}`),
  getAllUsers: () => get("/users"),
  createEmployee: (data) => send("/users", "POST", data),
  updateEmployee: (id, data) => send(`/users/${id}`, "PUT", data),
  deleteEmployee: (id) => send(`/users/${id}`, "DELETE"),
  updateUser: (id, data) => send(`/users/${id}`, "PUT", data),
  updateUserPassword: (id, oldPassword, newPassword) => {
    const data = oldPassword ? { oldPassword, newPassword } : { newPassword };
    return send(`/users/${id}/password`, "PUT", data);
  },
  uploadProfilePicture: (id, file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return send(`/users/${id}/profile-picture`, "POST", formData, true);
  },

  // ================= TEAMS =================
  getAllTeams: () => get("/teams"),
  getTeamMembers: (teamId) => get(`/teams/members/${teamId}`),

  createTeam: async (teamData) => {
    const { memberIds, ...teamCore } = teamData;
    // 1. Create team
    const teamResult = await send("/teams", "POST", teamCore);
    const teamId = teamResult.id || teamResult.teamId;

    // 2. Assign members if any
    if (memberIds?.length) {
      await Promise.all(
        memberIds.map((id) => api.updateUser(id, { team_id: teamId }))
      );
    }

    // 3. Return full team object with members
    const updatedMembers = memberIds?.length
      ? await Promise.all(memberIds.map(api.getUserById))
      : [];
    return { ...teamResult, members: updatedMembers };
  },

  updateTeam: async (teamId, teamData) => {
    const { memberIds, ...teamCore } = teamData;

    // 1. Update team info
    const teamResult = await send(`/teams/${teamId}`, "PUT", teamCore);

    // 2. Update members
    if (memberIds) {
      const currentMembers = await api.getTeamMembers(teamId);
      const currentIds = currentMembers.map((m) => m.id);

      // Remove members not in new list
      const removeIds = currentIds.filter((id) => !memberIds.includes(id));
      await Promise.all(
        removeIds.map((id) => api.updateUser(id, { team_id: null }))
      );

      // Add new members
      const addIds = memberIds.filter((id) => !currentIds.includes(id));
      await Promise.all(
        addIds.map((id) => api.updateUser(id, { team_id: teamId }))
      );
    }

    const updatedMembers = memberIds?.length
      ? await Promise.all(memberIds.map(api.getUserById))
      : [];
    return { ...teamResult, members: updatedMembers };
  },

  deleteTeam: (teamId) => send(`/teams/${teamId}`, "DELETE"),

  // ================= EVALUATION FORMS =================
  getEvaluationForms: () => get("/forms"),
  createEvaluationForm: (data) => send("/forms", "POST", data),
  updateEvaluationForm: (id, data) => send(`/forms/${id}`, "PUT", data),
  deleteEvaluationForm: (id) => send(`/forms/${id}`, "DELETE"),

  // ================= REPORTS =================
  generatePerformanceReport: () => get("/reports/performance"),
  generateEmployeeReport: (userId) => {
    if (!userId) throw new Error("User ID required");
    return get(`/reports/employee/${userId}`);
  },

  // ================= TASKS =================
  getUpcomingTasks: (userId) => get(`/tasks?userId=${userId}`),

  // ================= EVALUATIONS =================
  getAllEvaluations: () => get("/evaluations"),
  getEvaluatesByUser: (userId) => {
    if (!userId) throw new Error("User ID required");
    return get(`/evaluations/user/${userId}`);
  },
  createEvaluation: (data) => send("/evaluations", "POST", data),
  updateEvaluation: (id, data) => send(`/evaluations/${id}`, "PUT", data),
  deleteEvaluation: (id) => send(`/evaluations/${id}`, "DELETE"),
};

export default api;
