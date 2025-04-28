import React, { useState, useEffect } from "react";

const DepenseForm = ({ onCancel, onSave, editData }) => {
  const [categorie, setCategorie] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [commercant, setCommercant] = useState("");
  const [fichierRecu, setFichierRecu] = useState(null);
  const [total, setTotal] = useState("");

  useEffect(() => {
    if (editData) {
      setCategorie(editData.categorie || "");
      setMontant(editData.montant || "");
      setDate(editData.date?.slice(0, 10) || "");
      setDescription(editData.description || "");
      setCommercant(editData.commercant || "");
      setFichierRecu(null);
      setTotal(editData.total || "");
    } else {
      setCategorie("");
      setMontant("");
      setDate(new Date().toISOString().slice(0, 10));
      setDescription("");
      setCommercant("");
      setFichierRecu(null);
      setTotal("");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const depense = {
      categorie,
      montant: parseFloat(montant),
      date,
      description,
      commercant,
      fichierRecu,
      total,
    };
    onSave(depense);
  };

  return (
    <div className="container mt-2 d-flex">
      {/* Partie gauche : carte formulaire */}
      <div>
        <h4 className="mb-3 fw-bold">Nouvelle dépense</h4>

        <form
          className="bg-white p-4 rounded shadow-sm"
          style={{ width: "800px", minHeight: "600px" }}
        >
          <div className="d-flex justify-content-between">
            {/* Colonne Gauche */}
            <div style={{ flex: 1, marginRight: "20px" }}>
              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                ajouter une catégorie
                <input
                  type="text"
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  value={categorie}
                  onChange={(e) => setCategorie(e.target.value)}
                />
              </div>

              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                Date 
                <input
                  type="date"
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                Ajouter un commerçant
                <input
                  type="text"
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  value={commercant}
                  onChange={(e) => setCommercant(e.target.value)}
                />
              </div>

              <div className="mb-3 text-muted" style={{ fontStyle: "italic" }}>
                Ajouter une description
                <textarea
                  className="form-control border-0 border-bottom rounded-0 ps-0"
                  style={{ backgroundColor: "transparent" }}
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>

            {/* Zone de reçu */}
            <div style={{ width: "250px" }}>
              <div
                className="border rounded bg-light d-flex align-items-center justify-content-center p-4 text-center"
                style={{ borderStyle: "dashed", height: "220px", position: "relative" }}
              >
                <div>
                  <i className="bi bi-paperclip fs-4 position-absolute top-0 end-0 me-2 mt-2"></i>
                  <p className="mb-1 text-muted">Drag receipt image here</p>
                  <label htmlFor="fileUpload" className="text-primary" style={{ cursor: "pointer" }}>
                    or select a file
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    className="form-control d-none"
                    onChange={(e) => setFichierRecu(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />
          <div className="d-flex justify-content-between align-items-center text-muted mt-3">
            <span className="fw-semibold">Grand Total (TND):</span>
            <div className="d-flex align-items-center" style={{ gap: "5px" }}>
              <input
                type="text"
                className="form-control border-0 ps-0 text-end"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                style={{
                  width: "120px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  backgroundColor: "transparent",
                }}
              />
              <span className="fw-bold">DT</span>
            </div>
          </div>
        </form>
      </div>

      {/* Partie droite : boutons extérieurs */}
      <div className="d-flex flex-column justify-content-start align-items-end ms-3 mt-5" style={{ gap: "10px" }}>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-success px-4 py-2 shadow rounded-pill"
          style={{ fontWeight: "bold", minWidth: "150px" }}
        >
          Enregistrer
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline-primary px-4 py-2 shadow-sm rounded-pill"
          style={{ fontWeight: "bold", minWidth: "150px" }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default DepenseForm;
