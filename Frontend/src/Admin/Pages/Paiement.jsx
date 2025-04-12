import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:3001/api/paiements";

const Paiement = () => {
  const [paiements, setPaiements] = useState([]);
  const [formData, setFormData] = useState({
    numeroFacture: "",
    datePaiement: "",
    typePaiement: "en ligne",
    montant: "",
    statut: true,
  });
  const [editId, setEditId] = useState(null);

  const fetchPaiements = async () => {
    try {
      const res = await axios.get(API_URL);
      setPaiements(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des paiements :", err);
    }
  };

  useEffect(() => {
    fetchPaiements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatutToggle = () => {
    setFormData((prev) => ({ ...prev, statut: !prev.statut }));
  };

  const handleAddOrEditPaiement = async (e) => {
    e.preventDefault();

    if (!formData.numeroFacture || !formData.montant) {
      alert("Veuillez remplir les champs obligatoires !");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchPaiements();
      resetForm();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer ce paiement ?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPaiements();
        if (editId === id) resetForm();
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    }
  };

  const handleEdit = (paiement) => {
    setEditId(paiement._id);
    setFormData({ ...paiement });
  };

  const resetForm = () => {
    setFormData({
      numeroFacture: "",
      datePaiement: "",
      typePaiement: "en ligne",
      montant: "",
      statut: true,
    });
    setEditId(null);
  };

  return (
    <div className="container py-4">
      {/* Formulaire */}
      <div className="p-4 bg-white rounded shadow-sm mb-4 mx-auto" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-4 fw-bold text-dark">
          <i className="bi bi-plus-circle me-2"></i>
          {editId ? "Modifier le paiement" : "Ajouter un paiement"}
        </h5>

        <form onSubmit={handleAddOrEditPaiement} className="d-flex flex-wrap align-items-end gap-3">
          <div className="flex-grow-1">
            <label className="form-label">Numéro de facture</label>
            <input
              type="text"
              name="numeroFacture"
              value={formData.numeroFacture}
              onChange={handleChange}
              className="form-control"
              placeholder="00001"
              required
            />
          </div>

          <div className="flex-grow-1">
            <label className="form-label">Date de paiement</label>
            <input
              type="date"
              name="datePaiement"
              value={formData.datePaiement?.slice(0, 10) || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="flex-grow-1">
            <label className="form-label">Type de paiement</label>
            <select
              name="typePaiement"
              value={formData.typePaiement}
              onChange={handleChange}
              className="form-select"
            >
              <option value="en ligne">En ligne</option>
              <option value="hors ligne">Hors ligne</option>
            </select>
          </div>

          <div className="flex-grow-1">
            <label className="form-label">Montant (TND)</label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              className="form-control"
              placeholder="0"
              required
            />
          </div>

          <div className="d-flex flex-column justify-content-between" style={{ minWidth: "150px" }}>
            <label className="form-label">Statut</label>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="statutSwitch"
                checked={formData.statut}
                onChange={handleStatutToggle}
              />
              <label className="form-check-label" htmlFor="statutSwitch">
                {formData.statut ? "Payé" : "Non payé"}
              </label>
            </div>
          </div>

          <div className="d-flex flex-column justify-content-between">
            <label className="form-label invisible">Actions</label>
            <div className="d-flex gap-2">
              <button
                type="submit"
                className={`btn ${editId ? "btn-warning" : "btn-success"} px-4`}
              >
                <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-circle"} me-1`}></i>
                {editId ? "Modifier" : "Ajouter"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={resetForm}
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Liste des paiements */}
      <div className="p-4 bg-white rounded shadow-sm mx-auto" style={{ maxWidth: "1000px" }}>
        <h5 className="mb-3 fw-bold text-dark">
          <i className="bi bi-list-check me-2"></i>
          Liste des paiements
        </h5>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Facture</th>
                <th>Date</th>
                <th>Type</th>
                <th>Montant</th>
                <th>Statut</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paiements.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Aucun paiement trouvé.
                  </td>
                </tr>
              ) : (
                paiements.map((p) => (
                  <tr key={p._id}>
                    <td><i className="bi bi-receipt text-success me-1"></i> {p.numeroFacture}</td>
                    <td>{p.datePaiement ? new Date(p.datePaiement).toLocaleDateString() : "-"}</td>
                    <td>{p.typePaiement || "-"}</td>
                    <td>{p.montant} TND</td>
                    <td>
                      <span className={`badge ${p.statut ? "bg-success" : "bg-danger"}`}>
                        <i className={`bi ${p.statut ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-1`}></i>
                        {p.statut ? "Payé" : "Non payé"}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(p)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Paiement;
