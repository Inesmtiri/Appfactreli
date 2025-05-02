import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ZAxis,
} from "recharts";

const PALETTE = [
  "#007bff", "#17a2b8", "#ffc107", "#28a745", "#dc3545",
  "#6f42c1", "#fd7e14", "#6610f2", "#20c997", "#e83e8c",
];

const ProduitRentableChart = () => {
  const [data, setData] = useState([]);
  const [colors, setColors] = useState({});

  useEffect(() => {
    const fetchRentables = async () => {
      try {
        const res = await axios.get("/api/factures/produits-rentables");
        const formatted = res.data.map((item, index) => ({
          ...item,
          color: PALETTE[index % PALETTE.length],
        }));

        const colorMap = {};
        formatted.forEach((item) => {
          colorMap[item.designation] = item.color;
        });

        setData(formatted);
        setColors(colorMap);
      } catch (err) {
        console.error("Erreur chargement rentabilité :", err);
      }
    };

    fetchRentables();
  }, []);

  if (!data.length)
    return <p className="text-center">Chargement du graphique...</p>;

  return (
    <div style={{ width: "100%" }}>
      <h6 className="text-center mb-2">
        💎 Produits & Services les plus rentables
      </h6>

      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 30 }}>
          <CartesianGrid vertical={false} horizontal={false} />

          <XAxis
            type="category"
            dataKey="designation"
            tick={{ fontSize: 11 }}
            interval={0}
            axisLine={false}
            tickLine={false}
            height={50}
          />
          <YAxis
            type="number"
            dataKey="revenu"
            name="Revenu (DT)"
            tick={{ fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <ZAxis
            type="number"
            dataKey="quantite"
            name="Quantité vendue"
            range={[100, 200]} // ✅ taille réduite
          />

          <Tooltip
            formatter={(value, name) =>
              name === "quantite"
                ? `${value} unités`
                : `${value.toLocaleString()} `
            }
            labelFormatter={(label) => `Produit / Service : ${label}`}
          />

          <Legend
            verticalAlign="bottom"
            payload={data.map((item) => ({
              value: item.designation,
              type: "circle",
              color: item.color,
              id: item.designation,
            }))}
            wrapperStyle={{ textAlign: "center", fontSize: 12 }}
          />

          <Scatter
            data={data}
            shape={({ cx, cy, size, payload }) => (
              <circle cx={cx} cy={cy} r={Math.sqrt(size)} fill={payload.color} />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProduitRentableChart;
