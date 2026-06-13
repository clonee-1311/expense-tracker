import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CATEGORY_COLORS, formatCurrency } from "../utils/helpers";

function CategoryChart({ byCategory }) {
  if (!byCategory || Object.keys(byCategory).length === 0) {
    return (
      <div className="card chart-section" style={{ textAlign: "center", color: "#94a3b8", padding: "32px" }}>
        No spending data for this month yet.
      </div>
    );
  }

  const data = Object.entries(byCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // custom tooltip that shows the formatted rupee amount
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "0.85rem",
          }}
        >
          <strong>{payload[0].name}</strong>
          <br />
          {formatCurrency(payload[0].value)}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card chart-section">
      <h3 style={{ marginBottom: "16px", color: "#2d3748", fontSize: "1rem" }}>
        Spending by Category — This Month
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name] || "#64748b"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
