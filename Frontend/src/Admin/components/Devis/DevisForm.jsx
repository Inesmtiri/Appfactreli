import React, { useState, useRef } from "react";
import { Button, Modal, Form, Table, Row, Col } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import SendDevisModal from "./SendDevis";

const DevisForm = ({ onAddDevis, onCancel }) => {
  const [client, setClient] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [numeroDevis, setNumeroDevis] = useState("000001");
  const [reference, setReference] = useState("");
  const [nomEntreprise, setNomEntreprise] = useState("Nom de l'entreprise");
  const [telephone, setTelephone] = useState("Téléphone");
  const [lignes, setLignes] = useState([{ description: "", quantite: 1, prixUnitaire: 0 }]);
  const [logo, setLogo] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const printRef = useRef();

  const ajouterLigne = () => {
    setLignes([...lignes, { description: "", quantite: 1, prixUnitaire: 0 }]);
  };

  const supprimerLigne = (index) => {
    const updated = lignes.filter((_, i) => i !== index);
    setLignes(updated);
  };

  const handleLigneChange = (index, field, value) => {
    const updated = [...lignes];
    updated[index][field] = field === "description" ? value : parseFloat(value);
    setLignes(updated);
  };

  const subtotal = lignes.reduce((total, ligne) => total + ligne.quantite * ligne.prixUnitaire, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`
      <html><head><title>Impression Devis</title></head><body>${printContents}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDevis = () => {
    const devis = {
      client,
      date,
      numeroDevis,
      reference,
      lignes,
      subtotal,
      tax,
      total,
      nomEntreprise,
      telephone,
    };
    onAddDevis(devis);
    onCancel();
  };

  return (
    <>
      {/* Modal principal */}
      <Modal show={true} onHide={onCancel} size="xl" backdrop="static" centered scrollable>
        <Modal.Body className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
          <Row>
            {/* LEFT SIDE FORM */}
            <Col md={8} ref={printRef}>
              <h4 className="fst-italic mb-4">Nouveau devis</h4>

              <Row className="mb-4">
                <Col md={6}>
                  <div
                    className="border border-2 border-secondary rounded d-flex justify-content-center align-items-center"
                    style={{ width: "200px", height: "150px", cursor: "pointer", position: "relative" }}
                    onClick={() => document.getElementById("logoInput").click()}
                  >
                    {logo ? (
                      <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <span className="text-muted text-center">Drag logo here<br />or select a file</span>
                    )}
                    <Form.Control
                      type="file"
                      id="logoInput"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </Col>

                <Col md={6} className="d-flex flex-column justify-content-start">
                  <Form.Control
                    className="mb-2 fw-bold"
                    type="text"
                    value={nomEntreprise}
                    onChange={(e) => setNomEntreprise(e.target.value)}
                    placeholder="Nom de l'entreprise"
                  />
                  <Form.Control
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Téléphone"
                  />
                </Col>
              </Row>

              {/* Infos client & devis */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Préparé pour</Form.Label>
                    <Form.Control
                      type="text"
                      value={client}
                      placeholder="Sélectionner un client"
                      onChange={(e) => setClient(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Date du devis</Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Numéro du devis</Form.Label>
                    <Form.Control
                      type="text"
                      value={numeroDevis}
                      onChange={(e) => setNumeroDevis(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Référence</Form.Label>
                <Form.Control
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                />
              </Form.Group>

              {/* Table des lignes de devis */}
              <Table bordered responsive>
                <thead className="table-light">
                  <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Prix Unitaire</th>
                    <th>Line Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((ligne, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Control
                          type="text"
                          value={ligne.description}
                          onChange={(e) => handleLigneChange(index, "description", e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={ligne.quantite}
                          onChange={(e) => handleLigneChange(index, "quantite", e.target.value)}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min="0"
                          value={ligne.prixUnitaire}
                          onChange={(e) => handleLigneChange(index, "prixUnitaire", e.target.value)}
                        />
                      </td>
                      <td className="text-end">
                        {(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND
                      </td>
                      <td className="text-center">
                        <Button variant="link" className="p-0" onClick={() => supprimerLigne(index)}>
                          <FaTrash size={18} color="#000" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button variant="outline-primary" className="mb-3" onClick={ajouterLigne}>
                + Ajouter une ligne
              </Button>

              {/* Totaux */}
              <div className="text-end">
                <p><strong>Subtotal :</strong> {subtotal.toFixed(3)} TND</p>
                <p><strong>Tax (19%) :</strong> {tax.toFixed(3)} TND</p>
                <h5><strong>Total :</strong> {total.toFixed(3)} TND</h5>
              </div>
            </Col>

            {/* ACTIONS BUTTONS */}
            <Col md={4} className="d-flex flex-column justify-content-center gap-3">
              <Button
                style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
                className="w-100 fw-bold"
                onClick={() => setShowSendModal(true)}
              >
                Envoyer
              </Button>
              <Button
                style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
                className="w-100 fw-bold"
                onClick={handleSaveDevis}
              >
                Enregistrer
              </Button>
              <Button
                style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
                className="w-100 fw-bold"
                onClick={handlePrint}
              >
                Imprimer
              </Button>
              <Button variant="secondary" className="w-100" onClick={onCancel}>
                Annuler
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Modal envoyer devis */}
      {showSendModal && (
        <SendDevisModal
          show={showSendModal}
          onClose={() => setShowSendModal(false)}
          devis={{
            nomEntreprise,
            numeroDevis,
            total,
            date,
          }}
        />
      )}
    </>
  );
};

export default DevisForm;

