import React, { useState } from "react";
import { Button, Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import { FaFileAlt, FaTrash } from "react-icons/fa";
import DevisForm from "../components/Devis/DevisForm"; // ✅ Correct
 // ajuste le chemin si besoin

const DevisPage = () => {
  const [devisList, setDevisList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ➡️ Ajouter un devis
  const handleAddDevis = (devis) => {
    setDevisList([...devisList, devis]);
    setShowForm(false);
  };

  // ➡️ Supprimer un devis
  const handleDeleteDevis = (index) => {
    const updated = devisList.filter((_, i) => i !== index);
    setDevisList(updated);
  };

  // ➡️ Aperçu du devis
  const handleViewDevis = (devis) => {
    const devisHTML = `
      <html>
        <head>
          <title>Devis ${devis.numeroDevis}</title>
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
          <h1>${devis.nomEntreprise || "Nom Entreprise"}</h1>
          <div class="header">
            <strong>Téléphone :</strong> ${devis.telephone || "-"}
          </div>
          <div class="info">
            <p><strong>Client :</strong> ${devis.client}</p>
            <p><strong>Date :</strong> ${devis.date}</p>
            <p><strong>Numéro de devis :</strong> ${devis.numeroDevis}</p>
            <p><strong>Référence :</strong> ${devis.reference}</p>
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
              ${devis.lignes
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
            <p><strong>Subtotal :</strong> ${devis.subtotal.toFixed(3)} TND</p>
            <p><strong>Tax (19%) :</strong> ${devis.tax.toFixed(3)} TND</p>
            <h3><strong>Total :</strong> ${devis.total.toFixed(3)} TND</h3>
          </div>

          <div class="footer">
            <p>Merci pour votre confiance !</p>
          </div>
        </body>
      </html>
    `;

    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(devisHTML);
    newWindow.document.close();
  };

  return (
    <Container className="mt-4">
      {/* ➡️ En-tête uniquement avec le bouton Ajouter à droite */}
      <Row className="mb-4 justify-content-end align-items-center">
        <Col xs="auto">
          <Button
            style={{
              backgroundColor: "#23BD15",
              borderColor: "#23BD15",
              fontWeight: "bold",
              padding: "6px 20px",
              borderRadius: "6px",
            }}
            onClick={() => setShowForm(true)}
          >
            Ajouter
          </Button>
        </Col>
      </Row>

      {/* ➡️ Formulaire pour ajouter un devis */}
      {showForm && (
        <DevisForm
          onAddDevis={handleAddDevis}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* ➡️ Liste des devis */}
      <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: "900px" }}>
        <h6 className="mb-3 fst-italic">• Liste des devis :</h6>

        {devisList.length > 0 ? (
          <ListGroup variant="flush" className="d-flex flex-column gap-3">
            {devisList.map((devis, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center border rounded px-3 py-2"
                style={{
                  cursor: "pointer",
                  backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff",
                }}
                onClick={() => handleViewDevis(devis)}
              >
                <div className="d-flex align-items-center">
                  <FaFileAlt size={20} color="#23BD15" className="me-2" />
                  <span className="fw-normal">
                    {devis.client} - {devis.numeroDevis}
                  </span>
                </div>

                <Button
                  variant="link"
                  className="text-dark p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDevis(index);
                  }}
                >
                  <FaTrash size={18} />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-center text-muted mb-0">
            Aucun devis enregistré pour l'instant.
          </p>
        )}
      </Card>
    </Container>
  );
};

export default DevisPage;
