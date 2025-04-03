import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import FactureForm from "../components/Facture/FactureForm";// ✅ Correct
 // Assure-toi du chemin du fichier

const FacturePage = () => {
  const [factureList, setFactureList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ➡️ Ajouter une facture
  const handleAddFacture = (facture) => {
    setFactureList([...factureList, facture]);
    setShowForm(false);
  };

  // ➡️ Supprimer une facture
  const handleDeleteFacture = (index) => {
    const updated = factureList.filter((_, i) => i !== index);
    setFactureList(updated);
  };

  // ➡️ Aperçu de la facture
  const handleViewFacture = (facture) => {
    const factureHTML = `
      <html>
        <head>
          <title>Facture ${facture.numeroFacture}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h1 { text-align: center; color: #167DB8; }
            .header, .footer { text-align: center; margin-bottom: 20px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            .totals { text-align: right; }
          </style>
        </head>
        <body>
          <h1>${facture.nomEntreprise || "Nom Entreprise"}</h1>
          <div class="header">
            <strong>Téléphone :</strong> ${facture.telephone || "-"}
          </div>
          <div class="info">
            <p><strong>Client :</strong> ${facture.client}</p>
            <p><strong>Date :</strong> ${facture.date}</p>
            <p><strong>Numéro de facture :</strong> ${facture.numeroFacture}</p>
            <p><strong>Référence :</strong> ${facture.reference}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total Ligne</th>
              </tr>
            </thead>
            <tbody>
              ${facture.lignes
                .map(
                  (ligne) => `
                <tr>
                  <td>${ligne.description}</td>
                  <td>${ligne.quantite}</td>
                  <td>${ligne.prixUnitaire.toFixed(3)} TND</td>
                  <td>${(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Subtotal :</strong> ${facture.subtotal.toFixed(3)} TND</p>
            <p><strong>Tax (19%) :</strong> ${facture.tax.toFixed(3)} TND</p>
            <h3><strong>Total :</strong> ${facture.total.toFixed(3)} TND</h3>
          </div>

          <div class="footer">
            <p>Merci pour votre confiance !</p>
          </div>
        </body>
      </html>
    `;

    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(factureHTML);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="container mt-4">
      {/* ✅ Header avec uniquement le bouton "Ajouter" */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <button
          className="btn fw-bold"
          onClick={() => setShowForm(true)}
          style={{
            backgroundColor: "#23BD15",
            color: "white",
            padding: "8px 20px",
            borderRadius: "6px",
          }}
        >
          Ajouter
        </button>
      </div>

      {/* ✅ Affichage du formulaire si demandé */}
      {showForm && (
        <div className="mb-4">
          <FactureForm
            onAddFacture={handleAddFacture}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* ✅ Liste des factures */}
      {!showForm && (
        <div
          className="card shadow-sm p-4 mx-auto"
          style={{ maxWidth: "900px" }}
        >
          <h6 className="mb-3 fst-italic">• Mes factures :</h6>

          {factureList.length === 0 ? (
            <p className="text-center text-muted">
              Aucune facture enregistrée pour l'instant.
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {factureList.map((facture, index) => (
                <div
                  key={index}
                  className={`d-flex justify-content-between align-items-center border rounded px-4 py-3 ${
                    index % 2 === 0 ? "bg-light" : "bg-white"
                  }`}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => handleViewFacture(facture)}
                >
                  <div className="d-flex align-items-center">
                    <span className="fw-semibold fst-italic">
                      {facture.client || "Client"} - {facture.numeroFacture || "N°"}
                    </span>
                  </div>

                  <button
                    className="btn btn-link text-dark p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFacture(index);
                    }}
                    title="Supprimer cette facture"
                  >
                    <FaTrash size={16} />
                  </button>
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
