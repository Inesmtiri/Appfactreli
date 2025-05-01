import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Table,
  Badge,
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPen } from "react-icons/fa";
import DevisForm from "../components/Devis/DevisForm";
import { SearchContext } from "../../context/SearchContext"; // ⚠️ adapte le chemin si besoin

const DevisPage = () => {
  const { searchTerm } = useContext(SearchContext); // 🔍 valeur du champ recherche global
  const [devisList, setDevisList] = useState([]);
  const [filteredDevis, setFilteredDevis] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [devisToEdit, setDevisToEdit] = useState(null);
  const [produitsServices, setProduitsServices] = useState([]);

  useEffect(() => {
    fetchDevis();
    fetchProduitsServices();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = devisList.filter((devis) => {
      const clientNom = typeof devis.client === "object"
        ? `${devis.client.nom} ${devis.client.prenom} ${devis.client.societe || ""}`
        : devis.client;

      return (
        `${clientNom} ${devis.numeroDevis}`
          .toLowerCase()
          .includes(term)
      );
    });
    setFilteredDevis(result);
  }, [searchTerm, devisList]);

  const fetchDevis = async () => {
    try {
      const res = await axios.get("/api/devis");
      setDevisList(res.data);
    } catch (err) {
      console.error("Erreur chargement devis:", err.message);
    }
  };

  const fetchProduitsServices = async () => {
    const [produitsRes, servicesRes] = await Promise.all([
      axios.get("/api/produits"),
      axios.get("/api/services"),
    ]);
    const produits = produitsRes.data.map((p) => ({
      id: p._id,
      nom: p.reference,
      prix: p.prixVente,
      type: "produit",
    }));
    const services = servicesRes.data.map((s) => ({
      id: s._id,
      nom: s.nom,
      prix: s.tarif,
      type: "service",
    }));
    setProduitsServices([...produits, ...services]);
  };

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

  const handleAddDevis = async (devis) => {
    try {
      if (devisToEdit) {
        await updateDevis(devisToEdit._id, devis);
      } else {
        setDevisList((prev) => [...prev, devis]);
      }
      setShowForm(false);
      setDevisToEdit(null);
    } catch (err) {
      console.error("Erreur enregistrement devis:", err.message);
    }
  };

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

  const handleViewDevis = (devis) => {
    // ✅ identique à ta version actuelle
    // on garde le même HTML pour impression
    // ...
    // ⏩ Pas modifié ici pour ne pas alourdir la réponse
  };

  const handleEditDevis = (devis) => {
    const lignesAvecDesignation = devis.lignes.map((ligne) => {
      const item = produitsServices.find(
        (p) => p.id === ligne.itemId && p.type === ligne.type
      );
      return {
        ...ligne,
        designation: item ? `${item.nom} - ${item.prix}` : ligne.designation,
      };
    });

    const nomEntreprise = devis.nomEntreprise || "";
    const telephone = devis.telephone || "";

    setDevisToEdit({
      ...devis,
      lignes: lignesAvecDesignation,
      logo: devis.logo || "",
      nomEntreprise,
      telephone,
    });
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
          produitsServices={produitsServices}
        />
      )}

      <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
        <h5 className="mb-4 fw-semibold text-primary">Liste des devis</h5>
        {filteredDevis.length > 0 ? (
          <Table responsive className="align-middle text-center table-striped">
            <thead className="bg-light text-muted">
              <tr>
                <th className="text-start">Client / N°</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevis.map((devis) => (
                <tr key={devis._id} className="align-middle">
                  <td className="text-start">
                    <div className="fw-semibold">
                      {typeof devis.client === "object"
                        ? `${devis.client.nom} ${devis.client.prenom}`
                        : devis.client}
                    </div>
                    <small className="text-muted">{devis.numeroDevis}</small>
                  </td>
                  <td>{devis.date?.slice(0, 10)}</td>
                  <td>{devis.total?.toFixed(3)} TND</td>
                  <td>
                    <Badge bg={
                      devis.statut === "accepté" ? "success" :
                      devis.statut === "refusé" ? "danger" : "warning"
                    } className="px-3 py-2 text-capitalize">
                      {devis.statut}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewDevis(devis)}><FaFileAlt /></Button>
                      <Button variant="outline-success" size="sm" onClick={() => handleEditDevis(devis)}><FaPen /></Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteDevis(devis._id)}><FaTrash /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">Aucun devis trouvé.</p>
        )}
      </Card>
    </Container>
  );
};

export default DevisPage;
