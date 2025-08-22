import EmployeeDetails from "./EmployeeDetails"
import EditEmployee from "./EditEmployee"
import styles from "./pagesAdminDashboard.module.css"

const EmployeeList = ({
  employees,
  teams,
  departments,
  handleViewEmployee,
  handleEditEmployee,
  handleUpdateEmployee,
  handleDeleteEmployee,
  selectedEmployee,
  isViewingEmployee,
  setIsViewingEmployee,
  isEditingEmployee,
  setIsEditingEmployee,
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  error,
  success,
  itemsPerPage,
  employeeForm,
  handleEmployeeFormChange,
  jobLevels,
}) => {
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className={styles.employeeListContent}>
      {isViewingEmployee && selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          setIsViewingEmployee={setIsViewingEmployee}
        />
      )}
      {isEditingEmployee && selectedEmployee && (
        <EditEmployee
          employeeForm={employeeForm}
          handleEmployeeFormChange={handleEmployeeFormChange}
          handleUpdateEmployee={handleUpdateEmployee}
          setIsEditingEmployee={setIsEditingEmployee}
          teams={teams}
          departments={departments}
          jobLevels={jobLevels}
          error={error}
          success={success}
        />
      )}
      {!isViewingEmployee && !isEditingEmployee && (
        <>
          <div className={styles.employeeListHeader}>
            <h2>Employee List</h2>
            <p>View and manage employees</p>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && <div className={styles.successMessage}>{success}</div>}
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search employees by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Employees</h3>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td>{employee.name}</td>
                        <td>{employee.jobTitle}</td>
                        <td>{employee.department}</td>
                        <td>{employee.team}</td>
                        <td>{employee.status}</td>
                        <td>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleViewEmployee(employee)}
                          >
                            View
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No employees found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className={styles.pagination}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default EmployeeList
