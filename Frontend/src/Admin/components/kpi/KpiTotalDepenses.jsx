import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyCheckAlt } from "react-icons/fa";

const KpiTotalDepenses = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await axios.get("/api/depenses/total");
        setTotal(res.data.total);
      } catch (err) {
        console.error("Erreur chargement total dépenses :", err);
      }
    };

    fetchTotal();
  }, []);

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="text-muted mb-1">Total des Dépenses</p>
          <h4 className="fw-bold mb-0 text-danger">{total.toLocaleString("fr-FR")} DT</h4>
        </div>
        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "#dc3545", width: 44, height: 44 }}>
          <FaMoneyCheckAlt className="text-white fs-5" />
        </div>
      </div>
    </div>
  );
};

export default KpiTotalDepenses;
