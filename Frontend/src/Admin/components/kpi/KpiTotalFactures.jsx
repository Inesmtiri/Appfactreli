import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileInvoice } from "react-icons/fa";

const KpiTotalFactures = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await axios.get("/api/factures/total");
        setTotal(res.data.total);
      } catch (err) {
        console.error("Erreur chargement total factures :", err);
      }
    };

    fetchTotal();
  }, []);

  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">Total des Factures</p>
            <h4 className="fw-bold mb-0">{total.toLocaleString("fr-FR")}</h4>
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#0d6efd",
              width: 44,
              height: 44,
            }}
          >
            <FaFileInvoice className="text-white fs-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiTotalFactures;
