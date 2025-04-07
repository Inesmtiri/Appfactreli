import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaTrash, FaBox } from "react-icons/fa";
import axios from "axios";

const ProduitList = ({ produits, onDelete }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/produits/${id}`);
      onDelete(id); // callback pour mettre à jour le state côté parent
    } catch (error) {
      console.error("❌ Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression du produit.");
    }
  };

  return (
    <Card className="shadow-sm p-4 mx-auto" style={{ maxWidth: "900px" }}>
      <h5 className="mb-3 fst-italic">• Mes produits :</h5>

      {produits.length === 0 ? (
        <p className="text-center text-muted">
          Aucun produit ajouté pour l'instant.
        </p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {produits.map((produit) => (
            <div
              key={produit._id || produit.id} // gère _id (Mongo) ou id local
              className="d-flex justify-content-between align-items-center border rounded p-3 bg-light"
            >
              {/* Partie gauche */}
              <div className="d-flex align-items-center gap-3">
                <FaBox size={20} color="#23BD15" />
                <div>
                  <div className="fw-bold">
                    {produit.reference || "Sans référence"}
                  </div>
                  <div className="text-muted small">
                    Catégorie : {produit.categorie || "Non spécifiée"}
                  </div>
                </div>
              </div>

              {/* Partie droite */}
              <div className="d-flex align-items-center gap-3">
                <span
                  className="badge"
                  style={{
                    backgroundColor:
                      produit.statut === "rupture" ? "#E74C3C" : "#F39C12",
                    color: "white",
                    fontWeight: "500",
                    fontSize: "0.8rem",
                    padding: "5px 10px",
                    borderRadius: "12px"
                  }}
                >
                  {produit.statut === "rupture" ? "Rupture" : "En stock"}
                </span>

                <Button
                  variant="link"
                  className="text-dark p-0"
                  onClick={() => handleDelete(produit._id || produit.id)}
                  title="Supprimer ce produit"
                >
                  <FaTrash size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ProduitList;
