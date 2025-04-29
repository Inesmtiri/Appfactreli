import React, { useEffect, useState } from "react";
import {
  fetchDevisClient,
  acceptDevis,
  refuseDevis,
} from "../../services/devisClientService";

const MesDevis = () => {
  const [devisList, setDevisList] = useState([]);
  const clientId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const loadDevis = async () => {
      try {
        const data = await fetchDevisClient(clientId);
        const filtered = data.filter((devis) => devis.clientId === clientId);
        setDevisList(filtered);
      } catch (error) {
        console.error("Erreur lors du chargement des devis :", error);
      }
    };

    if (clientId) {
      loadDevis();
    }
  }, [clientId]);

  const handleAccept = async (id) => {
    try {
      await acceptDevis(id);
      const updated = await fetchDevisClient(clientId);
      setDevisList(updated.filter((devis) => devis.clientId === clientId));
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
    }
  };

  const handleRefuse = async (id) => {
    try {
      await refuseDevis(id);
      const updated = await fetchDevisClient(clientId);
      setDevisList(updated.filter((devis) => devis.clientId === clientId));
    } catch (error) {
      console.error("Erreur lors du refus :", error);
    }
  };

  const handleViewDevis = (devis) => {
    const remise = devis.remise || 0;
    const subtotal = devis.subtotal || 0;
    const remiseMontant = subtotal * (remise / 100);
    const tax = devis.tax || 0;
    const total = devis.total || subtotal - remiseMontant + tax;
    const tvaRate = subtotal ? ((tax / (subtotal - remiseMontant)) * 100).toFixed(0) : 19;

    const devisHTML = `
      <html>
        <head>
          <title>Devis ${devis.numeroDevis}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; margin: 60px; color: #2f3e4d; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
            .section-title { font-weight: 600; font-size: 14px; color: #6b7280; }
            .client-info, .devis-info { font-size: 16px; line-height: 1.6; }
            .info-blocks { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; font-size: 15px; margin-top: 30px; }
            th { background-color: #f2f4f6; color: #4b5563; padding: 12px; border-bottom: 2px solid #e5e7eb; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .totals { margin-top: 40px; text-align: right; font-size: 16px; }
            .totals p { margin: 5px 0; }
            .total-amount { font-size: 20px; font-weight: bold; }
            .footer { margin-top: 60px; text-align: center; color: #9ca3af; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="section-title">Client</div>
              <div class="client-info">
                ${devis.client?.nom || "Client"}<br/>
                ${devis.client?.societe || ""}
              </div>
            </div>
            <div style="text-align:right;">
              <strong>Ganesh Coding</strong><br/>
              Beb bhar<br/>
              251403625
            </div>
          </div>

          <div class="info-blocks">
            <div class="devis-info"><div class="section-title">Date</div>${devis.date?.slice(0, 10) || "-"}</div>
            <div class="devis-info"><div class="section-title">N° Devis</div>${devis.numeroDevis}</div>
            <div class="devis-info"><div class="section-title">Référence</div>${devis.reference || "-"}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th style="text-align:center;">PU</th>
                <th style="text-align:center;">Quantité</th>
                <th style="text-align:right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${devis.lignes.map(l => `
                <tr>
                  <td>${l.designation}</td>
                  <td style="text-align:center;">${l.prixUnitaire.toFixed(3)} TND</td>
                  <td style="text-align:center;">${l.quantite}</td>
                  <td style="text-align:right;">${(l.prixUnitaire * l.quantite).toFixed(3)} TND</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="totals">
            <p><strong>Sous-total :</strong> ${subtotal.toFixed(3)} TND</p>
            <p><strong>Remise (${remise}%):</strong> ${remiseMontant.toFixed(3)} TND</p>
            <p><strong>TVA (${tvaRate}%):</strong> ${tax.toFixed(3)} TND</p>
            <p class="total-amount"><strong>Total :</strong> ${total.toFixed(3)} TND</p>
          </div>

          <div class="footer">Merci pour votre confiance – Facterli</div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(devisHTML);
    win.document.close();
    win.print();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📑 Mes devis reçus</h2>

      {devisList.length === 0 ? (
        <div className="alert alert-info">
          Vous n'avez encore reçu <strong>aucun devis</strong>.
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-4">
          {devisList.map((devis) => (
            <div
              key={devis._id}
              className="card text-center shadow-sm"
              style={{ width: "220px", borderRadius: "12px", cursor: "pointer" }}
              onClick={() => handleViewDevis(devis)}
            >
              <div className="card-body">
                <p className="text-muted mb-1">{devis.reference || "-"}</p>
                <p className="mb-1">Company</p>
                <p className="text-muted">{new Date(devis.date).toLocaleDateString()}</p>
                <hr />
                <p className="fw-bold">{devis.total?.toFixed(3)} TND</p>

                {devis.statut === "en attente" ? (
                  <>
                    <button
                      className="btn btn-vert btn-sm w-100 mb-2"
                      onClick={(e) => { e.stopPropagation(); handleAccept(devis._id); }}
                    >
                      Accepter
                    </button>
                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={(e) => { e.stopPropagation(); handleRefuse(devis._id); }}
                    >
                      Refuser
                    </button>
                  </>
                ) : (
                  <span
                    className={`badge w-100 py-2 ${
                      devis.statut === "accepté" ? "btn-vert" : "bg-danger"
                    }`}
                  >
                    {devis.statut}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MesDevis;
