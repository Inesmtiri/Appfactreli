import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#28a745", "#dc3545", "#ffc107"];

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#000"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={13}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const KpiDevisChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchKpi = async () => {
      try {
        const res = await axios.get("/api/devis/kpi");
        const kpi = res.data.taux;
        setData([
          { name: "Acceptés", value: parseFloat(kpi.acceptés) },
          { name: "Refusés", value: parseFloat(kpi.refusés) },
          { name: "En attente", value: parseFloat(kpi.enAttente) },
        ]);
      } catch (error) {
        console.error("Erreur chargement KPI :", error);
      }
    };

    fetchKpi();
  }, []);

  if (!data.length) return <p>Chargement...</p>;

  return (
    <div style={{ width: "100%", maxWidth: 450, margin: "0 auto" }}>
      <h5 className="text-center mt-4">📊 Taux des devis</h5>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            formatter={(value, entry, index) => (
              <span style={{ color: COLORS[index], fontWeight: 500, fontSize: 14 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KpiDevisChart;
