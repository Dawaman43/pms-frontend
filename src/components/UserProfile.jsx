"use client"

import { useState } from "react"
import styles from "./UserProfile.module.css"

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    personalInfo: {
      firstName: "Samuel",
      lastName: "Hailu Demse",
      email: "samuel.hailu@astu.edu.et",
      phone: "+251-911-123456",
      dateOfBirth: "1990-05-15",
      gender: "Male",
    },
    professionalInfo: {
      employeeId: "ASTU-ICT-001",
      position: "Software Programmer IV",
      department: "Information Communication Technology",
      hireDate: "2015-09-01",
      supervisor: "Daniel Asfaw",
      workLocation: "Main Campus",
    },
    emergencyContact: {
      name: "Almaz Hailu",
      relationship: "Spouse",
      phone: "+251-911-654321",
      email: "almaz.hailu@gmail.com",
    },
    skills: [
      "JavaScript",
      "React.js",
      "Node.js",
      "Python",
      "Database Management",
      "System Analysis",
      "Project Management",
    ],
    certifications: [
      {
        name: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2023-08-15",
        expiryDate: "2026-08-15",
      },
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        date: "2022-03-20",
        expiryDate: "2024-03-20",
      },
    ],
  })

  const handleInputChange = (section, field, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    // Here you would typically save to backend
    console.log("Saving profile:", userProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset changes or fetch fresh data
    setIsEditing(false)
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImageSection}>
          <img src="/placeholder.svg?height=120&width=120&text=User" alt="Profile" className={styles.profileImage} />
          <button className={styles.changePhotoButton}>Change Photo</button>
        </div>
        <div className={styles.profileBasicInfo}>
          <h1>
            {userProfile.personalInfo.firstName} {userProfile.personalInfo.lastName}
          </h1>
          <p className={styles.position}>{userProfile.professionalInfo.position}</p>
          <p className={styles.department}>{userProfile.professionalInfo.department}</p>
          <p className={styles.employeeId}>ID: {userProfile.professionalInfo.employeeId}</p>
        </div>
        <div className={styles.profileActions}>
          {!isEditing ? (
            <button className={styles.editButton} onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className={styles.editActions}>
              <button className={styles.saveButton} onClick={handleSave}>
                💾 Save
              </button>
              <button className={styles.cancelButton} onClick={handleCancel}>
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.profileContent}>
        {/* Personal Information */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.personalInfo.firstName}
                  onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.personalInfo.firstName}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.personalInfo.lastName}
                  onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.personalInfo.lastName}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={userProfile.personalInfo.email}
                  onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.personalInfo.email}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userProfile.personalInfo.phone}
                  onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.personalInfo.phone}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  value={userProfile.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{new Date(userProfile.personalInfo.dateOfBirth).toLocaleDateString()}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Gender</label>
              {isEditing ? (
                <select
                  value={userProfile.personalInfo.gender}
                  onChange={(e) => handleInputChange("personalInfo", "gender", e.target.value)}
                  className={styles.select}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>{userProfile.personalInfo.gender}</span>
              )}
            </div>
          </div>
        </section>

        {/* Professional Information */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Professional Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <label>Employee ID</label>
              <span>{userProfile.professionalInfo.employeeId}</span>
            </div>

            <div className={styles.infoField}>
              <label>Position</label>
              <span>{userProfile.professionalInfo.position}</span>
            </div>

            <div className={styles.infoField}>
              <label>Department</label>
              <span>{userProfile.professionalInfo.department}</span>
            </div>

            <div className={styles.infoField}>
              <label>Hire Date</label>
              <span>{new Date(userProfile.professionalInfo.hireDate).toLocaleDateString()}</span>
            </div>

            <div className={styles.infoField}>
              <label>Supervisor</label>
              <span>{userProfile.professionalInfo.supervisor}</span>
            </div>

            <div className={styles.infoField}>
              <label>Work Location</label>
              <span>{userProfile.professionalInfo.workLocation}</span>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Emergency Contact</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoField}>
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.emergencyContact.name}
                  onChange={(e) => handleInputChange("emergencyContact", "name", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.emergencyContact.name}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Relationship</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userProfile.emergencyContact.relationship}
                  onChange={(e) => handleInputChange("emergencyContact", "relationship", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.emergencyContact.relationship}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userProfile.emergencyContact.phone}
                  onChange={(e) => handleInputChange("emergencyContact", "phone", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.emergencyContact.phone}</span>
              )}
            </div>

            <div className={styles.infoField}>
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={userProfile.emergencyContact.email}
                  onChange={(e) => handleInputChange("emergencyContact", "email", e.target.value)}
                  className={styles.input}
                />
              ) : (
                <span>{userProfile.emergencyContact.email}</span>
              )}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Skills & Competencies</h2>
          <div className={styles.skillsContainer}>
            {userProfile.skills.map((skill, index) => (
              <span key={index} className={styles.skillTag}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className={styles.profileSection}>
          <h2 className={styles.sectionTitle}>Certifications</h2>
          <div className={styles.certificationsContainer}>
            {userProfile.certifications.map((cert, index) => (
              <div key={index} className={styles.certificationCard}>
                <h4>{cert.name}</h4>
                <p>Issued by: {cert.issuer}</p>
                <p>Date: {new Date(cert.date).toLocaleDateString()}</p>
                <p>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default UserProfile
