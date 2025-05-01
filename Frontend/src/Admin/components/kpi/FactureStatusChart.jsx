import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = {
  payé: "#28a745",       // vert
  partiel: "#ffc107",    // jaune
  nonPayé: "#dc3545",    // rouge
};

const FactureStatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/api/factures/statut-mensuel");
        setData(res.data);
      } catch (err) {
        console.error("Erreur chargement des statistiques :", err);
      }
    };

    fetchStats();
  }, []);

  if (!data.length) return <p>Chargement du graphique...</p>;

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <h5 className="text-center mt-4">📊 Statut des factures par mois</h5>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="nonPayé" stackId="a" fill={COLORS.nonPayé} name="Non payé" />
          <Bar dataKey="partiel" stackId="a" fill={COLORS.partiel} name="Partiellement payé" />
          <Bar dataKey="payé" stackId="a" fill={COLORS.payé} name="Payé" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FactureStatusChart;
