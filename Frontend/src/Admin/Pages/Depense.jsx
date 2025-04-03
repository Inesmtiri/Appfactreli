import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import DepenseForm from "../components/DepenceForm";

const DepensePage = () => {
  const [depenses, setDepenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddDepense = (depense) => {
    const newId = depenses.length + 1;
    const depenseToAdd = { id: newId, ...depense };
    setDepenses([...depenses, depenseToAdd]);
    setShowForm(false);
  };

  const handleDeleteDepense = (id) => {
    if (window.confirm("Supprimer cette dépense ?")) {
      setDepenses(depenses.filter((dep) => dep.id !== id));
    }
  };

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      {/* ✅ Titre */}

      {/* ✅ Bouton Nouvelle dépense */}
      {!showForm && (
        <div className="d-flex justify-content-end mb-4">
          <button
            className="btn fw-bold"
            onClick={() => setShowForm(true)}
            style={{
              backgroundColor: "#00B507",
              color: "white",
              padding: "8px 20px",
              borderRadius: "6px",
            }}
          >
            Nouvelle dépense
          </button>
        </div>
      )}

      {/* ✅ Formulaire */}
      {showForm && (
        <DepenseForm
          onSave={handleAddDepense}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* ✅ Liste des dépenses */}
      {!showForm && (
        <div
          className="card border-0 shadow-sm p-4"
          style={{ maxWidth: "1000px", margin: "0 auto" }}
        >
          <h6 className="fst-italic mb-3">• Liste des dépenses :</h6>

          {depenses.length === 0 ? (
            <p className="text-center text-muted">Aucune dépense enregistrée.</p>
          ) : (
            <div className="list-group">
              {depenses.map((depense, index) => (
                <div
                  key={depense.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${index % 2 === 0 ? "bg-light" : ""}`}
                  style={{
                    borderRadius: "8px",
                    border: "none",
                    padding: "12px 16px",
                  }}
                >
                  <div>
                    <div className="fw-semibold fst-italic mb-1">
                      {depense.categorie || "Sans catégorie"}
                    </div>
                    <small className="text-muted">{depense.date}</small>
                    <p className="mb-0">{depense.description || "Pas de description"}</p>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold">{parseFloat(depense.montant).toFixed(3)} TND</span>

                    <button
                      className="btn btn-link text-dark p-0"
                      onClick={() => handleDeleteDepense(depense.id)}
                      title="Supprimer cette dépense"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DepensePage;
