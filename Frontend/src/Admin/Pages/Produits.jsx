import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Badge,
} from "react-bootstrap";
import { FaUpload, FaTrash } from "react-icons/fa";
import AddProduitModal from "../components/Produits/AddProduit";
import AddServiceModal from "../components/Produits/AddService";
import ProduitServiceTabs from "../components/Produits/ProduitServiceTabs"; // ✅ Import Tabs
import * as XLSX from "xlsx";

const ProduitServicePage = () => {
  const [activeTab, setActiveTab] = useState("produits");

  const [showAddProduitModal, setShowAddProduitModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const [produits, setProduits] = useState([]);
  const [services, setServices] = useState([]);

  const handleAddProduit = (produit) => {
    const stockActuel = parseInt(produit.stockActuel, 10);
    const statut = stockActuel === 0 ? "rupture" : "en stock";

    const produitAvecStatut = {
      ...produit,
      stockActuel,
      statut,
    };

    setProduits([...produits, produitAvecStatut]);
    setShowAddProduitModal(false);
  };

  const handleAddService = (service) => {
    setServices([...services, service]);
    setShowAddServiceModal(false);
  };

  const handleDeleteProduit = (id) => {
    setProduits(produits.filter((prod) => prod.id !== id));
  };

  const handleDeleteService = (id) => {
    setServices(services.filter((srv) => srv.id !== id));
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet);

      if (activeTab === "produits") {
        const importedProduits = data.map((item, idx) => {
          const stockActuel = parseInt(item.stockActuel) || 0;
          return {
            id: Date.now() + idx,
            reference: item.reference || "Sans référence",
            categorie: item.categorie || "Non spécifiée",
            stockActuel,
            statut: stockActuel === 0 ? "rupture" : "en stock",
          };
        });
        setProduits([...produits, ...importedProduits]);
      } else if (activeTab === "services") {
        const importedServices = data.map((item, idx) => ({
          id: Date.now() + idx,
          nom: item.nom || "Service sans nom",
          description: item.description || "",
          tarif: item.tarif || 0,
        }));
        setServices([...services, ...importedServices]);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <Container className="mt-4">

      {/* HEADER BOUTONS DROITE */}
      <Row className="justify-content-end mb-4">
        <Col xs="auto" className="d-flex gap-2">
          <Form.Label
            htmlFor="file-upload"
            className="btn d-inline-flex align-items-center"
            style={{
              backgroundColor: "#0D6EFD",
              borderColor: "#0D6EFD",
              color: "#fff",
              height: "40px",
              padding: "0 20px",
              borderRadius: "6px",
              fontWeight: "500",
              minWidth: "120px",
            }}
          >
            <FaUpload className="me-1" />
            Importer
          </Form.Label>

          <Form.Control
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleImport}
            style={{ display: "none" }}
          />

          <Button
            style={{
              backgroundColor: "#23BD15",
              borderColor: "#23BD15",
              color: "#fff",
              height: "40px",
              padding: "0 20px",
              borderRadius: "6px",
              fontWeight: "500",
              minWidth: "120px",
            }}
            onClick={() =>
              activeTab === "produits"
                ? setShowAddProduitModal(true)
                : setShowAddServiceModal(true)
            }
          >
            Créer
          </Button>
        </Col>
      </Row>

      {/* Onglets Produits / Services */}
      <ProduitServiceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* AFFICHAGE PRODUITS / SERVICES */}
      {activeTab === "produits" ? (
        <div className="d-flex flex-column gap-3">
          {produits.length === 0 ? (
            <p className="text-center text-muted">Aucun produit enregistré.</p>
          ) : (
            produits.map((produit) => (
              <div
                key={produit.id}
                className="d-flex justify-content-between align-items-center border rounded p-3"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div>
                  <div className="fw-semibold">{produit.reference}</div>
                  <div className="text-muted small">
                    Catégorie : {produit.categorie || "Non spécifiée"}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <Badge
                    bg={produit.statut === "rupture" ? "danger" : "warning"}
                    className="text-capitalize px-3 py-2"
                    style={{ fontSize: "0.8rem", borderRadius: "12px" }}
                  >
                    {produit.statut}
                  </Badge>

                  <Button
                    variant="link"
                    className="text-dark p-0"
                    onClick={() => handleDeleteProduit(produit.id)}
                  >
                    <FaTrash size={18} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {services.length === 0 ? (
            <p className="text-center text-muted">Aucun service enregistré.</p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="d-flex justify-content-between align-items-center border rounded p-3"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <div>
                  <span className="fw-semibold">{service.nom}</span>
                </div>

                <Button
                  variant="link"
                  className="text-dark p-0"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <FaTrash size={18} />
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {/* MODALES */}
      <AddProduitModal
        show={showAddProduitModal}
        onHide={() => setShowAddProduitModal(false)}
        onSave={handleAddProduit}
      />

      <AddServiceModal
        show={showAddServiceModal}
        onHide={() => setShowAddServiceModal(false)}
        onSave={handleAddService}
      />
    </Container>
  );
};

export default ProduitServicePage;