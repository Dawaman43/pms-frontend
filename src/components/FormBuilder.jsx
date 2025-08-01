"use client"

import { useState } from "react"
import styles from "./FormBuilder.module.css"

const FormBuilder = ({ onSave, onCancel, existingForm = null }) => {
  const [formData, setFormData] = useState({
    title: existingForm?.title || "ADAMA SCIENCE & TECHNOLOGY UNIVERSITY Performance Evaluation Form",
    description: existingForm?.description || "Employee performance evaluation form",
    targetRole: existingForm?.targetRole || "employee",
    status: existingForm?.status || "draft",
    sections: existingForm?.sections || [
      { 
        id: 1, 
        name: "Task Performance", 
        weight: 70, 
        criteria: [
          { id: 101, text: "Support and maintenance for HRMS, Attendance System, Transport System, and Clinic Service System", weight: 25 },
          { id: 102, text: "Develop Community and Special Education School System and train users", weight: 25 },
          { id: 103, text: "Print employee ID cards according to new structure, improve system and support", weight: 10 },
          { id: 104, text: "Develop ASTU Academic Staff Profile System", weight: 10 },
          { id: 105, text: "Collect data, design, and develop Stock and Gate Pass Management System", weight: 20 },
          { id: 106, text: "Collect data, study, and design Strategic and Data Management System", weight: 10 },
        ] 
      },
      { 
        id: 2, 
        name: "Behavioral Indicators", 
        weight: 30,
        subSections: [
          { id: 201, name: "By Evaluator", weight: 5 },
          { id: 202, name: "By Immediate Supervisor", weight: 10 },
          { id: 203, name: "By 1-to-5 Organization", weight: 15 }
        ],
        criteria: [
          { id: 301, text: "Efforts to eliminate rent-seeking attitudes and practices", weight: 25 },
          { id: 302, text: "Efforts to improve competence", weight: 20 },
          { id: 303, text: "Respect for customers and pride in service", weight: 15 },
          { id: 304, text: "Efforts to support and empower others", weight: 15 },
          { id: 305, text: "Efforts and tendency to improve processes and support with ICT", weight: 15 },
          { id: 306, text: "Tendency to give and receive performance feedback timely and properly", weight: 10 },
        ] 
      }
    ],
    evaluationScale: [
      { id: 1, label: "Unsatisfactory", value: 1 },
      { id: 2, label: "Needs Improvement", value: 2 },
      { id: 3, label: "Meets Expectations", value: 3 },
      { id: 4, label: "Exceeds Expectations", value: 4 }
    ],
    evaluationPeriod: {
      startDate: "",
      endDate: ""
    }
  })

  const [newSectionName, setNewSectionName] = useState("")
  const [newSubSectionName, setNewSubSectionName] = useState("")
  const [newCriterion, setNewCriterion] = useState("")
  const [activeSectionId, setActiveSectionId] = useState(null)
  const [activeSubSectionMode, setActiveSubSectionMode] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSectionChange = (sectionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => 
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    }))
  }

  const addSection = () => {
    if (!newSectionName.trim()) return

    const newSection = {
      id: Date.now(),
      name: newSectionName,
      weight: 10,
      criteria: [],
    }

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }))

    setNewSectionName("")
  }

  const removeSection = (sectionId) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }))
  }

  const addCriterion = (sectionId) => {
    if (!newCriterion.trim()) return

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              criteria: [
                ...section.criteria,
                {
                  id: Date.now(),
                  text: newCriterion,
                  weight: 10,
                },
              ],
            }
          : section
      ),
    }))

    setNewCriterion("")
    setActiveSectionId(null)
  }

  const removeCriterion = (sectionId, criterionId) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              criteria: section.criteria.filter((criterion) => criterion.id !== criterionId),
            }
          : section
      ),
    }))
  }

  const updateCriterion = (sectionId, criterionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              criteria: section.criteria.map((criterion) =>
                criterion.id === criterionId ? { ...criterion, [field]: value } : criterion
              ),
            }
          : section
      ),
    }))
  }

  const addSubSection = (sectionId) => {
    if (!newSubSectionName.trim()) return

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subSections: [
                ...(section.subSections || []),
                {
                  id: Date.now(),
                  name: newSubSectionName,
                  weight: 5,
                },
              ],
            }
          : section
      ),
    }))

    setNewSubSectionName("")
    setActiveSubSectionMode(false)
  }

  const removeSubSection = (sectionId, subSectionId) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subSections: section.subSections?.filter((ss) => ss.id !== subSectionId) || [],
            }
          : section
      ),
    }))
  }

  const updateSubSection = (sectionId, subSectionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId && section.subSections
          ? {
              ...section,
              subSections: section.subSections.map((subSection) =>
                subSection.id === subSectionId ? { ...subSection, [field]: value } : subSection
              ),
            }
          : section
      ),
    }))
  }

  const getTotalWeight = () => {
    return formData.sections.reduce((total, section) => total + section.weight, 0)
  }

  const getSubSectionTotalWeight = (sectionId) => {
    const section = formData.sections.find(s => s.id === sectionId)
    if (!section || !section.subSections) return 0
    return section.subSections.reduce((total, ss) => total + ss.weight, 0)
  }

  const getCriteriaTotalWeight = (sectionId) => {
    const section = formData.sections.find(s => s.id === sectionId)
    if (!section) return 0
    return section.criteria.reduce((total, c) => total + c.weight, 0)
  }

  const handleSave = () => {
    if (getTotalWeight() !== 100) {
      alert("Total section weights must equal 100%")
      return
    }

    // Validate subsection weights
    let valid = true
    formData.sections.forEach(section => {
      if (section.subSections && section.subSections.length > 0) {
        const subSectionTotal = getSubSectionTotalWeight(section.id)
        if (subSectionTotal !== section.weight) {
          alert(`Subsection weights in "${section.name}" must equal the section weight (${section.weight}%)`)
          valid = false
        }
      }
      
      // Validate criteria weights
      const criteriaTotal = getCriteriaTotalWeight(section.id)
      if (criteriaTotal !== 100) {
        alert(`Criteria weights in "${section.name}" must equal 100%`)
        valid = false
      }
    })

    if (!valid) return
    onSave(formData)
  }

  return (
    <div className={styles.builderContainer}>
      <div className={styles.builderHeader}>
        <h2>{existingForm ? "Edit Evaluation Form" : "Create New Evaluation Form"}</h2>
        <div className={styles.headerActions}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSave}>
            Save Form
          </button>
        </div>
      </div>

      <div className={styles.builderContent}>
        {/* Basic Information */}
        <section className={styles.builderSection}>
          <h3>Basic Information</h3>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Form Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter form title"
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Target Role</label>
              <select
                value={formData.targetRole}
                onChange={(e) => handleInputChange("targetRole", e.target.value)}
                className={styles.select}
              >
                <option value="employee">Employee</option>
                <option value="teacher">Teacher</option>
                <option value="academic_worker">Academic Worker</option>
                <option value="admin">Administrator</option>
                <option value="software_programmer">Software Programmer</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className={styles.select}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Evaluation Period Start</label>
              <input
                type="date"
                value={formData.evaluationPeriod.startDate}
                onChange={(e) => handleInputChange("evaluationPeriod", {
                  ...formData.evaluationPeriod,
                  startDate: e.target.value
                })}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Evaluation Period End</label>
              <input
                type="date"
                value={formData.evaluationPeriod.endDate}
                onChange={(e) => handleInputChange("evaluationPeriod", {
                  ...formData.evaluationPeriod,
                  endDate: e.target.value
                })}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter form description"
              className={styles.textarea}
              rows={3}
            />
          </div>
        </section>

        {/* Evaluation Scale */}
        <section className={styles.builderSection}>
          <h3>Evaluation Scale</h3>
          <div className={styles.scaleContainer}>
            {formData.evaluationScale.map((level) => (
              <div key={level.id} className={styles.scaleItem}>
                <div className={styles.scaleLevel}>
                  <input
                    type="text"
                    value={level.label}
                    onChange={(e) => {
                      const updatedScale = formData.evaluationScale.map(l => 
                        l.id === level.id ? {...l, label: e.target.value} : l
                      )
                      handleInputChange("evaluationScale", updatedScale)
                    }}
                    className={styles.scaleLabelInput}
                  />
                  <div className={styles.scaleValue}>
                    <label>Value:</label>
                    <input
                      type="number"
                      value={level.value}
                      onChange={(e) => {
                        const updatedScale = formData.evaluationScale.map(l => 
                          l.id === level.id ? {...l, value: Number(e.target.value)} : l
                        )
                        handleInputChange("evaluationScale", updatedScale)
                      }}
                      min="1"
                      max="5"
                      className={styles.scaleValueInput}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form Sections */}
        <section className={styles.builderSection}>
          <div className={styles.sectionHeader}>
            <h3>Form Sections</h3>
            <div className={styles.weightIndicator}>
              Total Weight:{" "}
              <span className={getTotalWeight() === 100 ? styles.valid : styles.invalid}>{getTotalWeight()}%</span>
            </div>
          </div>

          <div className={styles.sectionsContainer}>
            {formData.sections.map((section) => (
              <div key={section.id} className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionInfo}>
                    <input
                      type="text"
                      value={section.name}
                      onChange={(e) => handleSectionChange(section.id, "name", e.target.value)}
                      className={styles.sectionNameInput}
                    />
                    <div className={styles.weightInput}>
                      <label>Weight:</label>
                      <input
                        type="number"
                        value={section.weight}
                        onChange={(e) =>
                          handleSectionChange(section.id, "weight", Number(e.target.value) || 0)
                        }
                        min="0"
                        max="100"
                        className={styles.weightField}
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <button className={styles.removeSectionButton} onClick={() => removeSection(section.id)}>
                    🗑️
                  </button>
                </div>

                {/* Sub-sections if they exist */}
                {section.subSections && section.subSections.length > 0 && (
                  <div className={styles.subSectionsContainer}>
                    <div className={styles.subSectionHeader}>
                      <h4>Sub-sections</h4>
                      <div className={styles.weightIndicator}>
                        Total Weight:{" "}
                        <span className={getSubSectionTotalWeight(section.id) === section.weight ? styles.valid : styles.invalid}>
                          {getSubSectionTotalWeight(section.id)}%
                        </span>
                      </div>
                    </div>
                    
                    {section.subSections.map(subSection => (
                      <div key={subSection.id} className={styles.subSectionItem}>
                        <input
                          type="text"
                          value={subSection.name}
                          onChange={(e) => updateSubSection(section.id, subSection.id, "name", e.target.value)}
                          className={styles.subSectionInput}
                        />
                        <div className={styles.weightInput}>
                          <label>Weight:</label>
                          <input
                            type="number"
                            value={subSection.weight}
                            onChange={(e) => updateSubSection(
                              section.id, 
                              subSection.id, 
                              "weight", 
                              Number(e.target.value) || 0
                            )}
                            min="0"
                            max={section.weight}
                            className={styles.weightField}
                          />
                          <span>%</span>
                        </div>
                        <button
                          className={styles.removeSubSectionButton}
                          onClick={() => removeSubSection(section.id, subSection.id)}
                        >
                          ❌
                        </button>
                      </div>
                    ))}

                    {/* Add new subsection */}
                    <div className={styles.addSubSection}>
                      {activeSubSectionMode && activeSectionId === section.id ? (
                        <div className={styles.subSectionForm}>
                          <input
                            type="text"
                            value={newSubSectionName}
                            onChange={(e) => setNewSubSectionName(e.target.value)}
                            placeholder="Enter sub-section name"
                            className={styles.input}
                          />
                          <div className={styles.subSectionActions}>
                            <button className={styles.addButton} onClick={() => addSubSection(section.id)}>
                              Add
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={() => {
                                setActiveSubSectionMode(false)
                                setNewSubSectionName("")
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className={styles.addSubSectionButton} 
                          onClick={() => {
                            setActiveSectionId(section.id)
                            setActiveSubSectionMode(true)
                          }}
                        >
                          ➕ Add Sub-section
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className={styles.criteriaContainer}>
                  <div className={styles.criteriaHeader}>
                    <h4>Evaluation Criteria</h4>
                    <div className={styles.weightIndicator}>
                      Total Weight:{" "}
                      <span className={getCriteriaTotalWeight(section.id) === 100 ? styles.valid : styles.invalid}>
                        {getCriteriaTotalWeight(section.id)}%
                      </span>
                    </div>
                  </div>
                  
                  {section.criteria.map((criterion) => (
                    <div key={criterion.id} className={styles.criterionItem}>
                      <input
                        type="text"
                        value={criterion.text}
                        onChange={(e) => updateCriterion(section.id, criterion.id, "text", e.target.value)}
                        className={styles.criterionInput}
                      />
                      <div className={styles.criterionWeight}>
                        <input
                          type="number"
                          value={criterion.weight}
                          onChange={(e) =>
                            updateCriterion(section.id, criterion.id, "weight", Number(e.target.value) || 0)
                          }
                          min="0"
                          max="100"
                          className={styles.weightField}
                        />
                        <span>%</span>
                      </div>
                      <button
                        className={styles.removeCriterionButton}
                        onClick={() => removeCriterion(section.id, criterion.id)}
                      >
                        ❌
                      </button>
                    </div>
                  ))}

                  <div className={styles.addCriterion}>
                    {activeSectionId === section.id && !activeSubSectionMode ? (
                      <div className={styles.criterionForm}>
                        <input
                          type="text"
                          value={newCriterion}
                          onChange={(e) => setNewCriterion(e.target.value)}
                          placeholder="Enter criterion description"
                          className={styles.input}
                        />
                        <div className={styles.criterionActions}>
                          <button className={styles.addButton} onClick={() => addCriterion(section.id)}>
                            Add
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={() => {
                              setActiveSectionId(null)
                              setNewCriterion("")
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className={styles.addCriterionButton} 
                        onClick={() => {
                          setActiveSectionId(section.id)
                          setActiveSubSectionMode(false)
                        }}
                      >
                        ➕ Add Criterion
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.addSection}>
            <div className={styles.addSectionForm}>
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter section name"
                className={styles.input}
              />
              <button className={styles.addButton} onClick={addSection}>
                ➕ Add Section
              </button>
            </div>
          </div>
        </section>

        {/* Form Preview */}
        <section className={styles.builderSection}>
          <h3>Form Preview</h3>
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <div className={styles.previewTitle}>
                <h2>{formData.title || "Untitled Form"}</h2>
                <p className={styles.previewDescription}>{formData.description || "No description provided"}</p>
              </div>
              
              <div className={styles.previewInfo}>
                <div className={styles.previewPeriod}>
                  <p><strong>Evaluation Period:</strong> {formData.evaluationPeriod.startDate || "___"} to {formData.evaluationPeriod.endDate || "___"}</p>
                </div>
                <p><strong>Target Role:</strong> {formData.targetRole}</p>
              </div>

              <div className={styles.previewEmployeeInfo}>
                <div className={styles.previewInfoRow}>
                  <p><strong>Employee Name:</strong> ___________________________</p>
                  <p><strong>Position:</strong> ___________________________</p>
                </div>
                <div className={styles.previewInfoRow}>
                  <p><strong>Department:</strong> ___________________________</p>
                  <p><strong>Evaluator:</strong> ___________________________</p>
                </div>
              </div>
            </div>

            <div className={styles.previewSections}>
              {formData.sections.map((section) => (
                <div key={section.id} className={styles.previewSection}>
                  <h3>
                    {section.name} ({section.weight}%)
                  </h3>
                  
                  {section.subSections && section.subSections.length > 0 && (
                    <div className={styles.previewSubSections}>
                      {section.subSections.map(subSection => (
                        <div key={subSection.id} className={styles.previewSubSection}>
                          <h4>{subSection.name} ({subSection.weight}%)</h4>
                          <table className={styles.previewTable}>
                            <thead>
                              <tr>
                                <th>No.</th>
                                <th>Evaluation Criteria</th>
                                <th>Weight</th>
                                <th colSpan={formData.evaluationScale.length}>Performance Level</th>
                              </tr>
                              <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                {formData.evaluationScale.map(level => (
                                  <th key={level.id}>{level.value}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {section.criteria.map((criterion, index) => (
                                <tr key={criterion.id}>
                                  <td>{index + 1}</td>
                                  <td>{criterion.text}</td>
                                  <td>{criterion.weight}%</td>
                                  {formData.evaluationScale.map(level => (
                                    <td key={level.id} className={styles.checkboxCell}>□</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!section.subSections || section.subSections.length === 0) && (
                    <table className={styles.previewTable}>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Evaluation Criteria</th>
                          <th>Weight</th>
                          <th colSpan={formData.evaluationScale.length}>Performance Level</th>
                        </tr>
                        <tr>
                          <th></th>
                          <th></th>
                          <th></th>
                          {formData.evaluationScale.map(level => (
                            <th key={level.id}>{level.value}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.criteria.map((criterion, index) => (
                          <tr key={criterion.id}>
                            <td>{index + 1}</td>
                            <td>{criterion.text}</td>
                            <td>{criterion.weight}%</td>
                            {formData.evaluationScale.map(level => (
                              <td key={level.id} className={styles.checkboxCell}>□</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}
              
              <div className={styles.previewSummary}>
                <h3>Performance Summary</h3>
                <table className={styles.summaryTable}>
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Weight</th>
                      <th>Score</th>
                      <th>Weighted Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.sections.map(section => (
                      <tr key={section.id}>
                        <td>{section.name}</td>
                        <td>{section.weight}%</td>
                        <td>_____</td>
                        <td>_____</td>
                      </tr>
                    ))}
                    <tr className={styles.totalRow}>
                      <td colSpan={3}><strong>Total Performance Score</strong></td>
                      <td>_____</td>
                    </tr>
                  </tbody>
                </table>
                
                <div className={styles.signatureSection}>
                  <div className={styles.signatureRow}>
                    <div className={styles.signatureField}>
                      <p><strong>Employee:</strong> ___________________________</p>
                      <p><strong>Signature:</strong> ___________________________</p>
                      <p><strong>Date:</strong> ___________________________</p>
                    </div>
                    <div className={styles.signatureField}>
                      <p><strong>Evaluator:</strong> ___________________________</p>
                      <p><strong>Signature:</strong> ___________________________</p>
                      <p><strong>Date:</strong> ___________________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FormBuilder