import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RevenueProfitChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [paiementsRes, depensesRes] = await Promise.all([
          axios.get("/api/paiements/stats-mensuelles"),
          axios.get("/api/depenses/stats-mensuelles"),
        ]);

        const paiements = paiementsRes.data;
        const depenses = depensesRes.data;

        const fusion = paiements.map((p) => {
          const d = depenses.find((d) => d.mois === p.mois);
          const totalDepense = d?.total || 0;
          return {
            mois: p.mois,
            revenus: p.total,
            depenses: totalDepense,
            profit: p.total - totalDepense,
          };
        });

        setData(fusion);
      } catch (error) {
        console.error("Erreur chargement des données KPI :", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <h6 className="text-center mb-2">📈 Revenus, Dépenses & Profits</h6>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="mois" />
          <YAxis />
          <Tooltip formatter={(value) => `${value} DT`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenus"
            stroke="#28a745"
            strokeWidth={2}
            name="Revenus"
          />
          <Line
            type="monotone"
            dataKey="depenses"
            stroke="#dc3545"
            strokeWidth={2}
            name="Dépenses"
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#ffc107"
            strokeWidth={2}
            name="Profit"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueProfitChart;
