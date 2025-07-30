"use client"

import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = () => {
      // In a real app, you would check localStorage, sessionStorage, or make an API call
      const token = localStorage.getItem("authToken")
      const role = localStorage.getItem("userRole")

      if (token) {
        setIsAuthenticated(true)
        setUserRole(role)
      } else {
        setIsAuthenticated(false)
        setUserRole(null)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p
            style={{
              color: "#718096",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "20px",
            }}
          >
            🚫
          </div>
          <h2
            style={{
              color: "#2d3748",
              fontSize: "24px",
              fontWeight: "600",
              margin: "0 0 10px 0",
            }}
          >
            Access Denied
          </h2>
          <p
            style={{
              color: "#718096",
              fontSize: "16px",
              margin: "0 0 20px 0",
            }}
          >
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
