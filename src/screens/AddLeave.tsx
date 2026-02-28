import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebase";

function AddLeave() {
  const [leaveType, setLeaveType] = useState("CL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [days, setDays] = useState(0);

  // 🔢 Auto days calculator
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
    try {
      await addDoc(collection(db, "leaveRecords"), {
        leaveType,
        dateFrom: Timestamp.fromDate(new Date(dateFrom)),
        dateTo: Timestamp.fromDate(new Date(dateTo)),
        days: Number(days),
        year: new Date(dateFrom).getFullYear(),
        createdAt: Timestamp.now(),
      });

      alert("Leave added ✅");
    } catch (error) {
      console.error(error);
      alert("Error adding leave ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Leave ➕</h2>

      <select
        value={leaveType}
        onChange={(e) => setLeaveType(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      >
        <option value="CL">Casual Leave (CL)</option>
        <option value="HPL">Half Pay Leave (HPL)</option>
      </select>

      {/* 📅 From Date */}
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => {
          const value = e.target.value;
          setDateFrom(value);
          setDays(calculateDays(value, dateTo));
        }}
        style={{ display: "block", marginBottom: 10 }}
      />

      {/* 📅 To Date */}
      <input
        type="date"
        value={dateTo}
        onChange={(e) => {
          const value = e.target.value;
          setDateTo(value);
          setDays(calculateDays(dateFrom, value));
        }}
        style={{ display: "block", marginBottom: 10 }}
      />

      {/* 🔢 Auto calculated days */}
      <input
        type="number"
        value={days}
        readOnly
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={handleSubmit}>Save Leave</button>
    </div>
  );
}

export default AddLeave;