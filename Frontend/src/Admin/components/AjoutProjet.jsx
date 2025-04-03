import React, { useState } from "react";
import axios from "axios";
import GestionMembers from "./GestionMembers";

const AjoutProjet = ({ onCreate, onClose }) => {
  const [formData, setFormData] = useState({
    nom: "",
    budget: "",
    services: "",
    dateDebut: "",
    dateFin: "",
    totalHeures: "",
    client: "",
    statut: "en cours",
  });

  const [equipe, setEquipe] = useState([
    { id: 1, nom: "IM" },
    { id: 2, nom: "AM" },
  ]);

  const [hoveredMemberId, setHoveredMemberId] = useState(null);
  const [showGestionMembers, setShowGestionMembers] = useState(false);

  const clients = ["Client A", "Client B", "Client C"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      statut: e.target.checked ? "en cours" : "terminé",
    });
  };

  const handleDeleteMember = (id) => {
    const updatedEquipe = equipe.filter((member) => member.id !== id);
    setEquipe(updatedEquipe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.budget || !formData.services) {
      alert("Remplis tous les champs !");
      return;
    }

    const nouveauProjet = {
      ...formData,
      equipe,
    };

    try {
      const res = await axios.post("http://localhost:3001/api/projets", nouveauProjet);
      alert("✅ Projet créé avec succès !");
      onCreate(res.data); // pour le parent Projets.jsx
      onClose(); // Fermer le formulaire
    } catch (error) {
      console.error("❌ Erreur lors de la création :", error.response?.data || error.message);
      alert("Erreur lors de l'enregistrement du projet !");
    }
  };

  return (
    <>
      {showGestionMembers && (
        <GestionMembers
          equipe={equipe}
          onUpdateEquipe={setEquipe}
          onClose={() => setShowGestionMembers(false)}
        />
      )}

      <div className="d-flex justify-content-center align-items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1050,
        }}
      >
        <div
          className="card p-5"
          style={{
            width: "1000px",
            maxWidth: "95%",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Titre */}
          <div className="text-center mb-4">
            <i className="bi bi-layers fs-1" style={{ color: "#167DB8" }}></i>
            <h2 className="mt-2">Nouveau projet</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Équipe */}
            <div className="mb-4">
              <label className="fw-bold mb-2">Membres de l'équipe :</label>
              <div className="d-flex flex-wrap gap-2">
                {equipe.map((member) => (
                  <div
                    key={member.id}
                    className="position-relative d-flex justify-content-center align-items-center bg-light border rounded-circle"
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredMemberId(member.id)}
                    onMouseLeave={() => setHoveredMemberId(null)}
                  >
                    {hoveredMemberId === member.id ? (
                      <i
                        className="bi bi-trash-fill text-danger fs-5"
                        onClick={() => handleDeleteMember(member.id)}
                        style={{ cursor: "pointer" }}
                        title="Supprimer le membre"
                      ></i>
                    ) : (
                      <i
                        className="bi bi-person-fill fs-4"
                        style={{ color: "#167DB8" }}
                        title={member.nom}
                      ></i>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowGestionMembers(true)}
                  className="btn btn-outline-primary rounded-circle d-flex justify-content-center align-items-center"
                  style={{ width: "50px", height: "50px" }}
                  title="Ajouter un membre"
                >
                  <i className="bi bi-plus-lg"></i>
                </button>
              </div>
            </div>

            {/* Infos projet */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Nom du projet :</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="fw-bold">Budget :</label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="fw-bold">Services :</label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <label className="fw-bold">Date de début :</label>
                <input
                  type="date"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="fw-bold">Date limite prévue :</label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="fw-bold">Total heures estimées :</label>
                <input
                  type="number"
                  name="totalHeures"
                  value={formData.totalHeures}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="fw-bold">Assigner à un client :</label>
              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">-- Sélectionner un client --</option>
                {clients.map((client, index) => (
                  <option key={index} value={client}>
                    {client}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="fw-bold mb-2">Statut du projet :</label>
              <div className="form-check form-switch d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={formData.statut === "en cours"}
                  onChange={handleCheckboxChange}
                />
                <label className="form-check-label ms-2 fw-bold">
                  {formData.statut === "en cours" ? "Terminé" : "En cours"}
                </label>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={onClose}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-success btn-vert px-4">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AjoutProjet;
