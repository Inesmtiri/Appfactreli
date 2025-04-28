import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Table
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPen } from "react-icons/fa";
import FactureForm from "../components/Facture/FactureForm";

const FacturePage = () => {
  const [factureList, setFactureList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturesRes, paiementsRes] = await Promise.all([
          axios.get("/api/factures"),
          axios.get("/api/paiements"),
        ]);

        const paiements = paiementsRes.data;

        const facturesAvecStatut = facturesRes.data.map((facture) => {
          const paiementsFacture = paiements.filter(
            (p) => p.facture === facture._id
          );
          const montantPayé = paiementsFacture.reduce((s, p) => s + p.montant, 0);
          let statut = "non payé";
          if (montantPayé >= facture.total) statut = "payé";
          else if (montantPayé > 0) statut = "partiellement payé";

          return { ...facture, statut };
        });

        setFactureList(facturesAvecStatut);
      } catch (err) {
        console.error("❌ Erreur chargement données :", err.message);
      }
    };

    fetchData();
  }, []);

  const handleAddFacture = async (facture) => {
    try {
      if (editData) {
        const res = await axios.put(`/api/factures/${editData._id}`, facture);
        setFactureList((prev) =>
          prev.map((f) => (f._id === editData._id ? res.data : f))
        );
      } else {
        const res = await axios.post("/api/factures", facture);
        setFactureList((prev) => [...prev, res.data]);
      }
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Erreur ajout/modif facture :", err.message);
    }
  };

  const handleDeleteFacture = async (id) => {
    if (window.confirm("Supprimer cette facture ?")) {
      try {
        await axios.delete(`/api/factures/${id}`);
        setFactureList((prev) => prev.filter((f) => f._id !== id));
      } catch (err) {
        console.error("Erreur suppression facture :", err.message);
      }
    }
  };

  const handleViewFacture = (facture) => {
    const clientNom = facture.client?.nom || facture.client?.societe || facture.client;
    const logoURL = facture.logo
      ? typeof facture.logo === "string"
        ? `/uploads/${facture.logo}`
        : URL.createObjectURL(facture.logo)
      : "";

    const remise = facture.remise || 0;
    const subtotal = facture.subtotal || 0;
    const remiseMontant = subtotal * (remise / 100);
    const tax = facture.tax || 0;
    const total = facture.total || subtotal - remiseMontant + tax;
    const tvaRate = subtotal ? ((tax / (subtotal - remiseMontant)) * 100).toFixed(0) : 19;

    const factureHTML = `
      <html>
        <head>
          <title>Facture ${facture.numeroFacture}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 60px; color: #2f3e4d; }
            .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
            .header img { max-width: 140px; max-height: 100px; }
            .section-title { font-weight: 600; font-size: 14px; color: #6b7280; }
            .client-info, .facture-info { font-size: 16px; line-height: 1.6; }
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
                ${clientNom || "Client"}<br/>
                ${facture.nomEntreprise || ""}
              </div>
            </div>
            <div style="text-align:right;">
              <strong>Ganesh Coding</strong><br/>
              Beb bhar<br/>
              251403625
            </div>
            ${logoURL ? `<img src="${logoURL}" alt="Logo">` : ""}
          </div>
          <div class="info-blocks">
            <div class="facture-info"><div class="section-title">Date</div>${facture.date?.slice(0, 10) || "-"}</div>
            <div class="facture-info"><div class="section-title">N° Facture</div>${facture.numeroFacture}</div>
            <div class="facture-info"><div class="section-title">Référence</div>${facture.reference}</div>
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
              ${facture.lignes.map(l => `
                <tr>
                  <td>${l.designation}</td>
                  <td style="text-align:center;">${l.prixUnitaire.toFixed(3)} TND</td>
                  <td style="text-align:center;">${l.quantite}</td>
                  <td style="text-align:right;">${(l.quantite * l.prixUnitaire).toFixed(3)} TND</td>
                </tr>`).join("")}
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
    win.document.write(factureHTML);
    win.document.close();
    win.print();
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 justify-content-end">
        <Col xs="auto">
          <Button
            style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
            onClick={() => {
              setShowForm(true);
              setEditData(null);
            }}
          >
            Ajouter
          </Button>
        </Col>
      </Row>

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

      <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
        <h5 className="mb-4 fw-semibold text-primary">Liste des factures</h5>
        {factureList.length > 0 ? (
          <Table responsive className="align-middle text-center table-striped">
            <thead className="bg-light text-muted">
              <tr>
                <th className="text-start">Client / N°</th>
                <th>Date</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {factureList.map((facture) => (
                <tr key={facture._id} className="align-middle">
                  <td className="text-start">
                    <div className="fw-semibold">{facture.client?.nom || facture.client?.societe || "Client"}</div>
                    <small className="text-muted">{facture.numeroFacture}</small>
                  </td>
                  <td>{facture.date?.slice(0, 10)}</td>
                  <td>{facture.total?.toFixed(3)} TND</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewFacture(facture)}>
                        <FaFileAlt />
                      </Button>
                      <Button
  variant="outline-success"
  size="sm"
  onClick={() => {
    const lignesFormatees = facture.lignes.map((l) => ({
      itemId: l.itemId,
      type: l.type,
      designation: l.designation,
      quantite: l.quantite,
      prixUnitaire: l.prixUnitaire,
      inputValue: `${l.designation} - ${l.prixUnitaire}`
    }));

    const clientInput =
      typeof facture.client === "object"
        ? `${facture.client.nom} ${facture.client.prenom} - ${facture.client.societe || ""}`
        : "";

    const clientId =
      typeof facture.client === "object"
        ? facture.client._id
        : facture.client;

    setEditData({
      ...facture,
      client: clientId,
      clientInput,
      lignes: lignesFormatees,
      numeroFacture: facture.numeroFacture || "",
      logo: facture.logo || null // ✅ ici on passe le logo dans le formulaire
    });

    setShowForm(true);
  }}
>
  <FaPen />
</Button>

                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteFacture(facture._id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">Aucune facture enregistrée pour l’instant.</p>
        )}
      </Card>
    </Container>
  );
};

export default FacturePage;
