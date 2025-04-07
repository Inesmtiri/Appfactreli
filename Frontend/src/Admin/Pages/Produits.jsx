import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { FaUpload, FaTrash, FaPen } from "react-icons/fa";
import AddProduitModal from "../components/Produits/AddProduit";
import AddServiceModal from "../components/Produits/AddService";
import ProduitServiceTabs from "../components/Produits/ProduitServiceTabs";
import * as XLSX from "xlsx";
import axios from "axios";

const ProduitServicePage = () => {
  const [activeTab, setActiveTab] = useState("produits");

  const [showAddProduitModal, setShowAddProduitModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);

  const [produitEnCours, setProduitEnCours] = useState(null); // Pour modification produit
  const [serviceEnCours, setServiceEnCours] = useState(null); // Pour modification service

  useEffect(() => {
    fetchProduits();
    fetchServices();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/produits");
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur chargement produits:", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Erreur chargement services:", err);
    }
  };

  const handleAddProduit = async (produit) => {
    try {
      if (produitEnCours) {
        const res = await axios.put(`http://localhost:3001/api/produits/${produitEnCours._id}`, produit);
        const updatedList = produits.map(p => p._id === produitEnCours._id ? res.data : p);
        setProduits(updatedList);
        setProduitEnCours(null);
      } else {
        const res = await axios.post("http://localhost:3001/api/produits", produit);
        setProduits([...produits, res.data]);
      }
      setShowAddProduitModal(false);
    } catch (err) {
      console.error("Erreur ajout/modif produit:", err);
    }
  };

  const handleAddService = async (service) => {
    try {
      if (serviceEnCours) {
        const res = await axios.put(`http://localhost:3001/api/services/${serviceEnCours._id}`, service);
        const updated = services.map(s => s._id === serviceEnCours._id ? res.data : s);
        setServices(updated);
        setServiceEnCours(null);
      } else {
        const res = await axios.post("http://localhost:3001/api/services", service);
        setServices([...services, res.data]);
      }
      setShowAddServiceModal(false);
    } catch (err) {
      console.error("Erreur ajout/modif service:", err);
    }
  };

  const handleDeleteProduit = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/produits/${id}`);
      setProduits(produits.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erreur suppression produit:", err);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/services/${id}`);
      setServices(services.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Erreur suppression service:", err);
    }
  };

  return (
    <Container className="mt-4">
      {/* Header */}
      <Row className="justify-content-end mb-4">
        <Col xs="auto" className="d-flex gap-2">
          <Form.Label htmlFor="file-upload" className="btn btn-primary">
            <FaUpload className="me-1" /> Importer
          </Form.Label>
          <Form.Control
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            style={{ display: "none" }}
          />
          <Button
            style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
            onClick={() => {
              activeTab === "produits" ? setShowAddProduitModal(true) : setShowAddServiceModal(true);
              setProduitEnCours(null);
              setServiceEnCours(null);
            }}
          >
            Créer
          </Button>
        </Col>
      </Row>

      {/* Tabs */}
      <ProduitServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Produits */}
      {activeTab === "produits" ? (
        produits.length > 0 ? produits.map((produit) => (
          <div key={produit._id} className="d-flex justify-content-between align-items-center border rounded p-3 mb-2">
            <div>
              <div className="fw-bold">{produit.reference}</div>
              <div className="text-muted small">Catégorie : {produit.categorie}</div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Badge
                bg={produit.stockActuel === 0 ? "danger" : "warning"}
                className="text-capitalize px-3 py-2"
              >
                {produit.stockActuel === 0 ? "Rupture" : "En stock"}
              </Badge>
              <Button variant="link" className="text-primary p-0" onClick={() => {
                setProduitEnCours(produit);
                setShowAddProduitModal(true);
              }}>
                <FaPen />
              </Button>
              <Button variant="link" className="text-dark p-0" onClick={() => handleDeleteProduit(produit._id)}>
                <FaTrash />
              </Button>
            </div>
          </div>
        )) : (
          <p className="text-center text-muted">Aucun produit trouvé.</p>
        )
      ) : (
        services.length > 0 ? services.map((service) => (
          <div key={service._id} className="d-flex justify-content-between align-items-center border rounded p-3 mb-2">
            <div>
              <div className="fw-bold">{service.nom}</div>
              <div className="text-muted small">{service.description}</div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Button variant="link" className="text-primary p-0" onClick={() => {
                setServiceEnCours(service);
                setShowAddServiceModal(true);
              }}>
                <FaPen />
              </Button>
              <Button variant="link" className="text-dark p-0" onClick={() => handleDeleteService(service._id)}>
                <FaTrash />
              </Button>
            </div>
          </div>
        )) : (
          <p className="text-center text-muted">Aucun service trouvé.</p>
        )
      )}

      {/* Modals */}
      <AddProduitModal
        show={showAddProduitModal}
        onHide={() => {
          setShowAddProduitModal(false);
          setProduitEnCours(null);
        }}
        onSave={handleAddProduit}
        produit={produitEnCours}
      />

      <AddServiceModal
        show={showAddServiceModal}
        onHide={() => {
          setShowAddServiceModal(false);
          setServiceEnCours(null);
        }}
        onSave={handleAddService}
        service={serviceEnCours}
      />
    </Container>
  );
};

export default ProduitServicePage;
