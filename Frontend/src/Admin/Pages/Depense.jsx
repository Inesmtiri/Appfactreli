import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import DepenseForm from "../components/DepenceForm";
import axios from "axios";

const DepensePage = () => {
  const [depenses, setDepenses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // 📦 Charger les dépenses depuis le backend
  const fetchDepenses = async () => {
    try {
      const res = await axios.get("/api/depenses");
      setDepenses(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des dépenses :", err);
    }
  };

  useEffect(() => {
    fetchDepenses();
  }, []);

  // ➕ Ajouter une dépense
  const handleAddDepense = async (depense) => {
    try {
      const res = await axios.post("/api/depenses", depense);
      setDepenses([res.data, ...depenses]); // ajouter en haut
      setShowForm(false);
    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
    }
  };

  // ❌ Supprimer une dépense
  const handleDeleteDepense = async (id) => {
    if (window.confirm("Supprimer cette dépense ?")) {
      try {
        await axios.delete(`/api/depenses/${id}`);
        setDepenses(depenses.filter((dep) => dep._id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    }
  };

  return (
    <div className="container py-4">
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
          onCancel={() => setShowForm(false)}
          onSave={handleAddDepense}
        />
      )}

      {/* ✅ Liste des dépenses */}
      {!showForm && (
        <div className="card border-0 shadow-sm p-4 mx-auto" style={{ maxWidth: "900px" }}>
          <h6 className="fst-italic mb-3">• Liste des dépenses :</h6>

          {depenses.length === 0 ? (
            <p className="text-center text-muted">Aucune dépense enregistrée.</p>
          ) : (
            <div className="list-group">
              {depenses.map((depense, index) => (
                <div
                  key={depense._id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${index % 2 === 0 ? "bg-light" : ""}`}
                  style={{
                    borderRadius: "8px",
                    border: "none",
                    padding: "12px 16px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <div className="fw-semibold fst-italic mb-1">
                      {depense.categorie || "Sans catégorie"}
                    </div>
                    <small className="text-muted">{new Date(depense.date).toLocaleDateString()}</small>
                    <p className="mb-0">{depense.description || "Pas de description"}</p>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold">
                      {parseFloat(depense.montant).toFixed(3)} TND
                    </span>
                    <button
                      className="btn btn-link text-dark p-0"
                      onClick={() => handleDeleteDepense(depense._id)}
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
