import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  calculateRemaining,
  calculateCarryForward,
} from "../utils/calculations";
import LeaveCharts from "../components/LeaveCharts";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

function Dashboard() {
  const [usedCL, setUsedCL] = useState(0);
  const [usedHPL, setUsedHPL] = useState(0);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; days: number }[]
  >([]);

  // 🔓 logout handler
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

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

  return (
    <div
      style={{
        padding: 16,
        maxWidth: 500,
        margin: "0 auto",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* ✅ Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Leave Dashboard 📊</h2>

        <button
          onClick={handleLogout}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            border: "1px solid #1f2937",
            background: "#111827",
            color: "#e5e7eb",
          }}
        >
          Logout 🔓
        </button>
      </div>

      {/* ✅ CL Card */}
      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          color: "#e5e7eb",
          padding: 14,
          borderRadius: 14,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <strong style={{ fontSize: 16 }}>Casual Leave (CL)</strong>
        <div style={{ marginTop: 6 }}>Used: {usedCL}</div>
        <div>Remaining: {remainingCL}</div>
        <div>Carry: {carryCL}</div>
      </div>

      {/* ✅ HPL Card */}
      <div
        style={{
          background: "#111827",
          border: "1px solid #1f2937",
          color: "#e5e7eb",
          padding: 14,
          borderRadius: 14,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <strong style={{ fontSize: 16 }}>Half Pay Leave (HPL)</strong>
        <div style={{ marginTop: 6 }}>Used: {usedHPL}</div>
        <div>Remaining: {remainingHPL}</div>
        <div>Carry: {carryHPL}</div>
      </div>

      {/* ✅ Charts */}
      <LeaveCharts
        usedCL={usedCL}
        usedHPL={usedHPL}
        monthlyData={monthlyData}
      />

      {/* ✅ Add Leave */}
      <button
        onClick={() => (window.location.href = "/add-leave")}
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          borderRadius: 12,
          border: "none",
          background: "#0088FE",
          color: "white",
          fontWeight: 600,
        }}
      >
        Add Leave ➕
      </button>

      {/* ✅ History */}
      <button
        onClick={() => (window.location.href = "/history")}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #1f2937",
          background: "#111827",
          color: "#ede9ff",
        }}
      >
        View History 📜
      </button> 

      <button
        onClick={() => (window.location.href = "/calendar")}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 10,
          border: "1px solid #1f2937",
          background: "#111827",
          color: "#ffffff",
        }}
     >
        View Calendar 📅
      </button>
    </div>
  );
}

export default Dashboard;