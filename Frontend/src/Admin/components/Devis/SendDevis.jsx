import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const SendDevisModal = ({ show, onClose, devis }) => {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState(`Votre devis - ${devis.numeroDevis}`);
  const [message, setMessage] = useState(
    `[${devis.nomEntreprise}] vous a envoyé un devis (Numéro : ${devis.numeroDevis})`
  );

  const handleSend = () => {
    if (!toEmail || !subject) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Simulation d'envoi
    alert(`Le devis a été envoyé à ${toEmail} avec l'objet "${subject}".`);

    // Backend/API d'envoi ici (non implémenté)

    onClose(); // Fermer le modal après envoi
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Envoyer le devis :</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Champ Email */}
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>À :</Form.Label>
            <Form.Control
              type="email"
              placeholder="exemple@client.com"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              required
            />
          </Form.Group>

          {/* Champ Objet */}
          <Form.Group className="mb-3" controlId="formSubject">
            <Form.Label>Objet :</Form.Label>
            <Form.Control
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </Form.Group>

          {/* Champ Message */}
          <Form.Group className="mb-3" controlId="formMessage">
            <Form.Label>Message :</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} style={{ minWidth: "100px" }}>
          Annuler
        </Button>
        <Button
          style={{
            backgroundColor: "#23BD15",
            borderColor: "#23BD15",
            minWidth: "100px",
          }}
          onClick={handleSend}
        >
          Envoyer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SendDevisModal;