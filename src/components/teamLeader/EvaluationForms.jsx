import { useState } from "react";
import api from "../../api";
import styles from "../../pages/TeamLeaderDashboard.module.css";

const EvaluationForms = ({
  evaluations,
  departments,
  setError,
  setSuccess,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    formType: "",
    targetEvaluator: "",
    weight: "",
    sections: [
      {
        id: Date.now(),
        name: "",
        criteria: [{ id: Date.now(), name: "", weight: 0 }],
      },
    ],
    ratingScale: [],
  });

  const formTypes = ["self_assessment", "peer_evaluation"];
  const targetEvaluators = ["employee", "peer", "manager"];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (sectionIndex, value) => {
    setFormData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex].name = value;
      return { ...prev, sections: newSections };
    });
  };

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

  const removeSection = (sectionIndex) => {
    if (formData.sections.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex),
    }));
  };

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

  const handleRatingScaleChange = (e) => {
    const value = e.target.value;
    const scale = value
      .split(",")
      .map((item, index) => ({ label: item.trim(), value: index + 1 }))
      .filter((s) => s.label);
    setFormData((prev) => ({ ...prev, ratingScale: scale }));
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (
        !formData.title ||
        !formData.formType ||
        !formData.targetEvaluator ||
        !formData.weight
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
      await api.createEvaluationForm(formData);
      setSuccess("Evaluation form created successfully!");
      setFormData({
        title: "",
        description: "",
        formType: "",
        targetEvaluator: "",
        weight: "",
        sections: [
          {
            id: Date.now(),
            name: "",
            criteria: [{ id: Date.now(), name: "", weight: 0 }],
          },
        ],
        ratingScale: [],
      });
    } catch (error) {
      setError(error.message || "Failed to create evaluation form");
    }
  };

  return (
    <section className={styles.evaluationSection}>
      <h3 className={styles.sectionTitle}>Create Evaluation Form</h3>
      <div className={styles.formCard}>
        <form onSubmit={handleCreateForm}>
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
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
              <option value="">Select Form Type</option>
              {formTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Target Evaluator *</label>
            <select
              name="targetEvaluator"
              value={formData.targetEvaluator}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Target Evaluator</option>
              {targetEvaluators.map((evaluator) => (
                <option key={evaluator} value={evaluator}>
                  {evaluator.toUpperCase()}
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
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>
              Rating Scale (comma-separated, e.g., Poor,Good,Excellent)
            </label>
            <input
              type="text"
              value={formData.ratingScale.map((s) => s.label).join(",")}
              onChange={handleRatingScaleChange}
            />
          </div>
          <div className={styles.sectionsContainer}>
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
          <button type="submit" className={styles.submitButton}>
            Create Form
          </button>
        </form>
      </div>
      <h3 className={styles.sectionTitle}>Existing Forms</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Target Evaluator</th>
              <th>Weight</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evalItem) => (
              <tr key={evalItem.id}>
                <td>{evalItem.title}</td>
                <td>{evalItem.formType}</td>
                <td>{evalItem.targetEvaluator}</td>
                <td>{evalItem.weight}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default EvaluationForms;
