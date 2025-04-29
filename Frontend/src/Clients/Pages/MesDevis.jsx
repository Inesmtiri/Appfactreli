import React, { useEffect, useState } from "react";
import {
  fetchDevisClient,
  acceptDevis,
  refuseDevis,
} from "../../services/devisClientService";

const MesDevis = () => {
  const [devisList, setDevisList] = useState([]);
  const clientId = JSON.parse(localStorage.getItem("userData"))?._id; // ✅ Correction ici

  // Charger les devis du client
  useEffect(() => {
    const loadDevis = async () => {
      try {
        const data = await fetchDevisClient(clientId);
        const filtered = data.filter((devis) => devis.clientId === clientId);
        setDevisList(filtered);
      } catch (error) {
        console.error("Erreur lors du chargement des devis :", error);
      }
    };

    if (clientId) {
      loadDevis();
    }
  }, [clientId]);

  const handleAccept = async (id) => {
    try {
      await acceptDevis(id);
      const updated = await fetchDevisClient(clientId);
      setDevisList(updated.filter((devis) => devis.clientId === clientId));
    } catch (error) {
      console.error("Erreur lors de l'acceptation :", error);
    }
  };

  const handleRefuse = async (id) => {
    try {
      await refuseDevis(id);
      const updated = await fetchDevisClient(clientId);
      setDevisList(updated.filter((devis) => devis.clientId === clientId));
    } catch (error) {
      console.error("Erreur lors du refus :", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Mes Devis</h3>
      <div className="row">
        {devisList.length === 0 ? (
          <p>Aucun devis trouvé.</p>
        ) : (
          devisList.map((devis) => (
            <div key={devis._id} className="col-md-4 mb-3">
              <div className="card p-3 shadow">
                <h5>{devis.numeroDevis}</h5>
                <p><b>Total :</b> {devis.total?.toFixed(3)} DT</p>
                <p><b>Date :</b> {devis.date?.slice(0, 10)}</p>

                {devis.statut?.toLowerCase().trim() === "en attente" && (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleAccept(devis._id)}
                    >
                      Accepter
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRefuse(devis._id)}
                    >
                      Refuser
                    </button>
                  </>
                )}

                {devis.statut === "accepté" && (
                  <span className="badge bg-success">Accepté</span>
                )}
                {devis.statut === "refusé" && (
                  <span className="badge bg-danger">Refusé</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MesDevis;
