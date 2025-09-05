import { useState } from "react";
import api from "../../api";
import styles from "./pagesAdminDashboard.module.css";

const CreateEvaluationForm = ({ onFormCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [formType, setFormType] = useState("self_assessment");
  const [targetEvaluator, setTargetEvaluator] = useState("employee");
  const [criteria, setCriteria] = useState([
    { name: "", weight: 100, maxScore: 4 },
  ]);
  const [formWeight, setFormWeight] = useState(100);
  const [ratingScale, setRatingScale] = useState([]);
  const [teamId, setTeamId] = useState(null);
  const [periodId, setPeriodId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const periods = [
    { id: 1, name: "Q1", year: 2025 },
    { id: 2, name: "Q2", year: 2025 },
    { id: 3, name: "Q3", year: 2025 },
    { id: 4, name: "Q4", year: 2025 },
    { id: 5, name: "Mid-Year", year: 2025 },
    { id: 6, name: "Year-End", year: 2025 },
  ];

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] =
      field === "weight" || field === "maxScore" ? Number(value) : value;
    setCriteria(newCriteria);
    console.log(`Criterion #${index} updated:`, newCriteria[index]);
  };

  const addCriterion = () => {
    const newCriteria = [...criteria, { name: "", weight: 0, maxScore: 5 }];
    setCriteria(newCriteria);
    console.log("Added new criterion. Current criteria:", newCriteria);
  };

  const removeCriterion = (index) => {
    const newCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(newCriteria);
    console.log(`Removed criterion #${index}. Current criteria:`, newCriteria);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    // Validate criteria weight
    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    if (!criteria.length || totalWeight !== 100) {
      setError(
        !criteria.length
          ? "At least one criterion is required"
          : `Total criteria weight must equal 100%. Currently: ${totalWeight}%`
      );
      setLoading(false);
      return;
    }

    if (!title.trim() || !formType || !targetEvaluator || !periodId) {
      setError("All required fields must be provided");
      setLoading(false);
      return;
    }

    // Send weight instead of formWeight
    const formData = {
      title: title.trim(),
      description: description.trim(),
      formType,
      targetEvaluator,
      criteria,
      weight: formWeight, // <-- map formWeight to weight
      ratingScale: ratingScale.length ? ratingScale : [],
      team_id: teamId || null,
      period_id: periodId,
    };

    console.log("Submitting form data:", formData);

    try {
      const res = await api.createEvaluationForm(formData);

      if (res?.formId) {
        onFormCreated?.(res.formId);
        setSuccessMessage(`Form created successfully! ID: ${res.formId}`);
        setTimeout(() => setSuccessMessage(""), 3000);

        // Reset form
        setTitle("");
        setDescription("");
        setCriteria([{ name: "", weight: 100, maxScore: 5 }]);
        setFormWeight(100);
        setPeriodId("");
        setRatingScale([]);
        setTeamId(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3>Create Evaluation Form</h3>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}

      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Form Weight</label>
          <input
            type="number"
            value={formWeight}
            onChange={(e) => {
              const val = Number(e.target.value);
              setFormWeight(val);
              console.log("Form weight updated:", val);
            }}
            className={styles.formInput}
            min={1}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Form Type</label>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className={styles.formSelect}
          >
            <option value="self_assessment">Self Assessment</option>
            <option value="peer_evaluation">Peer Evaluation</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Target Evaluator</label>
          <select
            value={targetEvaluator}
            onChange={(e) => setTargetEvaluator(e.target.value)}
            className={styles.formSelect}
          >
            <option value="employee">Employee</option>
            <option value="team_leader">Team Leader</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Period</label>
          <select
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            className={styles.formSelect}
            required
          >
            <option value="">Select a period</option>
            {periods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} {p.year}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Criteria</label>
          {criteria.map((c, index) => (
            <div
              key={index}
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <input
                type="text"
                placeholder="Name"
                value={c.name}
                onChange={(e) =>
                  handleCriteriaChange(index, "name", e.target.value)
                }
                className={styles.formInput}
                required
              />
              <input
                type="number"
                placeholder="Weight"
                value={c.weight}
                onChange={(e) =>
                  handleCriteriaChange(index, "weight", e.target.value)
                }
                className={styles.formInput}
                style={{ width: "80px" }}
                min={0}
                max={100}
                required
              />
              <input
                type="number"
                placeholder="Max Score"
                value={c.maxScore}
                onChange={(e) =>
                  handleCriteriaChange(index, "maxScore", e.target.value)
                }
                className={styles.formInput}
                style={{ width: "80px" }}
                min={1}
                required
              />
              {criteria.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCriterion(index)}
                  className={styles.closeButton}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCriterion}
            className={styles.generateButton}
          >
            + Add Criterion
          </button>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Form"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvaluationForm;
