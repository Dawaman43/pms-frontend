import styles from "./pagesAdminDashboard.module.css"

const EmployeeDetails = ({ employee, setIsViewingEmployee }) => {
  return (
    <div className={styles.employeeDetailsContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Employee Details</h3>
          <button
            className={styles.closeButton}
            onClick={() => setIsViewingEmployee(false)}
          >
            Close
          </button>
        </div>
        <div className={styles.employeeDetails}>
          <div className={styles.employeeAvatar}>
            <img
              src={employee.profileImage || "/placeholder.svg?height=120&width=120"}
              alt={employee.name}
              className={styles.userAvatar}
            />
          </div>
          <div className={styles.detailGroup}>
            <h4>Name:</h4>
            <p>{employee.name}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Job Title:</h4>
            <p>{employee.jobTitle}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Level:</h4>
            <p>{employee.level}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Email:</h4>
            <p>{employee.email}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Department:</h4>
            <p>{employee.department}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Team:</h4>
            <p>{employee.team}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Phone:</h4>
            <p>{employee.phone}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Address:</h4>
            <p>{employee.address}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Emergency Contact:</h4>
            <p>{employee.emergencyContact}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Salary:</h4>
            <p>{employee.salary}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Status:</h4>
            <p>{employee.status}</p>
          </div>
          <div className={styles.detailGroup}>
            <h4>Date Registered:</h4>
            <p>{employee.dateRegistered}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeDetails
