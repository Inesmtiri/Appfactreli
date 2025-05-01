import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import SidebarClient from "../../Clients/Components/SidebarClient";
import Navbar from "./Navbar";
import { Modal, Button } from "react-bootstrap";

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(false);
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const CurrentSidebar = user?.role === "client" ? SidebarClient : Sidebar;

  return (
    <div style={{ backgroundColor: "#fff" }}>
      {/* Sidebar */}
      <CurrentSidebar />

      {/* Contenu principal */}
      <div
        style={{
          marginLeft: "230px",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Navbar */}
        <Navbar onLogout={() => setShowLogout(true)} />

        <div style={{ flex: 1, padding: "20px", marginTop: "60px", backgroundColor: "#fff" }}>
          <Outlet />
        </div>
      </div>

      {/* Modal de confirmation de déconnexion */}
      <Modal show={showLogout} backdrop="static" keyboard={false} centered>
        <Modal.Header><Modal.Title>Déconnexion</Modal.Title></Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir vous déconnecter ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogout(false)}>Annuler</Button>
          <Button variant="danger" onClick={handleLogout}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Layout;
