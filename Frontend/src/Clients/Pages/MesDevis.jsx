import React, { useEffect, useState } from "react";
import {
  fetchDevisClient,
  acceptDevis,
  refuseDevis,
} from "../../services/devisClientService";

const MesDevis = () => {
  const [devisList, setDevisList] = useState([]);
  const clientId = JSON.parse(localStorage.getItem("user"))?.id;

  // Chargement des devis dès que le composant est monté
  useEffect(() => {
    const loadDevis = async () => {
      const data = await fetchDevisClient(clientId);
      console.log("📦 Devis récupérés : ", data); // Pour vérifier les données
      setDevisList(data);
    };
    loadDevis();
  }, [clientId]);

  // Accepter un devis
  const handleAccept = async (id) => {
    try {
      console.log("🟢 Accepter devis avec id : ", id);
      await acceptDevis(id);  // Appel à l'API pour accepter le devis
      const updatedData = await fetchDevisClient(clientId); // Récupérer la liste mise à jour des devis
      setDevisList(updatedData);  // Mettre à jour l'état avec les nouveaux devis
    } catch (error) {
      console.error("Erreur lors de l'acceptation du devis :", error);
    }
  };

  // Refuser un devis
  const handleRefuse = async (id) => {
    try {
      console.log("🔴 Refuser devis avec id : ", id);
      await refuseDevis(id);  // Appel à l'API pour refuser le devis
      const updatedData = await fetchDevisClient(clientId); // Récupérer la liste mise à jour des devis
      setDevisList(updatedData);  // Mettre à jour l'état avec les nouveaux devis
    } catch (error) {
      console.error("Erreur lors du refus du devis :", error);
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
                <p><b>Total :</b> {devis.total} DT</p>
                <p><b>Date :</b> {devis.date?.slice(0, 10)}</p>
                

                {/* Affichage des boutons selon le statut */}
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
