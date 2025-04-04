import React from "react";
import { useNavigate } from "react-router-dom";

const FactureCard = ({ numero, date, montant, id }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/client/facture/${id}`);
  };

  return (
    <div className="card col-md-4 m-2">
      <div className="card-body">
        <h5 className="card-title">Facture #{numero}</h5>
        <p>Date : {date}</p>
        <p>Montant : {montant}</p>
        <button className="btn btn-sm btn-primary" onClick={handleViewDetails}>
          Voir
        </button>
      </div>
    </div>
  );
};

export default FactureCard;


