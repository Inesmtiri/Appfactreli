// src/Clients/Pages/MesDevis.jsx

import React from "react";
import DevisCard from "../Components/DevisCard";

const MesDevis = () => {
  return (
    <div>
      <h2>Mes Devis</h2>
      <div className="row">
        <DevisCard numero="000001" date="2025-03-25" montant="500 TND" />
        <DevisCard numero="000002" date="2025-03-26" montant="400 TND" />
      </div>
    </div>
  );
};

export default MesDevis;
