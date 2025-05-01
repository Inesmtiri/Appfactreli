import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers } from "react-icons/fa";

const KpiClientsActifs = () => {
  const [data, setData] = useState({ total: 0, actifs: 0 });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("/api/clients/kpi");
        setData(res.data);
      } catch (err) {
        console.error("Erreur chargement clients actifs :", err);
      }
    };

    fetchClients();
  }, []);

  const pourcentage = data.total ? ((data.actifs / data.total) * 100).toFixed(1) : 0;

  return (
    <div className="col-md-3 col-sm-6 mb-4">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">Clients Actifs</p>
            <h4 className="fw-bold mb-0">
              {data.actifs} / {data.total}{" "}
              <span className="text-success" style={{ fontSize: "0.85rem" }}>
                ({pourcentage}%)
              </span>
            </h4>
          </div>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: "#dc3545",
              width: 44,
              height: 44,
            }}
          >
            <FaUsers className="text-white fs-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiClientsActifs;
