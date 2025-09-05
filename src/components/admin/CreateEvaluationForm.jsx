import styles from "../../pages/AdminDashboard.module.css";
import { useState, useEffect } from "react";
import api from "../../api";

const CreateEvaluationForm = ({ departments }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    formType: "",
    targetEvaluator: "",
    period: "",
    sections: [
      {
        id: Date.now(),
        name: "",
        criteria: [{ id: Date.now() + 1, name: "", weight: 100, maxScore: 5 }],
      },
    ],
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalWeight, setTotalWeight] = useState(100);

  const formTypes = ["self_assessment", "peer_evaluation"];
  const targetEvaluators = ["employee", "peer", "manager"];
  const periods = [
    "Q1 2025",
    "Q2 2025",
    "Q3 2025",
    "Q4 2025",
    "Mid-Year 2025",
    "Year-End 2025",
  ];

  // --- Calculate total weight dynamically ---
  useEffect(() => {
    let sum = 0;
    formData.sections.forEach((s) =>
      s.criteria.forEach((c) => (sum += parseFloat(c.weight || 0)))
    );
    setTotalWeight(sum);
  }, [formData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSectionChange = (sectionIndex, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].name = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleCriterionChange = (
    sectionIndex,
    criterionIndex,
    field,
    value
  ) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].criteria[criterionIndex][field] =
      field === "weight" || field === "maxScore"
        ? parseFloat(value || 0)
        : value;
    setFormData({ ...formData, sections: newSections });
  };

  // --- Add/Remove Sections & Criteria ---
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: Date.now(),
          name: "",
          criteria: [
            { id: Date.now() + 1, name: "", weight: 100, maxScore: 5 },
          ],
        },
      ],
    }));
  };

  const removeSection = (sectionIndex) => {
    if (formData.sections.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sectionIndex),
    }));
  };

  const addCriterion = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].criteria.push({
      id: Date.now(),
      name: "",
      weight: 0,
      maxScore: 5,
    });
    setFormData({ ...formData, sections: newSections });
  };

  const removeCriterion = (sectionIndex, criterionIndex) => {
    const newSections = [...formData.sections];
    if (newSections[sectionIndex].criteria.length === 1) return;
    newSections[sectionIndex].criteria.splice(criterionIndex, 1);
    setFormData({ ...formData, sections: newSections });
  };

  // --- Submit Form ---
  const handleCreateForm = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.formType ||
      !formData.targetEvaluator ||
      !formData.period
    ) {
      setError("All required fields must be provided");
      return;
    }

    if (formData.sections.some((s) => !s.name || s.criteria.length === 0)) {
      setError("Each section must have a name and at least one criterion");
      return;
    }

    if (
      formData.sections.some((s) =>
        s.criteria.some((c) => !c.name || c.weight <= 0 || c.maxScore <= 0)
      )
    ) {
      setError("All criteria must have a name, weight > 0, and maxScore > 0");
      return;
    }

    if (totalWeight !== 100) {
      setError("Total weight of all criteria must equal 100%");
      return;
    }

    try {
      const payload = { ...formData, weight: 100 };
      const response = await api.createEvaluationForm(payload);
      setSuccess(response.message || "Form created successfully");

      setFormData({
        title: "",
        description: "",
        formType: "",
        targetEvaluator: "",
        period: "",
        sections: [
          {
            id: Date.now(),
            name: "",
            criteria: [
              { id: Date.now() + 1, name: "", weight: 100, maxScore: 5 },
            ],
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
                required
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
                <option value="">Select type</option>
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
                <option value="">Select target</option>
                {targetEvaluators.map((t) => (
                  <option key={t} value={t}>
                    {t.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Period *</label>
              <select
                name="period"
                value={formData.period}
                onChange={handleFormChange}
                required
              >
                <option value="">Select period</option>
                {periods.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
            />
          </div>

          <div className={styles.sectionsContainer}>
            <h4>Sections</h4>
            {formData.sections.map((section, sIndex) => (
              <div key={section.id} className={styles.sectionCard}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Section Name *</label>
                    <input
                      type="text"
                      value={section.name}
                      onChange={(e) =>
                        handleSectionChange(sIndex, e.target.value)
                      }
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSection(sIndex)}
                    disabled={formData.sections.length === 1}
                  >
                    Remove Section
                  </button>
                </div>

                {section.criteria.map((c, cIndex) => (
                  <div key={c.id} className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Criterion Name *</label>
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) =>
                          handleCriterionChange(
                            sIndex,
                            cIndex,
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
                        value={c.weight}
                        onChange={(e) =>
                          handleCriterionChange(
                            sIndex,
                            cIndex,
                            "weight",
                            e.target.value
                          )
                        }
                        min="1"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Max Score *</label>
                      <input
                        type="number"
                        value={c.maxScore}
                        onChange={(e) =>
                          handleCriterionChange(
                            sIndex,
                            cIndex,
                            "maxScore",
                            e.target.value
                          )
                        }
                        min="1"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCriterion(sIndex, cIndex)}
                      disabled={section.criteria.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addCriterion(sIndex)}>
                  Add Criterion
                </button>
              </div>
            ))}
            <button type="button" onClick={addSection}>
              Add Section
            </button>
            <div
              style={{
                marginTop: "10px",
                color: totalWeight !== 100 ? "red" : "green",
              }}
            >
              Total Weight: {totalWeight}%
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit">Create Form</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvaluationForm;
