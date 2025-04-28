import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaSignOutAlt,
  FaSearch,
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaFileAlt,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaShoppingCart,
  FaBox,
  FaUserEdit,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import EditAdressePasswordModal from "./EditProfileModal";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    _id: "",
  });

  const menuRef = useRef();
  const activeModule = routeToModule[location.pathname];

  // 🔄 Charger les données utilisateur depuis localStorage ou backend
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const userId = localStorage.getItem("userId");
      const fetchUser = async () => {
        try {
          const res = await axios.get(`http://localhost:3001/api/users/${userId}`);
          setUser(res.data);
          localStorage.setItem("userData", JSON.stringify(res.data));
        } catch (err) {
          console.error("Erreur lors du chargement utilisateur :", err);
        }
      };
      if (userId) fetchUser();
    }
  }, []);

  const getInitials = () => {
    const f = user.firstName?.[0]?.toUpperCase() || "";
    const l = user.lastName?.[0]?.toUpperCase() || "";
    return f + l;
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSearchClick = () => onSearch && onSearch(searchTerm);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleProfileClick = () => {
    setShowProfileModal(true);
    setMenuOpen(false);
  };
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Lors de la sauvegarde du profil (depuis le modal)
  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    setShowProfileModal(false);
  };

  return (
    <>
      <nav
        className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm"
        style={{
          position: "fixed",
          left: "230px",
          top: 0,
          right: 0,
          zIndex: 9999,
          height: "60px",
          borderBottom: "1px solid #eee",
        }}
      >
        {/* Module actif */}
        <div className="d-flex align-items-center gap-2 text-dark">
          {activeModule?.icon}
          <span className="fst-italic fw-semibold">{activeModule?.name}</span>
        </div>

        {/* Recherche + Avatar */}
        <div className="d-flex align-items-center gap-3">
          <div className="input-group" style={{ width: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Recherche..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span
              className="input-group-text"
              style={{ cursor: "pointer", backgroundColor: "#ffffff" }}
              onClick={handleSearchClick}
            >
              <FaSearch />
            </span>
          </div>

          <div className="position-relative" ref={menuRef}>
            <div
              className="rounded-circle bg-primary text-white fw-bold d-flex justify-content-center align-items-center"
              style={{
                width: 38,
                height: 38,
                cursor: "pointer",
                fontSize: "16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
              onClick={toggleMenu}
              title="Profil"
            >
              {user.firstName && user.lastName ? getInitials() : <FaUser />}
            </div>

            {menuOpen && (
              <div
                className="position-absolute border rounded-2 bg-white shadow-sm"
                style={{
                  top: "120%",
                  right: 0,
                  width: "200px",
                  zIndex: 1000,
                }}
              >
                <div className="px-3 pt-3 pb-2 border-bottom fw-bold text-dark small">
                  compte
                </div>
                <button
                  className="w-100 text-start border-0 bg-transparent px-3 py-2 d-flex align-items-center gap-2 hoverable"
                  onClick={handleProfileClick}
                >
                  <FaUserEdit />
                  Modifier le profil
                </button>
                <button
                  className="w-100 text-start border-0 bg-transparent px-3 py-2 d-flex align-items-center gap-2 hoverable text-danger"
                  onClick={onLogout}
                >
                  <FaSignOutAlt />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        <style>{`
          .hoverable:hover {
            background-color: #f5f5f5;
            cursor: pointer;
          }
        `}</style>
      </nav>

      {/* ✅ Modal avec mise à jour backend + localStorage */}
      <EditAdressePasswordModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onSave={handleUserUpdate}
      />
    </>
  );
};

export default Navbar;
