import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AjoutProjet from "../components/AjoutProjet";

const Projets = () => {
  const [projets, setProjets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProjet, setEditingProjet] = useState(null);

  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // 🔁 Récupération des projets
  const fetchProjets = useCallback(() => {
    axios.get(`${BASE_URL}/api/projets`)
      .then(res => setProjets(res.data))
      .catch(err => console.error("Erreur de chargement des projets", err));
  }, [BASE_URL]);

  useEffect(() => {
    fetchProjets();
  }, [fetchProjets]);

  // 🗑️ Supprimer
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer ce projet ?")) {
      await axios.delete(`${BASE_URL}/api/projets/${id}`);
      setProjets(projets.filter(projet => projet._id !== id));
    }
  };

  // ➕ ou ✏️ Ajouter / Modifier
  const handleCreateOrEditProjet = async (projetData) => {
    try {
      if (editingProjet) {
        const res = await axios.put(`${BASE_URL}/api/projets/${editingProjet._id}`, projetData);
        setProjets(projets.map(p => (p._id === editingProjet._id ? res.data : p)));
      } else {
        await axios.post(`${BASE_URL}/api/projets`, projetData);
        fetchProjets(); // 🔁 Recharge la liste après ajout
      }

      setEditingProjet(null);
      setShowForm(false);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const handleEdit = (projet) => {
    setEditingProjet(projet);
    setShowForm(true);
  };

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-vert" onClick={() => {
          setEditingProjet(null);
          setShowForm(true);
        }}>
          <i className="bi bi-plus-circle me-1"></i> Créer
        </button>
      </div>

      <div className="p-4 bg-white rounded shadow-sm" style={{ maxWidth: "1200px", width: "100%", margin: "0 auto" }}>
        <h5 className="mb-4">Mes projets :</h5>

        {projets.length === 0 ? (
          <p className="text-muted">Aucun projet disponible.</p>
        ) : (
          projets.map((projet) => (
            <div key={projet._id} className="d-flex justify-content-between align-items-center bg-light mb-3 px-4 py-3 rounded"
              style={{
                border: "1px solid #eee",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                width: "100%",
                minHeight: "70px",
              }}>
              <div className="d-flex align-items-center">
                <i className="bi bi-layers fs-4 me-3"></i>
                <span className="fw-semibold fs-5">{projet.nom}</span>
              </div>

              <div className="d-flex align-items-center">
                <span className={`badge me-4 px-3 py-2 rounded-pill ${
                  projet.statut === "en cours" ? "bg-warning text-dark" : "bg-danger"
                }`}>
                  {projet.statut}
                </span>

                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEdit(projet)}>
                  <i className="bi bi-pencil-square"></i>
                </button>

                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(projet._id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <AjoutProjet
          onCreate={handleCreateOrEditProjet}
          onClose={() => {
            setShowForm(false);
            setEditingProjet(null);
          }}
          projetToEdit={editingProjet} // ✅ passe les données pour la modification
        />
      )}
    </div>
  );
};

export default Projets;
