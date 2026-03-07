import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import AccountDrawer from "../components/AccountDrawer";

function Dashboard() {
  const { user } = useAuth();

  const [policy, setPolicy] = useState<any>(null);
  const [usedCL, setUsedCL] = useState(0);
  const [usedHPL, setUsedHPL] = useState(0);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; days: number }[]
  >([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 🔁 Load Policy
  const loadPolicy = async () => {
    if (!user) return;

    const policyRef = doc(db, "leavePolicies", user.uid);
    const snapshot = await getDoc(policyRef);

    if (snapshot.exists()) {
      setPolicy(snapshot.data());
    }
  };

  useEffect(() => {
    loadPolicy();
  }, [user]);

  // 🔁 Load Leaves + Monthly
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

        if (data.dateFrom?.seconds) {
          const month = new Date(
            data.dateFrom.seconds * 1000
          ).toLocaleString("default", { month: "short" });

          monthlyMap[month] =
            (monthlyMap[month] || 0) + Number(data.days || 0);
        }
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

  const remainingCL = (policy?.clAllowed ?? 0) - usedCL;
  const remainingHPL = (policy?.hplAllowed ?? 0) - usedHPL;

  const carryCL =
    policy?.carryEnabled
      ? Math.min(Math.max(remainingCL, 0), policy?.carryCLMax ?? 0)
      : 0;

  const carryHPL =
    policy?.carryEnabled
      ? Math.min(Math.max(remainingHPL, 0), policy?.carryHPLMax ?? 0)
      : 0;

  return (
    <div className="min-h-screen bg-[#F4F1EE] px-6 py-8">
      <div className="max-w-md mx-auto space-y-6">

        {/* Header */}
        <div
          onClick={() => setIsDrawerOpen(true)}
          className="cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#7A4F3A] text-white flex items-center justify-center">
                {user?.displayName?.charAt(0)}
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold">
            Hello {user?.displayName}
          </h2>
        </div>

        {/* CL */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Casual Leave (CL)</h3>
          <p>Used: {usedCL}</p>
          <p>Remaining: {remainingCL}</p>
          <p>Carry: {carryCL}</p>
        </div>

        {/* HPL */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3>Half Pay Leave (HPL)</h3>
          <p>Used: {usedHPL}</p>
          <p>Remaining: {remainingHPL}</p>
          <p>Carry: {carryHPL}</p>
        </div>

      </div>

      <AccountDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        usedCL={usedCL}
        usedHPL={usedHPL}
        monthlyData={monthlyData}   // 🔥 FIXED
        onPolicySaved={loadPolicy}
      />
    </div>
  );
}

export default Dashboard;