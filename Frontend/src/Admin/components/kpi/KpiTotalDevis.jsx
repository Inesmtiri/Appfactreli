import React, { useEffect, useState } from "react";
import axios from "axios";
import KpiCard from "./KpiCard";
import { FaFileAlt } from "react-icons/fa";

const KpiTotalDevis = () => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const res = await axios.get("/api/devis/total");
        setTotal(res.data.total);
      } catch (err) {
        console.error("Erreur chargement total devis :", err);
      }
    };

    fetchTotal();
  }, []);

  return (
    <KpiCard
      title="Total des Devis"
      value={total}
      icon={<FaFileAlt />}
      iconBg="#198754"
    />
  );
};

export default KpiTotalDevis;
