import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Table,
  Badge,
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPen } from "react-icons/fa";
import DevisForm from "../components/Devis/DevisForm";

const DevisPage = () => {
  const [devisList, setDevisList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [devisToEdit, setDevisToEdit] = useState(null);
  const [produitsServices, setProduitsServices] = useState([]);

  const fetchDevis = async () => {
    try {
      const res = await axios.get("/api/devis");
      setDevisList(res.data);
    } catch (err) {
      console.error("Erreur chargement devis:", err.message);
    }
  };

  const fetchProduitsServices = async () => {
    const [produitsRes, servicesRes] = await Promise.all([
      axios.get("/api/produits"),
      axios.get("/api/services"),
    ]);
    const produits = produitsRes.data.map((p) => ({
      id: p._id,
      nom: p.reference,
      prix: p.prixVente,
      type: "produit",
    }));
    const services = servicesRes.data.map((s) => ({
      id: s._id,
      nom: s.nom,
      prix: s.tarif,
      type: "service",
    }));
    setProduitsServices([...produits, ...services]);
  };

  useEffect(() => {
    fetchDevis();
    fetchProduitsServices();
  }, []);

  const updateDevis = async (id, updatedData) => {
    try {
      const res = await axios.put(`/api/devis/${id}`, updatedData);
      setDevisList((prev) =>
        prev.map((d) => (d._id === id ? res.data : d))
      );
    } catch (err) {
      console.error("Erreur mise à jour devis:", err.message);
    }
  };

  const handleAddDevis = async (devis) => {
    try {
      if (devisToEdit) {
        // ✅ Mise à jour locale après update
        await updateDevis(devisToEdit._id, devis);
      } else {
        // ❌ NE PAS faire axios.post ici — c'est déjà fait dans DevisForm
        setDevisList((prev) => [...prev, devis]); // `devis` = res.data reçu depuis onAddDevis
      }
      setShowForm(false);
      setDevisToEdit(null);
    } catch (err) {
      console.error("Erreur enregistrement devis:", err.message);
    }
  };
  

  const handleDeleteDevis = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      try {
        await axios.delete(`/api/devis/${id}`);
        setDevisList((prev) => prev.filter((d) => d._id !== id));
      } catch (err) {
        console.error("Erreur suppression devis:", err.message);
      }
    }
  };
  const handleViewDevis = (devis) => {
    const logoURL = devis.logo
      ? typeof devis.logo === "string"
        ? `/uploads/${devis.logo}`
        : URL.createObjectURL(devis.logo)
      : "";
  
    const remise = devis.discount || 0;
    const subtotal = devis.subtotal || 0;
    const remiseMontant = subtotal * (remise / 100);
    const tax = devis.tax || 0;
    const total = devis.total || subtotal - remiseMontant + tax;
    const tvaRate = subtotal ? ((tax / (subtotal - remiseMontant)) * 100).toFixed(0) : 19;
  
    const clientInfo = typeof devis.client === "object"
      ? `${devis.client.nom} ${devis.client.prenom} - ${devis.client.societe}`
      : devis.client;
  
    const devisHTML = `
      <html>
        <head>
          <title>Devis ${devis.numeroDevis}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              margin: 60px;
              color: #2f3e4d;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 40px;
            }
            .header img {
              max-width: 140px;
              max-height: 100px;
            }
            .section-title {
              color: #5c6b73;
              font-weight: 500;
              margin-bottom: 5px;
              font-size: 14px;
            }
            .client-info, .devis-info {
              font-size: 16px;
              line-height: 1.6;
            }
            .info-blocks {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 30px;
              font-size: 15px;
            }
            th {
              text-align: left;
              background-color: #f2f4f6;
              color: #4b5563;
              padding: 12px;
              border-bottom: 2px solid #e5e7eb;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            .totals {
              margin-top: 40px;
              text-align: right;
              font-size: 16px;
              color: #1f2937;
            }
            .totals p {
              margin: 5px 0;
            }
            .total-amount {
              font-size: 20px;
              font-weight: bold;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              color: #9ca3af;
              font-size: 13px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="section-title">Client</div>
              <div class="client-info">
                ${clientInfo || "Nom du client"}<br/>
                ${devis.nomEntreprise || ""}
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
            <div class="devis-info">
              <div class="section-title">Date du devis</div>
              ${devis.date}
            </div>
            <div class="devis-info">
              <div class="section-title">Numéro du devis</div>
              ${devis.numeroDevis}
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th style="text-align:center;">Prix unitaire</th>
                <th style="text-align:center;">Quantité</th>
                <th style="text-align:right;">Total ligne</th>
              </tr>
            </thead>
            <tbody>
              ${devis.lignes.map((l) => `
                <tr>
                  <td>${l.designation}</td>
                  <td style="text-align:center;">${l.prixUnitaire.toFixed(3)} TND</td>
                  <td style="text-align:center;">${l.quantite}</td>
                  <td style="text-align:right;">${(l.quantite * l.prixUnitaire).toFixed(3)} TND</td>
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
  
          <div class="footer">
            Merci pour votre confiance – Facterli
          </div>
        </body>
      </html>
    `;
  
    const newWindow = window.open("", "_blank", "width=900,height=600");
    newWindow.document.write(devisHTML);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  };
  
  

  const handleEditDevis = (devis) => {
    const lignesAvecDesignation = devis.lignes.map((ligne) => {
      const item = produitsServices.find(
        (p) => p.id === ligne.itemId && p.type === ligne.type
      );
      return {
        ...ligne,
        designation: item ? `${item.nom} - ${item.prix}` : ligne.designation,
      };
    });

    const logo = devis.logo ? devis.logo : null;
    const nomEntreprise = devis.nomEntreprise || "";
    const telephone = devis.telephone || "";

    setDevisToEdit({
      ...devis,
      lignes: lignesAvecDesignation,
      logo: devis.logo || "", //
      nomEntreprise,
      telephone,
    });
    setShowForm(true);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 justify-content-end">
        <Col xs="auto">
          <Button
            style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
            onClick={() => {
              setShowForm(true);
              setDevisToEdit(null);
            }}
          >
            Ajouter
          </Button>
        </Col>
      </Row>

      {showForm && (
        <DevisForm
          onAddDevis={handleAddDevis}
          onCancel={() => {
            setShowForm(false);
            setDevisToEdit(null);
          }}
          editData={devisToEdit}
          produitsServices={produitsServices}
        />
      )}

      <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
        <h5 className="mb-4 fw-semibold text-primary">Liste des devis</h5>
        {devisList.length > 0 ? (
          <Table responsive className="align-middle text-center table-striped">
            <thead className="bg-light text-muted">
              <tr>
                <th className="text-start">Client / N°</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {devisList.map((devis) => (
                <tr key={devis._id} className="align-middle">
                  <td className="text-start">
                    <div className="fw-semibold">{devis.client}</div>
                    <small className="text-muted">{devis.numeroDevis}</small>
                  </td>
                  <td>{devis.date?.slice(0, 10)}</td>
                  <td>{devis.total?.toFixed(3)} TND</td>
                  <td>
                    <Badge bg={
                      devis.statut === "accepté" ? "success" :
                      devis.statut === "refusé" ? "danger" : "warning"
                    } className="px-3 py-2 text-capitalize">
                      {devis.statut}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewDevis(devis)}><FaFileAlt /></Button>
                      <Button variant="outline-success" size="sm" onClick={() => handleEditDevis(devis)}><FaPen /></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDevis(devis._id)}><FaTrash /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">Aucun devis enregistré pour l’instant.</p>
        )}
      </Card>
    </Container>
  );
};

export default DevisPage;
