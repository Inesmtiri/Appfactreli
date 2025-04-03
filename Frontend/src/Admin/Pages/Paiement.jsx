import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Paiement = () => {
  const [paiements, setPaiements] = useState([
    { id: 1, facture: "00001", datePaiement: "10/5/2024", typePaiement: "en ligne", montant: 500, statut: "payé" },
    { id: 2, facture: "00002", datePaiement: "-", typePaiement: "-", montant: 800, statut: "non payé" },
    { id: 3, facture: "00003", datePaiement: "22/7/2023", typePaiement: "hors ligne", montant: 300, statut: "payé" },
  ]);

  const [formData, setFormData] = useState({
    facture: "",
    datePaiement: "",
    typePaiement: "",
    montant: "",
    statut: "payé",
  });

  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStatutToggle = () => {
    setFormData({
      ...formData,
      statut: formData.statut === "payé" ? "non payé" : "payé",
    });
  };

  const handleAddOrEditPaiement = (e) => {
    e.preventDefault();

    if (!formData.facture || !formData.montant) {
      alert("Veuillez remplir les champs obligatoires !");
      return;
    }

    if (editId) {
      const updatedPaiements = paiements.map((p) =>
        p.id === editId ? { ...p, ...formData } : p
      );
      setPaiements(updatedPaiements);
      setEditId(null);
    } else {
      const nouveauPaiement = {
        id: paiements.length + 1,
        ...formData,
      };
      setPaiements([...paiements, nouveauPaiement]);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous supprimer ce paiement ?")) {
      setPaiements(paiements.filter((p) => p.id !== id));
      if (editId === id) {
        resetForm();
      }
    }
  };

  const handleEdit = (paiement) => {
    setEditId(paiement.id);
    setFormData({ ...paiement });
  };

  const resetForm = () => {
    setFormData({
      facture: "",
      datePaiement: "",
      typePaiement: "",
      montant: "",
      statut: "payé",
    });
    setEditId(null);
  };

  return (
    <div style={{ marginLeft: "250px", padding: "20px" }}>

      {/* Formulaire */}
      <div
        className="p-4 bg-white rounded shadow-sm mb-4"
        style={{ maxWidth: "1200px" }} // Agrandi à 1200px
      >
        <h5 className="mb-4 fw-bold text-primary">
          {editId ? "Modifier le paiement" : "Ajouter un paiement"}
        </h5>

        <form onSubmit={handleAddOrEditPaiement} className="d-flex flex-wrap align-items-end gap-3">

          <div className="flex-grow-1">
            <label className="form-label">Numéro de facture</label>
            <input
              type="text"
              name="facture"
              value={formData.facture}
              onChange={handleChange}
              className="form-control"
              placeholder="00001"
            />
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
              <option value="">Choisir</option>
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
            />
          </div>

          <div className="d-flex flex-column justify-content-between" style={{ minWidth: "160px" }}>
            <label className="form-label">Statut</label>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="statutSwitch"
                checked={formData.statut === "payé"}
                onChange={handleStatutToggle}
              />
              <label className="form-check-label" htmlFor="statutSwitch">
                {formData.statut === "payé" ? "Payé" : "Non payé"}
              </label>
            </div>
          </div>

          <div className="d-flex flex-column justify-content-between">
            <label className="form-label invisible">Actions</label>
            <div className="d-flex gap-2">
              <button
                type="submit"
                className={`btn ${editId ? "btn-warning" : "btn-vert"} px-4`}
              >
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
      <div
        className="p-4 bg-white rounded shadow-sm"
        style={{ maxWidth: "1200px" }} // Idem ici, pour rester cohérent
      >
        <h5 className="mb-3 fw-bold text-primary">Liste des paiements</h5>

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
                <tr key={p.id}>
                  <td><i className="bi bi-receipt text-success me-1"></i> {p.facture}</td>
                  <td>{p.datePaiement || "-"}</td>
                  <td>{p.typePaiement || "-"}</td>
                  <td>{p.montant} TND</td>
                  <td>
                    <span className={`badge ${p.statut === "payé" ? "bg-success" : "bg-danger"}`}>
                      {p.statut}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(p)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                    >
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
  );
};

export default Paiement;
