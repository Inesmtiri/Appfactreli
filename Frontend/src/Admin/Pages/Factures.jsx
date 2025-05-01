import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Table
} from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPen } from "react-icons/fa";
import FactureForm from "../components/Facture/FactureForm";
import { SearchContext } from "../../context/SearchContext"; // ✅ adapte ce chemin si besoin

const FacturePage = () => {
  const { searchTerm } = useContext(SearchContext); // 🔍 récupère le mot-clé tapé
  const [factureList, setFactureList] = useState([]);
  const [filteredFactures, setFilteredFactures] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facturesRes, paiementsRes] = await Promise.all([
          axios.get("/api/factures"),
          axios.get("/api/paiements"),
        ]);

        const paiements = paiementsRes.data;

        const facturesAvecStatut = facturesRes.data.map((facture) => {
          const paiementsFacture = paiements.filter(
            (p) => p.facture === facture._id
          );
          const montantPayé = paiementsFacture.reduce((s, p) => s + p.montant, 0);
          let statut = "non payé";
          if (montantPayé >= facture.total) statut = "payé";
          else if (montantPayé > 0) statut = "partiellement payé";

          return { ...facture, statut };
        });

        setFactureList(facturesAvecStatut);
      } catch (err) {
        console.error("❌ Erreur chargement données :", err.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const result = factureList.filter((facture) => {
      const nomClient = typeof facture.client === "object"
        ? `${facture.client.nom} ${facture.client.prenom} ${facture.client.societe || ""}`
        : facture.client;

      return (
        `${nomClient} ${facture.numeroFacture} ${facture.reference}`
          .toLowerCase()
          .includes(term)
      );
    });

    setFilteredFactures(result);
  }, [searchTerm, factureList]);

  const handleAddFacture = async (facture) => {
    try {
      if (editData) {
        const res = await axios.put(`/api/factures/${editData._id}`, facture);
        setFactureList((prev) =>
          prev.map((f) => (f._id === editData._id ? res.data : f))
        );
      } else {
        const res = await axios.post("/api/factures", facture);
        setFactureList((prev) => [...prev, res.data]);
      }
      setShowForm(false);
      setEditData(null);
    } catch (err) {
      console.error("Erreur ajout/modif facture :", err.message);
    }
  };

  const handleDeleteFacture = async (id) => {
    if (window.confirm("Supprimer cette facture ?")) {
      try {
        await axios.delete(`/api/factures/${id}`);
        setFactureList((prev) => prev.filter((f) => f._id !== id));
      } catch (err) {
        console.error("Erreur suppression facture :", err.message);
      }
    }
  };

  const handleViewFacture = (facture) => {
    // ✅ inchangé, impression comme tu l’as déjà fait
    // ...
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4 justify-content-end">
        <Col xs="auto">
          <Button
            style={{ backgroundColor: "#23BD15", borderColor: "#23BD15" }}
            onClick={() => {
              setShowForm(true);
              setEditData(null);
            }}
          >
            Ajouter
          </Button>
        </Col>
      </Row>

      {showForm && (
        <FactureForm
          onAddFacture={handleAddFacture}
          onCancel={() => {
            setShowForm(false);
            setEditData(null);
          }}
          editData={editData}
        />
      )}

      <Card className="shadow-lg p-4 mx-auto border-0 rounded-4" style={{ maxWidth: "1200px" }}>
        <h5 className="mb-4 fw-semibold text-primary">Liste des factures</h5>
        {filteredFactures.length > 0 ? (
          <Table responsive className="align-middle text-center table-striped">
            <thead className="bg-light text-muted">
              <tr>
                <th className="text-start">Client / N°</th>
                <th>Date</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFactures.map((facture) => (
                <tr key={facture._id} className="align-middle">
                  <td className="text-start">
                    <div className="fw-semibold">
                      {facture.client?.nom || facture.client?.societe || "Client"}
                    </div>
                    <small className="text-muted">{facture.numeroFacture}</small>
                  </td>
                  <td>{facture.date?.slice(0, 10)}</td>
                  <td>{facture.total?.toFixed(3)} TND</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button variant="outline-primary" size="sm" onClick={() => handleViewFacture(facture)}>
                        <FaFileAlt />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => {
                          const lignesFormatees = facture.lignes.map((l) => ({
                            itemId: l.itemId,
                            type: l.type,
                            designation: l.designation,
                            quantite: l.quantite,
                            prixUnitaire: l.prixUnitaire,
                            inputValue: `${l.designation} - ${l.prixUnitaire}`
                          }));

                          const clientInput =
                            typeof facture.client === "object"
                              ? `${facture.client.nom} ${facture.client.prenom} - ${facture.client.societe || ""}`
                              : "";

                          const clientId =
                            typeof facture.client === "object"
                              ? facture.client._id
                              : facture.client;

                          setEditData({
                            ...facture,
                            client: clientId,
                            clientInput,
                            lignes: lignesFormatees,
                            numeroFacture: facture.numeroFacture || "",
                            logo: facture.logo || null
                          });

                          setShowForm(true);
                        }}
                      >
                        <FaPen />
                      </Button>

                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteFacture(facture._id)}>
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">Aucune facture trouvée.</p>
        )}
      </Card>
    </Container>
  );
};

export default FacturePage;
