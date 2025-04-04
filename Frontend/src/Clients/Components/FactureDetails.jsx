// src/Clients/Components/FactureDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FactureDetails = () => {
  const { id } = useParams(); // récupère l'id de l'URL
  const [facture, setFacture] = useState(null);

  useEffect(() => {
    const fetchFacture = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/factures/${id}`);
        setFacture(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement de la facture :", err);
      }
    };

    fetchFacture();
  }, [id]);

  if (!facture) return <div>Chargement de la facture...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">🧾 Détails de la facture : {facture.numeroFacture}</h2>

      <div className="mb-3"><strong>Entreprise :</strong> {facture.nomEntreprise}</div>
      <div className="mb-3"><strong>Date :</strong> {new Date(facture.date).toLocaleDateString()}</div>
      <div className="mb-3"><strong>Référence :</strong> {facture.reference}</div>
      <div className="mb-3"><strong>Client :</strong> {facture.client?.nom || "Client externe"}</div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantité</th>
            <th>Prix Unitaire</th>
            <th>Total Ligne</th>
          </tr>
        </thead>
        <tbody>
          {facture.lignes.map((ligne, index) => (
            <tr key={index}>
              <td>{ligne.description}</td>
              <td>{ligne.quantite}</td>
              <td>{ligne.prixUnitaire} TND</td>
              <td>{(ligne.quantite * ligne.prixUnitaire).toFixed(3)} TND</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />
      <p><strong>Subtotal :</strong> {facture.subtotal.toFixed(3)} TND</p>
      <p><strong>TVA :</strong> {facture.tax.toFixed(3)} TND</p>
      <h5><strong>Total :</strong> {facture.total.toFixed(3)} TND</h5>
    </div>
  );
};

export default FactureDetails;

