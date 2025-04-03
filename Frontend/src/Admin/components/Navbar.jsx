import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaFileAlt,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaShoppingCart,
  FaBox,
} from "react-icons/fa";

const routeToModule = {
  "/dashboard": { name: "Dashboard", icon: <FaTachometerAlt /> },
  "/utilisateurs": { name: "Utilisateurs", icon: <FaUsers /> },
  "/client": { name: "Client", icon: <FaUserTie /> },
  "/devis": { name: "Devis", icon: <FaFileAlt /> },
  "/factures": { name: "Facture", icon: <FaFileAlt /> },
  "/paiement": { name: "Paiement", icon: <FaMoneyBillWave /> },
  "/projets": { name: "Projet", icon: <FaProjectDiagram /> },
  "/depenses": { name: "Depenses", icon: <FaShoppingCart /> },
  "/produits": { name: "Produit et services", icon: <FaBox /> },
};

const Navbar = ({ onLogout, onSearch }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const activeModule = routeToModule[location.pathname];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-3 bg-light shadow-sm"
      style={{
        position: "fixed",
        left: "230px",
        top: 0,
        right: 0,
        zIndex: 9999,
        height: "60px",
      }}
    >
      {/* Module actif avec icône */}
      <div className="d-flex align-items-center gap-2">
        {activeModule?.icon}
        <span className="fst-italic fw-semibold">{activeModule?.name}</span>
      </div>

      {/* Recherche et logout */}
      <div className="d-flex align-items-center gap-3">
        <div className="input-group" style={{ width: "300px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Recherche"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span
            className="input-group-text"
            style={{ cursor: "pointer" }}
            onClick={handleSearchClick}
          >
            <FaSearch />
          </span>
        </div>

        <button
          className="btn btn-link p-0"
          onClick={onLogout}
          style={{ textDecoration: "none", color: "black" }}
          title="Se déconnecter"
        >
          <FaSignOutAlt size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
