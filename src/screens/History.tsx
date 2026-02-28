import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/firebase";

type LeaveItem = {
  id: string;
  leaveType: string;
  days: number;
  dateFrom?: any;
  dateTo?: any;
};

function History() {
  const [leaves, setLeaves] = useState<LeaveItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    const snapshot = await getDocs(collection(db, "leaveRecords"));

    const list: LeaveItem[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));

    setLeaves(list);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this leave?");
    if (!ok) return;

    await deleteDoc(doc(db, "leaveRecords", id));

    // ✅ instant UI update (no full reload feel)
    setLeaves((prev) => prev.filter((l) => l.id !== id));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const formatDate = (ts: any) => {
    if (!ts?.seconds) return "-";
    return new Date(ts.seconds * 1000).toLocaleDateString();
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
        gap: 14,
      }}
    >
      <h2 style={{ marginBottom: 6 }}>Leave History 📜</h2>

      {/* 🔄 Loading */}
      {loading && (
        <div style={{ opacity: 0.7 }}>Loading leaves…</div>
      )}

      {/* 📭 Empty state */}
      {!loading && leaves.length === 0 && (
        <div style={{ opacity: 0.7 }}>
          No leave records yet.
        </div>
      )}

      {/* 📋 List */}
      {leaves.map((leave) => (
        <div
          key={leave.id}
          style={{
            background: "#111827",
            border: "1px solid #1f2937",
            padding: 14,
            borderRadius: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14 }}>
            <strong>{leave.leaveType}</strong>
            <div style={{ opacity: 0.8 }}>
              {leave.days} day(s)
            </div>
            <div style={{ opacity: 0.6, fontSize: 12 }}>
              {formatDate(leave.dateFrom)} →{" "}
              {formatDate(leave.dateTo)}
            </div>
          </div>

          <button
            onClick={() => handleDelete(leave.id)}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Delete 🗑️
          </button>
        </div>
      ))}

      {/* 🔙 Back */}
      <button
        onClick={() => (window.location.href = "/dashboard")}
        style={{
          marginTop: 10,
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

export default History;