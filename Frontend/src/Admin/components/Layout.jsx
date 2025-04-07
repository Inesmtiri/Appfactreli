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
    <div style={{ backgroundColor: "#fff" }}>
      {/* Sidebar positionnée en fixed à gauche */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
      />

      {/* Contenu principal avec une marge à gauche pour ne pas passer sous la sidebar */}
      <div
        style={{
          marginLeft: "230px", // même largeur que la sidebar
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar
          activeModule={activeModule}
          onLogout={() => setShowLogout(true)}
        />

        <div
          style={{
            flex: 1,
            padding: "20px",
            marginTop: "60px", // hauteur de la navbar si elle est fixe
            backgroundColor: "#fff",
          }}
        >
          <Outlet />
        </div>
      </div>

      {/* Modal de confirmation logout */}
      <Modal show={showLogout} backdrop="static" keyboard={false} centered>
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
