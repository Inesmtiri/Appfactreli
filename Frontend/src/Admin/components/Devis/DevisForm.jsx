import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form, Table, Row, Col } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import SendDevisModal from "./SendDevis";

const DevisForm = ({ onAddDevis, onCancel, editData }) => {
  const [clientType, setClientType] = useState(editData?.clientType || "interne");
  const [clientId, setClientId] = useState(editData?.clientId || "");
  const [clients, setClients] = useState([]);
  const [articles, setArticles] = useState([]);
  const [client, setClient] = useState(editData?.client || "");
  const [date, setDate] = useState(editData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10));
  const [numeroDevis, setNumeroDevis] = useState(editData?.numeroDevis || "000001");
  const [reference, setReference] = useState(editData?.reference || "");
  const [nomEntreprise, setNomEntreprise] = useState(editData?.nomEntreprise || "");
  const [telephone, setTelephone] = useState(editData?.telephone || "");
  const [lignes, setLignes] = useState(editData?.lignes || [
    { id: "", description: "", quantite: 1, prixUnitaire: 0 }
  ]);
  const [logo, setLogo] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/clients");
        setClients(res.data);
      } catch (err) {
        console.error("Erreur récupération clients :", err.message);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const produits = await axios.get("http://localhost:3001/api/produits");
        const services = await axios.get("http://localhost:3001/api/services");
        const all = [
          ...produits.data.map(p => ({ _id: p._id, type: "Produit", nom: p.reference, prix: p.prixVente })),
          ...services.data.map(s => ({ _id: s._id, type: "Service", nom: s.nom, prix: s.tarif }))
        ];
        setArticles(all);
      } catch (err) {
        console.error("❌ Erreur chargement produits/services :", err.message);
      }
    };
    fetchArticles();
  }, []);

  const ajouterLigne = () => {
    setLignes([...lignes, { id: "", description: "", quantite: 1, prixUnitaire: 0 }]);
  };

  const supprimerLigne = (index) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const updateLigne = (index, field, value) => {
    const updated = [...lignes];
    if (field === "quantite") {
      updated[index][field] = parseInt(value);
    } else {
      updated[index][field] = value;
    }
    setLignes(updated);
  };

  const subtotal = lignes.reduce((total, ligne) => total + ligne.quantite * ligne.prixUnitaire, 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDevis = async () => {
    const devis = {
      clientType,
      client,
      clientId,
      date,
      numeroDevis,
      reference,
      lignes,
      subtotal,
      tax,
      total,
      nomEntreprise,
      telephone,
      statut: "en attente"
    };

    try {
      if (editData?._id) {
        const res = await axios.put(`http://localhost:3001/api/devis/${editData._id}`, devis);
        onAddDevis(res.data);
      } else {
        const res = await axios.post("http://localhost:3001/api/devis", devis);
        onAddDevis(res.data);
      }
      onCancel();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du devis :", error.message);
    }
  };

  const handleSend = () => {
    if (clientType === "interne") {
      if (!clientId) return alert("Veuillez sélectionner un client interne !");
      console.log("Envoi au client interne ID:", clientId);
    } else {
      if (!client) return alert("Veuillez saisir un nom de client externe !");
      setShowSendModal(true);
    }
  };

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`<html><head><title>Impression Devis</title></head><body>${printContents}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <>
      <Modal show={true} onHide={onCancel} size="xl" backdrop="static" centered scrollable>
        <Modal.Body className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
          <Row>
            <Col md={8} ref={printRef}>
              <h4 className="fst-italic mb-4">Nouveau devis</h4>
              <Row className="mb-4">
                <Col md={6}>
                  <div className="border border-2 border-secondary rounded d-flex justify-content-center align-items-center"
                    style={{ width: "200px", height: "150px", cursor: "pointer", position: "relative" }}
                    onClick={() => document.getElementById("logoInput").click()}>
                    {logo ? (
                      <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    ) : (
                      <span className="text-muted text-center">Drag logo here<br />or select a file</span>
                    )}
                    <Form.Control type="file" id="logoInput" accept="image/*" onChange={handleLogoUpload}
                      style={{ position: "absolute", width: "100%", height: "100%", opacity: 0 }} />
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Control className="mb-2 fw-bold" type="text" value={nomEntreprise}
                    onChange={(e) => setNomEntreprise(e.target.value)} placeholder="Entreprise" />
                  <Form.Control type="text" value={telephone}
                    onChange={(e) => setTelephone(e.target.value)} placeholder="+216 -- --- ---" />
                </Col>
              </Row>

              {/* Type de client */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Type de client</Form.Label>
                <div>
                  <Form.Check inline label="Interne" name="clientType" type="radio"
                    checked={clientType === "interne"} onChange={() => setClientType("interne")} />
                  <Form.Check inline label="Externe" name="clientType" type="radio"
                    checked={clientType === "externe"}
                    onChange={() => {
                      setClientType("externe");
                      setClientId("");
                      setClient("");
                    }} />
                </div>
              </Form.Group>

              {/* Sélection ou saisie client */}
              {clientType === "interne" ? (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Client interne</Form.Label>
                  <Form.Select value={clientId} onChange={(e) => {
                    const id = e.target.value;
                    setClientId(id);
                    const selected = clients.find(c => c._id === id);
                    setClient(selected?.nom || "");
                  }}>
                    <option value="">-- Sélectionner un client --</option>
                    {clients.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.nom} {c.prenom} - {c.societe}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nom du client externe</Form.Label>
                  <Form.Control type="text" value={client} placeholder="Nom du client"
                    onChange={(e) => setClient(e.target.value)} />
                </Form.Group>
              )}

              {/* Informations devis */}
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label className="fw-semibold">Date</Form.Label>
                  <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label className="fw-semibold">Numéro</Form.Label>
                  <Form.Control type="text" value={numeroDevis} onChange={(e) => setNumeroDevis(e.target.value)} />
                </Col>
                <Col md={4}>
                  <Form.Label className="fw-semibold">Référence</Form.Label>
                  <Form.Control type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
                </Col>
              </Row>

              {/* Lignes produits/services */}
              <Table bordered responsive>
                <thead className="table-light">
                  <tr>
                    <th>Produit / Service</th>
                    <th>Quantité</th>
                    <th>Prix Unitaire</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((ligne, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Select
                          value={ligne.id}
                          onChange={(e) => {
                            const selected = articles.find(a => a._id === e.target.value);
                            const prix = parseFloat(selected?.prix || 0);
                            const updated = [...lignes];
                            updated[index] = {
                              id: selected?._id || "",
                              description: selected?.nom || "",
                              quantite: 1,
                              prixUnitaire: prix
                            };
                            setLignes(updated);
                          }}
                        >
                          <option value="">-- Choisir --</option>
                          {articles.map(item => (
                            <option key={item._id} value={item._id}>
                              [{item.type}] {item.nom} - {item.prix} TND
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={ligne.quantite}
                          onChange={(e) => updateLigne(index, "quantite", e.target.value)}
                        />
                      </td>
                      <td>
                      <Form.Control
  type="number"
  value={ligne.prixUnitaire || 0} 
  readOnly
/>

                      </td>
                      <td className="text-center">
                        <Button variant="link" className="p-0" onClick={() => supprimerLigne(index)}>
                          <FaTrash size={18} />
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

            {/* Boutons d'action */}
            <Col md={4} className="d-flex flex-column justify-content-center gap-3">
              <Button style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }} className="w-100 fw-bold" onClick={handleSend}>
                Envoyer
              </Button>
              <Button style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }} className="w-100 fw-bold" onClick={handleSaveDevis}>
                Enregistrer
              </Button>
              <Button style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }} className="w-100 fw-bold" onClick={handlePrint}>
                Imprimer
              </Button>
              <Button variant="secondary" className="w-100" onClick={onCancel}>
                Annuler
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Modal d'envoi pour client externe */}
      {showSendModal && clientType === "externe" && (
        <SendDevisModal
          show={showSendModal}
          onClose={() => setShowSendModal(false)}
          devis={{ nomEntreprise, numeroDevis, total, date, client }}
        />
      )}
    </>
  );
};

export default DevisForm;
