import React, { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaFileUpload } from "react-icons/fa";
import axios from "axios";

const DepenseForm = ({ onCancel }) => {
  const [categorie, setCategorie] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [commercant, setCommercant] = useState("");
  const [description, setDescription] = useState("");
  const [montant, setMontant] = useState(0);
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const depense = {
      categorie,
      date,
      commercant,
      description,
      montant: parseFloat(montant),
      image,
    };

    try {
      const res = await axios.post("/api/depenses", depense);
      console.log("✅ Dépense enregistrée :", res.data);
      alert("✅ Dépense enregistrée avec succès !");
      // Réinitialiser les champs
      setCategorie("");
      setDate(new Date().toISOString().slice(0, 10));
      setCommercant("");
      setDescription("");
      setMontant(0);
      setImage(null);
      onCancel(); // pour fermer le formulaire après enregistrement
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement :", error);
      alert("❌ Erreur lors de l'enregistrement de la dépense.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="categorie">
              <Form.Label className="fw-semibold">Ajouter une catégorie</Form.Label>
              <Form.Control
                type="text"
                placeholder="Exemple : Transport"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="date">
              <Form.Label className="fw-semibold">Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3" controlId="commercant">
          <Form.Label className="fw-semibold">Ajouter un commerçant</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nom du commerçant"
            value={commercant}
            onChange={(e) => setCommercant(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label className="fw-semibold">Ajouter une description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Description de la dépense"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        <Row className="align-items-center mb-3">
          <Col md={6}>
            <Form.Group controlId="imageUpload">
              <Form.Label className="fw-semibold d-block">Image du reçu</Form.Label>
              <Form.Label
                htmlFor="image-file"
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                style={{ height: "100px", cursor: "pointer" }}
              >
                <FaFileUpload className="me-2" />
                {image ? "Image chargée" : "Glisser ici ou sélectionner un fichier"}
              </Form.Label>
              <Form.Control
                type="file"
                id="image-file"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="montant">
              <Form.Label className="fw-semibold">Montant de la dépense (TND)</Form.Label>
              <Form.Control
                type="number"
                value={montant}
                min="0"
                step="0.001"
                onChange={(e) => setMontant(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <hr />

        <div className="d-flex justify-content-between align-items-center">
          <h5 className="fw-bold">
            Grand Total (TND) : <span>{parseFloat(montant).toFixed(3)} د.ت</span>
          </h5>

          <div className="d-flex gap-2">
            <Button variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button
              type="submit"
              style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default DepenseForm;
