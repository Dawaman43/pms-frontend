import { useState } from "react";
import EmployeeDetails from "./EmployeeDetails";
import EditEmployee from "./EditEmployee";
import styles from "./pagesAdminDashboard.module.css";

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
  console.log("Employees from API:", employees);
  console.log("Departments:", departments);
  console.log("Teams:", teams);

  // Filter employees by search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered Employees:", filteredEmployees);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("Paginated Employees:", paginatedEmployees);

  return (
    <div className={styles.employeeListContent}>
      {/* View Employee */}
      {isViewingEmployee && selectedEmployee && (
        <EmployeeDetails
          employee={selectedEmployee}
          setIsViewingEmployee={setIsViewingEmployee}
          handleDeleteEmployee={handleDeleteEmployee}
          departments={departments}
          teams={teams}
        />
      )}

      {/* Edit Employee */}
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

      {/* Employee List */}
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
                    <th>Email</th>
                    <th>Job Title</th>
                    <th>Level</th>
                    <th>Department</th>
                    <th>Team</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedEmployees.length > 0 ? (
                    paginatedEmployees.map((employee) => {
                      // Use department_name and teamName directly if available, else map using IDs
                      const departmentName =
                        employee.department_name ||
                        (employee.department_id &&
                          departments.find(
                            (d) => d.id === employee.department_id
                          )?.name) ||
                        "N/A";
                      const teamName =
                        employee.teamName ||
                        (employee.team_id &&
                          teams.find((t) => t.id === employee.team_id)?.name) ||
                        "N/A";

                      return (
                        <tr key={employee.id}>
                          <td>{employee.name || "N/A"}</td>
                          <td>{employee.email || "N/A"}</td>
                          <td>{employee.jobTitle || "N/A"}</td>
                          <td>{employee.level || "N/A"}</td>
                          <td>{departmentName}</td>
                          <td>{teamName}</td>
                          <td>{employee.status || "N/A"}</td>
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
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8">No employees found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
  );
};

export default EmployeeList;
