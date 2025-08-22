export const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || "http://localhost:5000/api"

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("authToken")
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const isJson = (res.headers.get("content-type") || "").includes("application/json")
  const data = isJson ? await res.json() : null
  if (!res.ok) {
    const message = data?.message || `Request failed with status ${res.status}`
    throw new Error(message)
  }
  return data
}

export function saveAuth({ token, user }) {
  localStorage.setItem("authToken", token)
  localStorage.setItem("userRole", user.role)
  localStorage.setItem("userEmail", user.email)
  if (user.id) localStorage.setItem("userId", user.id)
}

export async function login(email, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userRole")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userId")
}


