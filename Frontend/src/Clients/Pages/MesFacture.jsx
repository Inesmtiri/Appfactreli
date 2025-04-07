// src/Clients/Pages/MesFacture.jsx

import React from "react";
import FactureCard from "../Components/FactureCard"; // ✅ import corrigé

const MesFacture = () => {
  const factures = [
    { id: "660fef1c98e17a1a768bf991", numero: "FAC-001", date: "2025-03-25", montant: "500 TND" },
    { id: "660fef1c98e17a1a768bf992", numero: "FAC-002", date: "2025-03-27", montant: "300 TND" },
  ];

  return (
    <div className="p-4">
      <h2 className="mb-4">Mes Factures</h2>
      <div className="row">
        {factures.map((facture) => (
          <FactureCard
            key={facture.id}
            id={facture.id}
            numero={facture.numero}
            date={facture.date}
            montant={facture.montant}
          />
        ))}
      </div>
    </div>
  );
};

export default MesFacture;


