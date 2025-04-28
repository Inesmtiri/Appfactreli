import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import DepenseForm from "../components/DepenceForm";
import axios from "axios";

const DepensePage = () => {
  const [depenses, setDepenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // 📦 Charger les dépenses
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

  // ➕ Ajouter ou modifier une dépense
  const handleSaveDepense = async (depense) => {
    try {
      // Nettoyage des données avant envoi
      const cleanedDepense = {
        categorie: depense.categorie,
        montant: parseFloat(depense.total),
        date: depense.date,
        description: depense.description,
        commercant: depense.commercant,
        image: depense.fichierRecu || "", // base64
      };

      if (editData) {
        // Mode édition
        const res = await axios.put(`/api/depenses/${editData._id}`, cleanedDepense);
        setDepenses(
          depenses.map((d) => (d._id === editData._id ? res.data : d))
        );
      } else {
        // Nouvelle dépense
        const res = await axios.post("/api/depenses", cleanedDepense);
        setDepenses([res.data, ...depenses]);
      }

      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      if (err.response) {
        console.error("Message backend :", err.response.data);
      }
    }
  };

  // ✏️ Modifier une dépense
  const handleEditDepense = (depense) => {
    setEditData(depense);
    setShowForm(true);
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
            onClick={() => {
              setEditData(null);
              setShowForm(true);
            }}
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
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
          onSave={handleSaveDepense}
          editData={editData}
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
                    <small className="text-muted">
                      {new Date(depense.date).toLocaleDateString()}
                    </small>
                    <p className="mb-0">{depense.description || "Pas de description"}</p>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold">
                      {parseFloat(depense.montant).toFixed(3)} TND
                    </span>
                    <button
                      className="btn btn-link text-primary p-0"
                      onClick={() => handleEditDepense(depense)}
                      title="Modifier"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      className="btn btn-link text-dark p-0"
                      onClick={() => handleDeleteDepense(depense._id)}
                      title="Supprimer"
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
