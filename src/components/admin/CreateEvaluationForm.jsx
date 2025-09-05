import styles from "../../pages/AdminDashboard.module.css";
import { useState } from "react";
import api from "../../api";

const CreateEvaluationForm = ({ departments }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    formType: "",
    targetEvaluator: "",
    weight: "",
    period: "", // New field for period
    sections: [
      {
        id: Date.now(),
        name: "",
        criteria: [{ id: Date.now(), name: "", weight: 0 }],
      },
    ],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formTypes = ["self_assessment", "peer_evaluation"];
  const targetEvaluators = ["employee", "peer", "manager"];
  const periods = [
    "Q1 2025",
    "Q2 2025",
    "Q3 2025",
    "Q4 2025",
    "Mid-Year 2025",
    "Year-End 2025",
  ]; // Example periods

  // Generic form field change
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Section name change
  const handleSectionChange = (sectionIndex, value) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].name = value;
      return { ...prev, sections: newSections };
    });
  };

  // Criterion change
  const handleCriterionChange = (
    sectionIndex,
    criterionIndex,
    field,
    value
  ) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].criteria[criterionIndex][field] =
        field === "weight" ? parseInt(value || 0, 10) : value;
      return { ...prev, sections: newSections };
    });
  };

  // Add new section
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(),
          name: "",
          criteria: [{ id: Date.now() + 1, name: "", weight: 0 }],
        },
      ],
    }));
  };

  // Remove section
  const removeSection = (sectionIndex) => {
    if (formData.sections.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex),
    }));
  };

  // Add criterion
  const addCriterion = (sectionIndex) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].criteria.push({
        id: Date.now(),
        name: "",
        weight: 0,
      });
      return { ...prev, sections: newSections };
    });
  };

  // Remove criterion
  const removeCriterion = (sectionIndex, criterionIndex) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      if (newSections[sectionIndex].criteria.length === 1) return prev;
      newSections[sectionIndex].criteria = newSections[
        sectionIndex
      ].criteria.filter((_, index) => index !== criterionIndex);
      return { ...prev, sections: newSections };
    });
  };

  // Submit form
  const handleCreateForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.title ||
      !formData.formType ||
      !formData.targetEvaluator ||
      !formData.weight ||
      !formData.period // Validate period
    ) {
      setError("All required fields must be provided");
      return;
    }
    if (
      formData.sections.length === 0 ||
      formData.sections.some(
        (section) => !section.name || section.criteria.length === 0
      )
    ) {
      setError("Each section must have a name and at least one criterion");
      return;
    }
    if (
      formData.sections.some((section) =>
        section.criteria.some(
          (criterion) => !criterion.name || criterion.weight <= 0
        )
      )
    ) {
      setError("All criteria must have a name and weight greater than 0");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        formType: formData.formType,
        targetEvaluator: formData.targetEvaluator,
        weight: parseInt(formData.weight, 10),
        period: formData.period, // Include period in payload
        sections: formData.sections,
      };

      const response = await api.createEvaluationForm(payload);
      setSuccess(response.message || "Form created successfully");
      setFormData({
        title: "",
        description: "",
        formType: "",
        targetEvaluator: "",
        weight: "",
        period: "", // Reset period
        sections: [
          {
            id: Date.now(),
            name: "",
            criteria: [{ id: Date.now() + 1, name: "", weight: 0 }],
          },
        ],
      });
    } catch (err) {
      setError(err.message || "Failed to create form");
    }
  };

  return (
    <div className={styles.createFormContent}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Create Evaluation Form</h3>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        <form onSubmit={handleCreateForm} className={styles.registerForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Enter form title"
                required
                style={{ color: "#1a202c" }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Form Type *</label>
              <select
                name="formType"
                value={formData.formType}
                onChange={handleFormChange}
                required
              >
                <option value="">Select form type</option>
                {formTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Target Evaluator *</label>
              <select
                name="targetEvaluator"
                value={formData.targetEvaluator}
                onChange={handleFormChange}
                required
              >
                <option value="">Select target evaluator</option>
                {targetEvaluators.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Weight *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleFormChange}
                min="1"
                max="100"
                placeholder="Enter weight (1-100)"
                required
                style={{ color: "#1a202c" }}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Period *</label>
              <select
                name="period"
                value={formData.period}
                onChange={handleFormChange}
                required
              >
                <option value="">Select period</option>
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows={4}
              placeholder="Enter form description"
              style={{ color: "#1a202c" }}
            />
          </div>

          {/* Sections */}
          <div className={styles.sectionsContainer}>
            <h4>Sections</h4>
            {formData.sections.map((section, sectionIndex) => (
              <div key={section.id} className={styles.sectionCard}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Section Name *</label>
                    <input
                      type="text"
                      value={section.name}
                      onChange={(e) =>
                        handleSectionChange(sectionIndex, e.target.value)
                      }
                      placeholder="Enter section name"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => removeSection(sectionIndex)}
                    disabled={formData.sections.length === 1}
                  >
                    Remove Section
                  </button>
                </div>

                {/* Criteria */}
                <div className={styles.criteriaContainer}>
                  <h5>Criteria</h5>
                  {section.criteria.map((criterion, criterionIndex) => (
                    <div key={criterion.id} className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Criterion Name *</label>
                        <input
                          type="text"
                          value={criterion.name}
                          onChange={(e) =>
                            handleCriterionChange(
                              sectionIndex,
                              criterionIndex,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Enter criterion name"
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Weight *</label>
                        <input
                          type="number"
                          value={criterion.weight}
                          onChange={(e) =>
                            handleCriterionChange(
                              sectionIndex,
                              criterionIndex,
                              "weight",
                              e.target.value
                            )
                          }
                          min="1"
                          max="100"
                          placeholder="Enter weight (1-100)"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className={styles.closeButton}
                        onClick={() =>
                          removeCriterion(sectionIndex, criterionIndex)
                        }
                        disabled={section.criteria.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => addCriterion(sectionIndex)}
                  >
                    Add Criterion
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={styles.actionButton}
              onClick={addSection}
            >
              Add Section
            </button>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Create Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvaluationForm;
