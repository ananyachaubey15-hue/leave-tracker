import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  calculateRemaining,
  calculateCarryForward,
} from "../utils/calculations";
import LeaveCharts from "../components/LeaveCharts";

function Dashboard() {
  const [usedCL, setUsedCL] = useState(0);
  const [usedHPL, setUsedHPL] = useState(0);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; days: number }[]
  >([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      const snapshot = await getDocs(collection(db, "leaveRecords"));

      let cl = 0;
      let hpl = 0;
      const monthlyMap: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const data: any = doc.data();

        if (data.leaveType === "CL") cl += Number(data.days || 0);
        if (data.leaveType === "HPL") hpl += Number(data.days || 0);

        const month = data?.dateFrom?.seconds
          ? new Date(data.dateFrom.seconds * 1000).toLocaleString(
              "default",
              { month: "short" }
            )
          : "Unknown";

        monthlyMap[month] =
          (monthlyMap[month] || 0) + Number(data.days || 0);
      });

      setUsedCL(cl);
      setUsedHPL(hpl);

      setMonthlyData(
        Object.entries(monthlyMap).map(([month, days]) => ({
          month,
          days,
        }))
      );
    };

    fetchLeaves();
  }, []);

  const { remainingCL, remainingHPL } =
    calculateRemaining(usedCL, usedHPL);

  const { carryCL, carryHPL } =
    calculateCarryForward(remainingCL, remainingHPL);

  const cardStyle = {
    background: "#111827",
    border: "1px solid #1f2937",
    color: "#e5e7eb",
    padding: 16,
    borderRadius: 16,
    boxShadow: "0 10px 28px rgba(0,0,0,0.25)",
  };

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 520,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* 🌙 Cozy Header */}
      <div>
        <h2 style={{ margin: 0 }}>Hello there 🐱</h2>
        <p style={{ marginTop: 4, opacity: 0.7 }}>
          Track your leaves peacefully
        </p>
      </div>

      {/* ✅ CL Card */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 16 }}>Casual Leave (CL)</strong>
        <div style={{ marginTop: 8 }}>Used: {usedCL}</div>
        <div>Remaining: {remainingCL}</div>
        <div>Carry: {carryCL}</div>
      </div>

      {/* ✅ HPL Card */}
      <div style={cardStyle}>
        <strong style={{ fontSize: 16 }}>Half Pay Leave (HPL)</strong>
        <div style={{ marginTop: 8 }}>Used: {usedHPL}</div>
        <div>Remaining: {remainingHPL}</div>
        <div>Carry: {carryHPL}</div>
      </div>

      {/* 📊 Charts */}
      <LeaveCharts
        usedCL={usedCL}
        usedHPL={usedHPL}
        monthlyData={monthlyData}
      />

      {/* ➕ Primary Action */}
      <button
        onClick={() => (window.location.href = "/add-leave")}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 14,
          border: "none",
          background: "#f59e0b",
          color: "#111827",
          fontWeight: 700,
          boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        }}
      >
        Add Leave ➕
      </button>

      {/* 📜 Secondary actions */}
      <button
        onClick={() => (window.location.href = "/history")}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "1px solid #1f2937",
          background: "#111827",
          color: "#e5e7eb",
        }}
      >
        View History 📜
      </button>

      <button
        onClick={() => (window.location.href = "/calendar")}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 12,
          border: "1px solid #1f2937",
          background: "#111827",
          color: "#e5e7eb",
        }}
      >
        View Calendar 📅
      </button>
    </div>
  );
}

export default Dashboard;