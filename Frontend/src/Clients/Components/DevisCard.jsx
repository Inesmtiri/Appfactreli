import React from "react";

const DevisCard = ({ numero, date, montant }) => {
  return (
    <div className="card col-md-4 m-2">
      <div className="card-body">
        <h5 className="card-title">Devis #{numero}</h5>
        <p>Date : {date}</p>
        <p>Montant : {montant}</p>
      </div>
    </div>
  );
};

export default DevisCard;