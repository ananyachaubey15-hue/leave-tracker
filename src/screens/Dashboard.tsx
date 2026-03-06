import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import {
  calculateRemaining,
  calculateCarryForward,
} from "../utils/calculations";
import LeaveCharts from "../components/LeaveCharts";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { logout } = useAuth();

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

  return (
    <div className="min-h-screen bg-[#F4F1EE] px-6 py-8">
      <div className="max-w-md mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-semibold text-[#7A4F3A]">
              Hello there 🐱
            </h2>
            <p className="text-gray-500 mt-1">
              Track your leaves peacefully
            </p>
          </div>

          <button
            onClick={logout}
            className="text-red-400 hover:opacity-70 text-sm"
          >
            Logout
          </button>
        </div>

        {/* CL Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E2DD] p-6">
          <h3 className="font-semibold text-[#7A4F3A] mb-3">
            Casual Leave (CL)
          </h3>
          <p>Used: {usedCL}</p>
          <p>Remaining: {remainingCL}</p>
          <p>Carry: {carryCL}</p>
        </div>

        {/* HPL Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E2DD] p-6">
          <h3 className="font-semibold text-[#7A4F3A] mb-3">
            Half Pay Leave (HPL)
          </h3>
          <p>Used: {usedHPL}</p>
          <p>Remaining: {remainingHPL}</p>
          <p>Carry: {carryHPL}</p>
        </div>

        {/* Charts */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#E8E2DD] p-6">
          <LeaveCharts
            usedCL={usedCL}
            usedHPL={usedHPL}
            monthlyData={monthlyData}
          />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;