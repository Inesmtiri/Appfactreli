import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

const DashboardClient = () => {
  return (
    <Container fluid>
      <h3 className="mb-4">Bienvenue sur votre espace client</h3>

      <Row className="mb-4">
        <Col md={6} lg={4} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Nombre de factures</Card.Title>
              <Card.Text>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>5</span>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Nombre de devis</Card.Title>
              <Card.Text>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>3</span>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Montant total factures</Card.Title>
              <Card.Text>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>1 500 TND</span>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardClient;