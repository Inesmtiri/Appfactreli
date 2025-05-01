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
        console.error("Erreur chargement du profit :", err);
      }
    };

    fetchProfit();
  }, []);

  return (
    <div className="card shadow-sm border-0 p-3 h-100">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <p className="text-muted mb-1">Total Profit</p>
          <h3 className="fw-bold mb-0 text-success">
            {profit.toLocaleString("fr-FR")} DT
          </h3>
        </div>
        <div
          className="bg-success text-white rounded-circle p-3 d-flex align-items-center justify-content-center"
          style={{ width: "50px", height: "50px" }}
        >
          <FaMoneyBillWave size={22} />
        </div>
      </div>
    </div>
  );
};

export default KpiTotalProfit;
