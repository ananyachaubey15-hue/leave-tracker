import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

type LeaveMap = Record<string, "CL" | "HPL">;

// ✅ Local date formatter (FIXES timezone bug)
const formatLocalDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/* 🟢 Demo holiday list — edit anytime */
const HOLIDAYS = [
  "2026-01-26", // Republic Day
  "2026-08-15", // Independence Day
  "2026-10-02", // Gandhi Jayanti
  "2026-12-25", // Christmas
];

function CalendarView() {
  const [leaveMap, setLeaveMap] = useState<LeaveMap>({});

  useEffect(() => {
    const fetchLeaves = async () => {
      const snap = await getDocs(collection(db, "leaveRecords"));

      const map: LeaveMap = {};

      snap.forEach((doc) => {
        const data: any = doc.data();

        if (data?.dateFrom?.seconds && data?.dateTo?.seconds) {
          const start = new Date(data.dateFrom.seconds * 1000);
          const end = new Date(data.dateTo.seconds * 1000);
          const type = data.leaveType === "HPL" ? "HPL" : "CL";

          // ✅ fill full leave range (LOCAL TIME SAFE)
          for (
            let d = new Date(start);
            d <= end;
            d.setDate(d.getDate() + 1)
          ) {
            const key = formatLocalDate(d); // ⭐ FIXED
            map[key] = type;
          }
        }
      });

      setLeaveMap(map);
    };

    fetchLeaves();
  }, []);

  // 🎨 tile styling with priority: Leave > Holiday
  const tileClassName = ({ date }: any) => {
    const key = formatLocalDate(date); // ⭐ FIXED

    const leaveType = leaveMap[key];

    if (leaveType === "CL") return "leave-day-cl";
    if (leaveType === "HPL") return "leave-day-hpl";
    if (HOLIDAYS.includes(key)) return "holiday-day";

    return "";
  };

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
      <h2 style={{ margin: 0 }}>Leave Calendar 📅</h2>

      <Calendar tileClassName={tileClassName} />

      {/* 🧭 Legend */}
      <div
        style={{
          fontSize: 12,
          opacity: 0.85,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>🔴 CL</span>
        <span>🟠 HPL</span>
        <span>🟢 Holiday</span>
      </div>

      <button
        onClick={() => (window.location.href = "/dashboard")}
        style={{
          padding: 12,
          borderRadius: 10,
          border: "1px solid #1f2937",
          background: "#111827",
          color: "#e5e7eb",
        }}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}

export default CalendarView;