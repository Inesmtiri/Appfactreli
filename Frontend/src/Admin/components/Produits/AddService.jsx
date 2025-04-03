import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const AddService = ({ show, onHide, onSave }) => {
  const [service, setService] = useState({
    nom: "",
    description: "",
    tarif: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({
      ...service,
      [name]: value
    });
  };

  const handleSave = () => {
    if (!service.nom) {
      alert("Le nom est requis !");
      return;
    }

    const newService = {
      ...service,
      id: Date.now()
    };

    onSave(newService);
    onHide();
    setService({
      nom: "",
      description: "",
      tarif: ""
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className="fw-normal fst-italic">• nouveau service :</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Nom */}
          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={3}>Nom :</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                name="nom"
                value={service.nom}
                onChange={handleChange}
                placeholder="Nom du service"
              />
            </Col>
          </Form.Group>

          {/* Description */}
          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={3}>Description :</Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={service.description}
                onChange={handleChange}
                placeholder="Description du service"
              />
            </Col>
          </Form.Group>

          {/* Tarif */}
          <Form.Group as={Row} className="mb-3 align-items-center">
            <Form.Label column sm={3}>Tarif :</Form.Label>
            <Col sm={9}>
              <Form.Control
                type="number"
                name="tarif"
                value={service.tarif}
                onChange={handleChange}
                placeholder="Tarif en TND"
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center gap-3">
        <Button
          style={{
            backgroundColor: "#23BD15",
            borderColor: "#23BD15",
            minWidth: "120px"
          }}
          onClick={handleSave}
        >
          Créer
        </Button>

        <Button
          style={{
            backgroundColor: "#5B9BD5",
            borderColor: "#5B9BD5",
            minWidth: "120px"
          }}
          onClick={onHide}
        >
          Annuler
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddService;