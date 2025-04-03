
import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaTrash, FaBox } from "react-icons/fa";

const ProduitList = ({ produits, onDelete }) => {
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
              key={produit.id}
              className="d-flex justify-content-between align-items-center border rounded p-3 bg-light"
            >
              {/* Partie gauche */}
              <div className="d-flex align-items-center gap-3">
                <FaBox size={20} color="#23BD15" />

                <div>
                  {/* Référence du produit */}
                  <div className="fw-bold">
                    {produit.reference || "Sans référence"}
                  </div>

                  {/* Catégorie */}
                  <div className="text-muted small">
                    Catégorie : {produit.categorie || "Non spécifiée"}
                  </div>
                </div>
              </div>

              {/* Partie droite */}
              <div className="d-flex align-items-center gap-3">
                {/* Statut */}
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

                {/* Bouton supprimer */}
                <Button
                  variant="link"
                  className="text-dark p-0"
                  onClick={() => onDelete(produit.id)}
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


