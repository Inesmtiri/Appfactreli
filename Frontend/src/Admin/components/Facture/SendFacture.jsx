import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const SendFacture = ({ onClose, factureInfo }) => {
  const [destinataire, setDestinataire] = useState("");
  const [objet, setObjet] = useState("Facture à payer");
  const [message, setMessage] = useState(
    `[${factureInfo.nomEntreprise}] vous a envoyé une facture (N° ${factureInfo.numeroFacture}) pour ${factureInfo.total.toFixed(3)} TND.`
  );
  const [modePaiement, setModePaiement] = useState("Espèces");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/api/email/send-facture", {
        destinataire,
        objet,
        message,
        modePaiement,
      });

      alert("📤 " + res.data.message);
      onClose();
    } catch (err) {
      console.error("Erreur envoi email :", err.message);
      alert("❌ Erreur lors de l'envoi de la facture.");
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fst-italic">Envoyer une facture :</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Champ destinataire */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">À :</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email du destinataire"
              value={destinataire}
              onChange={(e) => setDestinataire(e.target.value)}
              required
            />
          </Form.Group>

          {/* Champ Objet */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Objet :</Form.Label>
            <Form.Control
              type="text"
              placeholder="Objet du mail"
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              required
            />
          </Form.Group>

          {/* Champ Message */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Message :</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>

          {/* Champ Mode de Paiement */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Mode de paiement :</Form.Label>
            <Form.Select
              value={modePaiement}
              onChange={(e) => setModePaiement(e.target.value)}
            >
              <option>Espèces</option>
              <option>Virement Bancaire</option>
              <option>Chèque</option>
              <option>Carte Bancaire</option>
              <option>Autre</option>
            </Form.Select>
          </Form.Group>

          {/* Boutons */}
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: "#23BD15",
                borderColor: "#23BD15",
                fontWeight: "bold",
              }}
            >
              Envoyer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SendFacture;
