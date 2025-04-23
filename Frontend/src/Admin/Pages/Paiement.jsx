import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:3001/api/paiements";

const Paiement = () => {
  const [paiements, setPaiements] = useState([]);
  const [factures, setFactures] = useState([]);
  const [formData, setFormData] = useState({
    facture: "",
    datePaiement: "",
    typePaiement: "en ligne",
    montant: "",
  });
  const [editId, setEditId] = useState(null);
  const [montantRestant, setMontantRestant] = useState(0);

  const fetchPaiements = async () => {
    try {
      const res = await axios.get(API_URL);
      setPaiements(res.data);
    } catch (err) {
      console.error("Erreur chargement paiements :", err);
    }
  };

  const fetchFactures = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/factures");
      setFactures(res.data);
    } catch (err) {
      console.error("Erreur chargement factures :", err);
    }
  };

  useEffect(() => {
    fetchPaiements();
    fetchFactures();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // ⚠️ Si la facture change, on met à jour le montant restant
    if (name === "facture") {
      const selected = factures.find((f) => f._id === value);
      setMontantRestant(selected ? selected.montantRestant : 0);
    }
  };

  const handleAddOrEditPaiement = async (e) => {
    e.preventDefault();
    if (!formData.facture || !formData.montant) {
      alert("Veuillez remplir les champs obligatoires !");
      return;
    }

    if (parseFloat(formData.montant) > montantRestant) {
      alert("❌ Le montant payé dépasse le montant restant !");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      alert("✅ Paiement enregistré !");
      fetchPaiements();
      fetchFactures();
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
        console.error("Erreur suppression :", err);
      }
    }
  };

  const handleEdit = (paiement) => {
    setEditId(paiement._id);
    setFormData({
      facture: paiement.facture?._id || paiement.facture,
      datePaiement: paiement.datePaiement?.slice(0, 10) || "",
      typePaiement: paiement.typePaiement || "en ligne",
      montant: paiement.montant,
    });
    setMontantRestant(paiement.facture?.montantRestant || 0);
  };

  const resetForm = () => {
    setFormData({
      facture: "",
      datePaiement: "",
      typePaiement: "en ligne",
      montant: "",
    });
    setEditId(null);
    setMontantRestant(0);
  };

  const handlePaiementSuivant = () => {
    const factureNonPayee = factures.find((f) => f.statut !== "payé");
    if (factureNonPayee) {
      setFormData({
        facture: factureNonPayee._id,
        datePaiement: new Date().toISOString().slice(0, 10),
        typePaiement: "en ligne",
        montant: factureNonPayee.montantRestant,
      });
      setMontantRestant(factureNonPayee.montantRestant);
    } else {
      alert("🎉 Toutes les factures sont réglées !");
    }
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
            <label className="form-label">Facture</label>
            <select
              name="facture"
              value={formData.facture}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Choisir une facture --</option>
              {factures.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.numeroFacture} - {f.nomEntreprise || "Client"} - {f.total} TND
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow-1">
            <label className="form-label">Date de paiement</label>
            <input
              type="date"
              name="datePaiement"
              value={formData.datePaiement}
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
            <label className="form-label">Montant à payer (TND)</label>
            <input
              type="number"
              name="montant"
              value={formData.montant}
              onChange={handleChange}
              className="form-control"
              placeholder="0"
              required
            />
            {montantRestant > 0 && (
              <div className="text-muted mt-1 small">
                💡 Reste à payer : <strong>{montantRestant.toFixed(3)} TND</strong>
              </div>
            )}
          </div>

          <div className="d-flex flex-column justify-content-end">
            <label className="form-label invisible">Actions</label>
            <div className="d-flex gap-2">
              <button type="submit" className={`btn ${editId ? "btn-warning" : "btn-success"} px-4`}>
                <i className={`bi ${editId ? "bi-pencil-square" : "bi-plus-circle"} me-1`}></i>
                {editId ? "Modifier" : "Ajouter"}
              </button>
              {editId && (
                <button type="button" className="btn btn-secondary px-4" onClick={resetForm}>
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
                <th>Total</th>
                <th>Montant paiement</th>
                <th>Payé</th>
                <th>Restant</th>
                <th>Statut</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paiements.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center text-muted">Aucun paiement trouvé.</td>
                </tr>
              ) : (
                paiements.map((p) => (
                  <tr key={p._id}>
                    <td>{p.facture?.numeroFacture || "–"}</td>
                    <td>{p.datePaiement ? new Date(p.datePaiement).toLocaleDateString() : "-"}</td>
                    <td>{p.typePaiement || "-"}</td>
                    <td>{p.facture?.total || 0} TND</td>
                    <td>{p.montant} TND</td>
                    <td>{p.facture?.montantPaye || 0} TND</td>
                    <td>{p.facture?.montantRestant || 0} TND</td>
                    <td>
                      <span className={`badge ${
                        p.facture?.statut === "payé" ? "bg-success" :
                        p.facture?.statut === "partiellement payé" ? "bg-warning text-dark" :
                        "bg-danger"
                      }`}>
                        {p.facture?.statut || "–"}
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
