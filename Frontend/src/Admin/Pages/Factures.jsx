import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import FactureForm from "../components/Facture/FactureForm";

const FacturePage = () => {
  const [factureList, setFactureList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const res = await axios.get("/api/factures");
      setFactureList(res.data);
    } catch (err) {
      console.error("Erreur chargement factures :", err.message);
    }
  };

  const handleAddFacture = async (facture) => {
    try {
      if (editData) {
        const res = await axios.put(`/api/factures/${editData._id}`, facture);
        setFactureList(prev => prev.map(f => f._id === editData._id ? res.data : f));
      } else {
        const res = await axios.post("/api/factures", facture);
        setFactureList(prev => [...prev, res.data]);
      }
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Erreur ajout/modif facture :", err.message);
    }
  };

  const handleDeleteFacture = async (id) => {
    try {
      await axios.delete(`/api/factures/${id}`);
      setFactureList(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      console.error("Erreur suppression facture :", err.message);
    }
  };

  const handleToggleStatut = async (id, statutActuel) => {
    try {
      const nouveauStatut = statutActuel === "payé" ? "non payé" : "payé";
      await axios.put(`/api/factures/${id}`, { statut: nouveauStatut });
      const updated = factureList.map(f =>
        f._id === id ? { ...f, statut: nouveauStatut } : f
      );
      setFactureList(updated);
    } catch (err) {
      console.error("Erreur statut :", err.message);
    }
  };

  const handleViewFacture = (facture) => {
    const clientNom = facture.client?.nom || facture.client?.societe || facture.client;
    const factureHTML = `
      <html><head><title>Facture ${facture.numeroFacture}</title>
      <style>
        body { font-family: Arial; margin: 40px; }
        h1 { text-align: center; color: #167DB8; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        .totals { text-align: right; margin-top: 20px; }
      </style>
      </head><body>
        <h1>${facture.nomEntreprise || "Nom Entreprise"}</h1>
        <p><strong>Téléphone:</strong> ${facture.telephone || "-"}</p>
        <p><strong>Client:</strong> ${clientNom}</p>
        <p><strong>Date:</strong> ${facture.date?.slice(0, 10) || "-"}</p>
        <p><strong>Numéro:</strong> ${facture.numeroFacture}</p>
        <p><strong>Référence:</strong> ${facture.reference}</p>

        <table><thead><tr>
          <th>Description</th><th>Quantité</th><th>Prix U</th><th>Total</th>
        </tr></thead><tbody>
        ${facture.lignes.map(l => `
          <tr>
            <td>${l.designation}</td>
            <td>${l.quantite}</td>
            <td>${l.prixUnitaire.toFixed(3)} TND</td>
            <td>${(l.quantite * l.prixUnitaire).toFixed(3)} TND</td>
          </tr>`).join("")}
        </tbody></table>

        <div class="totals">
          <p><strong>Subtotal:</strong> ${facture.subtotal?.toFixed(3)} TND</p>
          <p><strong>Tax:</strong> ${facture.tax?.toFixed(3)} TND</p>
          <h3><strong>Total:</strong> ${facture.total?.toFixed(3)} TND</h3>
        </div>
      </body></html>
    `;

    const win = window.open("", "_blank", "width=800,height=600");
    win.document.write(factureHTML);
    win.document.close();
    win.print();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn fw-bold"
          style={{ backgroundColor: "#23BD15", color: "white" }}
          onClick={() => {
            setEditData(null);
            setShowForm(true);
          }}
        >
          Ajouter
        </button>
      </div>

      {showForm && (
        <FactureForm
          onAddFacture={handleAddFacture}
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}

      {!showForm && (
        <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "900px" }}>
          <h6 className="mb-3 fst-italic">• Mes factures :</h6>
          {factureList.length === 0 ? (
            <p className="text-center text-muted">Aucune facture pour l’instant.</p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {factureList.map((facture) => (
                <div
                  key={facture._id}
                  className="d-flex justify-content-between align-items-center border rounded px-4 py-3 bg-light"
                  onClick={() => handleViewFacture(facture)}
                >
                  <div>
                    <span className="fw-semibold fst-italic">
                      {(facture.client?.nom || facture.client?.societe || "Client")} - {facture.numeroFacture}
                    </span>
                    
                  </div>

                  <div className="d-flex gap-2">
                    
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditData(facture);
                        setShowForm(true);
                      }}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-link text-dark p-0"
                      title="Supprimer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFacture(facture._id);
                      }}
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

export default FacturePage;
