import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#f97316"];

type Props = {
  usedCL: number;
  usedHPL: number;
  monthlyData: { month: string; days: number }[];
};

function LeaveCharts({ usedCL, usedHPL, monthlyData }: Props) {
  const pieData = [
    { name: "CL Used", value: usedCL },
    { name: "HPL Used", value: usedHPL },
  ];

  return (
    <div style={{ marginTop: 24 }}>
      {/* 🥧 Pie Chart */}
      <h3 style={{ marginBottom: 8 }}>Leave Distribution</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            outerRadius={90}
            label
          >
            {pieData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* 📊 Monthly Bar Chart */}
      <h3 style={{ marginTop: 28, marginBottom: 8 }}>
        Monthly Leaves
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={monthlyData}>
          <XAxis dataKey="month" stroke="#e5e7eb" />
          <YAxis stroke="#e5e7eb" />
          <Tooltip />
          <Bar dataKey="days" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LeaveCharts;