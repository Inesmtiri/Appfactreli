import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

const DashboardClient = () => {
  const [nbDevis, setNbDevis] = useState(0);
  const [nbFactures, setNbFactures] = useState(0);
  const [loading, setLoading] = useState(true);

  const clientId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devisRes, facturesRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/mes-devis/client/en-attente/${clientId}`),
          axios.get(`http://localhost:3001/api/mes-factures/client/impayees/${clientId}`)
        ]);
        setNbDevis(devisRes.data.length);
        setNbFactures(facturesRes.data.length);
        setLoading(false);
      } catch (error) {
        console.error("Erreur dashboard client :", error);
        setLoading(false);
      }
    };

    if (clientId) fetchData();
  }, [clientId]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
     

      <Row className="g-4">
        <Col md={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>📑 Devis en attente</Card.Title>
              <h2>{nbDevis}</h2>
              <Button variant="outline-primary" href="/client/mes-devis">
                Consulter les devis
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>💸 Factures impayées</Card.Title>
              <h2>{nbFactures}</h2>
              <Button variant="outline-danger" href="/client/mes-factures">
                Consulter les factures
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardClient;
