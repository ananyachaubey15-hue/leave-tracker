import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function AddLeave() {
  const { user } = useAuth();

  const [leaveType, setLeaveType] = useState("CL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [days, setDays] = useState(0);

  const calculateDays = (from: string, to: string) => {
    if (!from || !to) return 0;

    const start = new Date(from);
    const end = new Date(to);

    const diff =
      Math.ceil(
        (end.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;

    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("User not found ❌");
      return;
    }

    try {
      await addDoc(collection(db, "leaveRecords"), {
        userId: user.uid,   // ✅ VERY IMPORTANT
        leaveType,
        dateFrom: Timestamp.fromDate(new Date(dateFrom)),
        dateTo: Timestamp.fromDate(new Date(dateTo)),
        days: Number(days),
        createdAt: Timestamp.now(),
      });

      alert("Leave added ✅");
      window.location.href = "/dashboard";

    } catch (error) {
      console.error(error);
      alert("Error adding leave ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EE] px-6 py-8">
      <div className="max-w-md mx-auto space-y-6 bg-white border border-[#E8E2DD] rounded-3xl shadow-sm p-6">

        <h2 className="text-2xl font-semibold text-[#7A4F3A]">
          Add Leave
        </h2>

        <select
          value={leaveType}
          onChange={(e) => setLeaveType(e.target.value)}
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3"
        >
          <option value="CL">Casual Leave (CL)</option>
          <option value="HPL">Half Pay Leave (HPL)</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {
            const value = e.target.value;
            setDateFrom(value);
            setDays(calculateDays(value, dateTo));
          }}
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => {
            const value = e.target.value;
            setDateTo(value);
            setDays(calculateDays(dateFrom, value));
          }}
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3"
        />

        <input
          type="number"
          value={days}
          readOnly
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3 bg-gray-50"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#7A4F3A] text-white py-3 rounded-2xl shadow-md"
        >
          Save Leave
        </button>

      </div>
    </div>
  );
}

export default AddLeave;