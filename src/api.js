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

/** Helper function for POST/PUT/DELETE requests */
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
  getAllUsersExceptCurrent: () => get("/users/all-except-current"),
  createEmployee: (data) => send("/users", "POST", data),
  updateEmployee: (id, data) => send(`/users/${id}`, "PUT", data),
  deleteEmployee: (id) => send(`/users/${id}`, "DELETE"),
  updateUser: (id, data) => send(`/users/${id}`, "PUT", data),
  updateUserPassword: (id, oldPassword, newPassword) => {
    const payload = oldPassword
      ? { oldPassword, newPassword }
      : { newPassword };
    return send(`/users/${id}/password`, "PUT", payload);
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
    const teamResult = await send("/teams", "POST", teamCore);
    const teamId = teamResult.id || teamResult.teamId;

    if (memberIds?.length) {
      await Promise.all(
        memberIds.map((id) => api.updateUser(id, { team_id: teamId }))
      );
    }

    const updatedMembers = memberIds?.length
      ? await Promise.all(memberIds.map(api.getUserById))
      : [];
    return { ...teamResult, members: updatedMembers };
  },
  updateTeam: async (teamId, teamData) => {
    const { memberIds, ...teamCore } = teamData;
    const teamResult = await send(`/teams/${teamId}`, "PUT", teamCore);

    if (memberIds) {
      const currentMembers = await api.getTeamMembers(teamId);
      const currentIds = currentMembers.map((m) => m.id);

      const removeIds = currentIds.filter((id) => !memberIds.includes(id));
      await Promise.all(
        removeIds.map((id) => api.updateUser(id, { team_id: null }))
      );

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

  // ================= DEPARTMENTS =================
  getAllDepartments: () => get("/departments"),
  getDepartmentById: (id) => get(`/departments/${id}`),
  createDepartment: (data) => send("/departments", "POST", data),
  updateDepartment: (id, data) => send(`/departments/${id}`, "PUT", data),
  deleteDepartment: (id) => send(`/departments/${id}`, "DELETE"),
  getTeamLeadersByDepartment: (departmentId) =>
    get(`/departments/${departmentId}/leaders`),
  getStaffByDepartment: (departmentId) =>
    get(`/departments/${departmentId}/staff`),

  // ================= EVALUATION FORMS =================
  getEvaluationForms: () => get("/forms"),
  createEvaluationForm: (data) => send("/forms", "POST", data),
  updateEvaluationForm: (id, data) => send(`/forms/${id}`, "PUT", data),
  deleteEvaluationForm: (id) => send(`/forms/${id}`, "DELETE"),
  getTeamPeerEvaluationForms: (teamId) => {
    const url = teamId ? `/forms/team/${teamId}` : `/forms/peer-evaluations`;
    return get(url);
  },

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
  submitEvaluation: (data) => send("/evaluations", "POST", data),
  updateEvaluation: (id, data) => send(`/evaluations/${id}`, "PUT", data),
  deleteEvaluation: (id) => send(`/evaluations/${id}`, "DELETE"),
};

export default api;
