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
  <div className="min-h-screen bg-[#F4F1EE] px-6 py-8">
    <div className="max-w-md mx-auto space-y-5">

      <h2 className="text-2xl font-semibold text-[#7A4F3A]">
        Leave History
      </h2>

      {/* Loading */}
      {loading && (
        <div className="text-gray-500 text-sm">
          Loading leaves…
        </div>
      )}

      {/* Empty state */}
      {!loading && leaves.length === 0 && (
        <div className="text-gray-400 text-sm">
          No leave records yet.
        </div>
      )}

      {/* List */}
      {leaves.map((leave) => (
        <div
          key={leave.id}
          className="
            bg-white 
            border border-[#E8E2DD] 
            rounded-3xl 
            shadow-sm 
            p-5 
            flex justify-between items-center
          "
        >
          <div>
            <p className="font-semibold text-[#7A4F3A] text-lg">
              {leave.leaveType}
            </p>
            <p className="text-gray-600 text-sm">
              {leave.days} day(s)
            </p>
            <p className="text-gray-400 text-xs">
              {formatDate(leave.dateFrom)} → {formatDate(leave.dateTo)}
            </p>
          </div>

          <button
            onClick={() => handleDelete(leave.id)}
            className="
              bg-[#E57373] 
              hover:bg-[#d85f5f] 
              text-white 
              px-4 py-2 
              rounded-xl 
              text-sm 
              shadow-sm
              transition
            "
          >
            Delete
          </button>
        </div>
      ))}

      {/* Back button */}
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="
          w-full 
          bg-white 
          border border-[#E8E2DD] 
          text-[#7A4F3A] 
          py-3 
          rounded-2xl 
          shadow-sm 
          hover:bg-[#F2EAE4] 
          transition
        "
      >
        ← Back to Dashboard
      </button>

    </div>
  </div>
);
}

export default History;