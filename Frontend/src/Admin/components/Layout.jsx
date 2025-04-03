import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Modal, Button } from "react-bootstrap";
import { FaTachometerAlt } from "react-icons/fa";

const Layout = () => {
  const navigate = useNavigate();

  const [activeModule, setActiveModule] = useState({
    name: "Dashboard",
    icon: <FaTachometerAlt />,
  });

  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(false);
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#fff" }}>
      {/* Sidebar */}
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar activeModule={activeModule} onLogout={() => setShowLogout(true)} />

        <div style={{ flex: 1, padding: "20px", marginTop: "60px", backgroundColor: "#fff" }}>
          <Outlet />
        </div>
      </div>

      {/* Modal logout sans bouton de fermeture */}
      <Modal
        show={showLogout}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>Déconnexion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir vous déconnecter ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogout(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Layout;
