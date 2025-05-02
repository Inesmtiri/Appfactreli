import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave } from "react-icons/fa";

const KpiTotalProfit = () => {
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    const fetchProfit = async () => {
      try {
        const res = await axios.get("/api/factures/profit");
        setProfit(res.data.profit);
      } catch (err) {
        console.error("Erreur chargement profit :", err);
      }
    };

    fetchProfit();
  }, []);

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="text-muted mb-1">Total Profit</p>
          <h4 className="fw-bold mb-0 text-success">
            {profit.toLocaleString("fr-FR")} DT
          </h4>
        </div>
        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: "#198754", width: 44, height: 44 }}>
          <FaMoneyBillWave className="text-white fs-5" />
        </div>
      </div>
    </div>
  );
};

export default KpiTotalProfit;
