import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MesFacturesClient() {
  const [factures, setFactures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const client = JSON.parse(localStorage.getItem("user")); // récupère l'ID du client
        const res = await axios.get(`http://localhost:3001/api/mes-factures/${client.id}`);
        setFactures(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des factures :", err);
      }
    };

    fetchFactures();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📄 Mes factures reçues</h2>

      {factures.length === 0 ? (
        <p>Vous n'avez encore reçu aucune facture.</p>
      ) : (
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Référence</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {factures.map((facture, index) => (
              <tr key={facture._id}>
                <td>{index + 1}</td>
                <td>{facture.reference}</td>
                <td>{new Date(facture.date).toLocaleDateString()}</td>
                <td>{facture.total} TND</td>
                <td>
                  <span className={`badge ${facture.statut === "payé" ? "bg-success" : "bg-danger"}`}>
                    {facture.statut}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/client/facture/${facture._id}`)}
                  >
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
