import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const AddProduit = ({ show, onHide, onSave }) => {
  const [produit, setProduit] = useState({
    reference: "",
    categorie: "",
    unite: "",
    enAchat: false,
    enVente: false,
    prixVente: "",
    prixAchat: "",
    stockMin: "",
    stockActuel: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduit({
      ...produit,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    if (!produit.reference || !produit.categorie) {
      alert("La référence et la catégorie sont obligatoires !");
      return;
    }

    const stockActuel = parseInt(produit.stockActuel, 10);
    const statut = stockActuel === 0 ? "rupture" : "en stock";

    const newProduit = {
      ...produit,
      id: Date.now(),
      stockActuel,
      statut,
    };

    onSave(newProduit);

    setProduit({
      reference: "",
      categorie: "",
      unite: "",
      enAchat: false,
      enVente: false,
      prixVente: "",
      prixAchat: "",
      stockMin: "",
      stockActuel: "",
    });

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="fw-normal fst-italic">• nouveau produit :</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Référence :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="reference"
                value={produit.reference}
                onChange={handleChange}
                placeholder="Référence"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Catégorie :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="categorie"
                value={produit.categorie}
                onChange={handleChange}
                placeholder="Catégorie"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Unité :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="unite"
                value={produit.unite}
                onChange={handleChange}
                placeholder="Unité"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={4}>En achat :</Form.Label>
            <Col sm={2}>
              <Form.Check
                type="checkbox"
                name="enAchat"
                checked={produit.enAchat}
                onChange={handleChange}
              />
            </Col>
            <Form.Label column sm={2} className="text-end">En vente :</Form.Label>
            <Col sm={4}>
              <Form.Check
                type="checkbox"
                name="enVente"
                checked={produit.enVente}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Prix de vente :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="prixVente"
                value={produit.prixVente}
                onChange={handleChange}
                placeholder="Prix de vente"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Prix d'achat :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="prixAchat"
                value={produit.prixAchat}
                onChange={handleChange}
                placeholder="Prix d'achat"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Stock minimal :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="stockMin"
                value={produit.stockMin}
                onChange={handleChange}
                placeholder="Stock minimal"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={4}>Stock actuel :</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="stockActuel"
                value={produit.stockActuel}
                onChange={handleChange}
                placeholder="Stock actuel"
                min="0"
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
          onClick={handleSave}
        >
          Créer
        </Button>
        <Button
          style={{ backgroundColor: "#5B9BD5", borderColor: "#5B9BD5" }}
          onClick={onHide}
        >
          Annuler
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProduit;