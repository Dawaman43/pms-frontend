"use client"

import { useState } from "react"
import styles from "./FormBuilder.module.css"

const FormBuilder = ({ onSave, onCancel, existingForm = null }) => {
  const [formData, setFormData] = useState({
    title: existingForm?.title || "",
    description: existingForm?.description || "",
    targetRole: existingForm?.targetRole || "teacher",
    status: existingForm?.status || "draft",
    sections: existingForm?.sections || [
      { id: 1, name: "Task Performance", weight: 70, criteria: [] },
      { id: 2, name: "Behavioral Indicators", weight: 30, criteria: [] },
    ],
  })

  const [newSectionName, setNewSectionName] = useState("")
  const [newCriterion, setNewCriterion] = useState("")
  const [activeSectionId, setActiveSectionId] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSectionChange = (sectionId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, [field]: value } : section)),
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
          : section,
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
          : section,
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
                criterion.id === criterionId ? { ...criterion, [field]: value } : criterion,
              ),
            }
          : section,
      ),
    }))
  }

  const getTotalWeight = () => {
    return formData.sections.reduce((total, section) => total + section.weight, 0)
  }

  const handleSave = () => {
    if (getTotalWeight() !== 100) {
      alert("Total section weights must equal 100%")
      return
    }

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
                <option value="teacher">Teacher</option>
                <option value="academic_worker">Academic Worker</option>
                <option value="admin">Administrator</option>
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
                          handleSectionChange(section.id, "weight", Number.parseInt(e.target.value) || 0)
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

                <div className={styles.criteriaContainer}>
                  <h4>Evaluation Criteria</h4>
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
                            updateCriterion(section.id, criterion.id, "weight", Number.parseInt(e.target.value) || 0)
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
                    {activeSectionId === section.id ? (
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
                      <button className={styles.addCriterionButton} onClick={() => setActiveSectionId(section.id)}>
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

        {/* Preview */}
        <section className={styles.builderSection}>
          <h3>Form Preview</h3>
          <div className={styles.previewContainer}>
            <div className={styles.previewHeader}>
              <h4>{formData.title || "Untitled Form"}</h4>
              <p>{formData.description || "No description provided"}</p>
              <span className={styles.previewRole}>Target Role: {formData.targetRole}</span>
            </div>

            <div className={styles.previewSections}>
              {formData.sections.map((section) => (
                <div key={section.id} className={styles.previewSection}>
                  <h5>
                    {section.name} ({section.weight}%)
                  </h5>
                  {section.criteria.length > 0 ? (
                    <ul className={styles.previewCriteria}>
                      {section.criteria.map((criterion) => (
                        <li key={criterion.id}>
                          {criterion.text} ({criterion.weight}%)
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noCriteria}>No criteria defined</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default FormBuilder
