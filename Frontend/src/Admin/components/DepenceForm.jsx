import React, { useState, useEffect } from "react";

const DepenseForm = ({ onCancel, onSave, editData }) => {
  const [categorie, setCategorie] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editData) {
      setCategorie(editData.categorie || "");
      setMontant(editData.montant || "");
      setDate(editData.date?.slice(0, 10) || "");
      setDescription(editData.description || "");
    } else {
      setCategorie("");
      setMontant("");
      setDate(new Date().toISOString().slice(0, 10));
      setDescription("");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const depense = {
      categorie,
      montant: parseFloat(montant),
      date,
      description,
    };

    onSave(depense);
  };

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <div className="card-body p-4">
        <h5 className="mb-4">{editData ? "Modifier la dépense" : "Nouvelle dépense"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Catégorie</label>
            <input
              type="text"
              className="form-control"
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Montant</label>
            <input
              type="number"
              step="0.001"
              className="form-control"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Annuler
            </button>
            <button
              type="submit"
              className="btn fw-bold"
              style={{
                backgroundColor: "#00B507",
                color: "white",
                padding: "8px 20px",
                borderRadius: "6px",
              }}
            >
              {editData ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepenseForm;
