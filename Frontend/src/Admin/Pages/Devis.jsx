import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPen } from "react-icons/fa";
import DevisForm from "../components/Devis/DevisForm";

const DevisPage = () => {
  const [devisList, setDevisList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [devisToEdit, setDevisToEdit] = useState(null);

  // 🔄 Charger les devis
  const fetchDevis = async () => {
    try {
      const res = await axios.get("/api/devis");
      setDevisList(res.data);
    } catch (err) {
      console.error("Erreur chargement devis:", err.message);
    }
  };

  useEffect(() => {
    fetchDevis();
  }, []);

  // ✏️ Modifier un devis existant
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

  // ➕ Ajouter ou mettre à jour un devis
  const handleAddDevis = async (devis) => {
    try {
      if (devisToEdit) {
        await updateDevis(devisToEdit._id, devis);
      } else {
        const res = await axios.post("/api/devis", devis);
        setDevisList((prev) => [...prev, res.data]);
      }
      setShowForm(false);
      setDevisToEdit(null);
    } catch (err) {
      console.error("Erreur enregistrement devis:", err.message);
    }
  };

  // 🗑️ Supprimer un devis
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

  // 🧾 Affichage/impression d'un devis
  const handleViewDevis = (devis) => {
    const devisHTML = `
      <html><head><title>Devis ${devis.numeroDevis}</title>
        <style>
          body { font-family: Arial; margin: 40px; color: #333; }
          h1 { text-align: center; color: #167DB8; }
          .header, .footer { text-align: center; margin-bottom: 20px; }
          .info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; }
          .totals { text-align: right; }
        </style>
      </head><body>
        <h1>${devis.nomEntreprise || "Nom Entreprise"}</h1>
        <div class="header"><strong>Téléphone :</strong> ${devis.telephone || "-"}</div>
        <div class="info">
          <p><strong>Client :</strong> ${devis.client}</p>
          <p><strong>Date :</strong> ${devis.date}</p>
          <p><strong>Numéro :</strong> ${devis.numeroDevis}</p>
          <p><strong>Référence :</strong> ${devis.reference}</p>
        </div>
        <table>
          <thead><tr><th>Description</th><th>Quantité</th><th>Prix Unitaire</th><th>Total</th></tr></thead>
          <tbody>
            ${devis.lignes
              .map(
                (l) => `
              <tr>
                <td>${l.designation}</td>
                <td>${l.quantite}</td>
                <td>${l.prixUnitaire.toFixed(3)} TND</td>
                <td>${(l.quantite * l.prixUnitaire).toFixed(3)} TND</td>
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
        <div class="footer"><p>Merci pour votre confiance !</p></div>
      </body></html>
    `;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(devisHTML);
    newWindow.document.close();
  };

  const handleEditDevis = (devis) => {
    setDevisToEdit(devis);
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
        />
      )}

      <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: "900px" }}>
        <h6 className="mb-3 fst-italic">• Liste des devis :</h6>
        {devisList.length > 0 ? (
          <ListGroup variant="flush" className="d-flex flex-column gap-3">
            {devisList.map((devis) => (
              <ListGroup.Item
                key={devis._id}
                className="d-flex justify-content-between align-items-center border rounded px-3 py-2"
              >
                <div
                  onClick={() => handleViewDevis(devis)}
                  style={{ cursor: "pointer" }}
                >
                  <FaFileAlt size={20} color="#23BD15" className="me-2" />
                  <span className="fw-normal">
                    {devis.client} - {devis.numeroDevis}
                  </span>
                  <Badge
                    bg={
                      devis.statut === "accepté"
                        ? "success"
                        : devis.statut === "refusé"
                        ? "danger"
                        : "warning"
                    }
                    className="ms-2"
                  >
                    {devis.statut}
                  </Badge>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    variant="link"
                    className="text-dark p-0"
                    onClick={() => handleEditDevis(devis)}
                  >
                    <FaPen size={16} />
                  </Button>
                  <Button
                    variant="link"
                    className="text-dark p-0"
                    onClick={() => handleDeleteDevis(devis._id)}
                  >
                    <FaTrash size={16} />
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-center text-muted">
            Aucun devis enregistré pour l’instant.
          </p>
        )}
      </Card>
    </Container>
  );
};

export default DevisPage;
