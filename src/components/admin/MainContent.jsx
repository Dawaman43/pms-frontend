import Overview from "./Overview"
import RegisterEmployee from "./RegisterEmployee"
import TeamManagement from "./TeamManagement"
import EmployeeList from "./EmployeeList"
import Reports from "./Reports"
import EditAdminProfile from "./EditAdminProfile"
import CreateEvaluationForm from "./CreateEvaluationForm"
import styles from "../../pages/AdminDashboard.module.css"

const MainContent = ({
  activeTab,
  employees,
  teams,
  newTeam,
  setNewTeam,
  employeeForm,
  setEmployeeForm,
  password,
  isGenerated,
  generatePassword,
  handleEmployeeFormChange,
  handleImageUpload,
  validateEmail,
  handleEmployeeRegistration,
  handleTeamCreation,
  handleTeamEdit,
  handleTeamUpdate,
  handleTeamDelete,
  handleViewEmployee,
  handleEditEmployee,
  handleUpdateEmployee,
  handleDeleteEmployee,
  handleGenerateReport,
  selectedEmployee,
  isViewingEmployee,
  setIsViewingEmployee,
  isEditingEmployee,
  setIsEditingEmployee,
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  recentActivities,
  systemStats,
  departments,
  jobLevels,
  error,
  success,
  itemsPerPage,
  adminForm,
  setAdminForm,
  handleAdminFormChange,
  handleUpdateAdmin,
  isEditingAdmin,
  setIsEditingAdmin,
  evaluationForm,
  setEvaluationForm,
  handleFormChange,
  handleSectionChange,
  handleCriterionChange,
  addSection,
  removeSection,
  addCriterion,
  removeCriterion,
  handleCreateForm,
}) => {
  return (
    <main className={styles.mainContent}>
      {activeTab === "overview" && (
        <Overview systemStats={systemStats} recentActivities={recentActivities} />
      )}
      {activeTab === "register" && (
        <RegisterEmployee
          employeeForm={employeeForm}
          setEmployeeForm={setEmployeeForm}
          password={password}
          isGenerated={isGenerated}
          generatePassword={generatePassword}
          handleEmployeeFormChange={handleEmployeeFormChange}
          handleImageUpload={handleImageUpload}
          validateEmail={validateEmail}
          handleEmployeeRegistration={handleEmployeeRegistration}
          teams={teams}
          departments={departments}
          jobLevels={jobLevels}
          error={error}
          success={success}
        />
      )}
      {activeTab === "teams" && (
        <TeamManagement
          teams={teams}
          newTeam={newTeam}
          setNewTeam={setNewTeam}
          handleTeamCreation={handleTeamCreation}
          handleTeamEdit={handleTeamEdit}
          handleTeamUpdate={handleTeamUpdate}
          handleTeamDelete={handleTeamDelete}
          error={error}
          success={success}
        />
      )}
      {activeTab === "employees" && (
        <EmployeeList
          employees={employees}
          teams={teams}
          departments={departments}
          handleViewEmployee={handleViewEmployee}
          handleEditEmployee={handleEditEmployee}
          handleUpdateEmployee={handleUpdateEmployee}
          handleDeleteEmployee={handleDeleteEmployee}
          selectedEmployee={selectedEmployee}
          isViewingEmployee={isViewingEmployee}
          setIsViewingEmployee={setIsViewingEmployee}
          isEditingEmployee={isEditingEmployee}
          setIsEditingEmployee={setIsEditingEmployee}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          error={error}
          success={success}
          itemsPerPage={itemsPerPage}
          employeeForm={employeeForm}
          handleEmployeeFormChange={handleEmployeeFormChange}
          jobLevels={jobLevels}
        />
      )}
      {activeTab === "reports" && (
        <Reports handleGenerateReport={handleGenerateReport} error={error} success={success} />
      )}
      {activeTab === "editProfile" && (
        <EditAdminProfile
          adminForm={adminForm}
          setAdminForm={setAdminForm}
          handleAdminFormChange={handleAdminFormChange}
          handleImageUpload={handleImageUpload}
          handleUpdateAdmin={handleUpdateAdmin}
          departments={departments}
          error={error}
          success={success}
          setIsEditingAdmin={setIsEditingAdmin}
        />
      )}
      {activeTab === "createForm" && (
        <CreateEvaluationForm
          formData={evaluationForm}
          setFormData={setEvaluationForm}
          handleFormChange={handleFormChange}
          handleSectionChange={handleSectionChange}
          handleCriterionChange={handleCriterionChange}
          addSection={addSection}
          removeSection={removeSection}
          addCriterion={addCriterion}
          removeCriterion={removeCriterion}
          handleCreateForm={handleCreateForm}
          error={error}
          success={success}
          departments={departments}
        />
      )}
    </main>
  )
}

export default MainContent
