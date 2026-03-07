import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import LeaveCharts from "./LeaveCharts";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  usedCL: number;
  usedHPL: number;
  monthlyData: { month: string; days: number }[];
  onPolicySaved: () => void;
}

function AccountDrawer({
  isOpen,
  onClose,
  usedCL,
  usedHPL,
  monthlyData,
  onPolicySaved,
}: AccountDrawerProps) {

  const { user, logout } = useAuth();
  

  const [clAllowed, setClAllowed] = useState(12);
  const [hplAllowed, setHplAllowed] = useState(20);
  const [carryCLMax, setCarryCLMax] = useState(6);
  const [carryHPLMax, setCarryHPLMax] = useState(10);
  const [carryEnabled, setCarryEnabled] = useState(true);

  useEffect(() => {
    const loadPolicy = async () => {
      if (!user) return;

      const policyRef = doc(db, "leavePolicies", user.uid);
      const snapshot = await getDoc(policyRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setClAllowed(data.clAllowed ?? 12);
        setHplAllowed(data.hplAllowed ?? 20);
        setCarryCLMax(data.carryCLMax ?? 6);
        setCarryHPLMax(data.carryHPLMax ?? 10);
        setCarryEnabled(data.carryEnabled ?? true);
      }
    };

    loadPolicy();
  }, [user]);

  const savePolicy = async () => {
    if (!user) return;

    const policyRef = doc(db, "leavePolicies", user.uid);

    await setDoc(policyRef, {
      clAllowed,
      hplAllowed,
      carryCLMax,
      carryHPLMax,
      carryEnabled,
    });

    onPolicySaved(); // refresh dashboard
    alert("Policy saved ✅");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      <div className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-[#F8F5F2] shadow-2xl z-50 overflow-y-auto p-6 space-y-6">

        {/* Profile */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="profile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#7A4F3A] text-white flex items-center justify-center font-semibold">
                {user?.displayName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <p className="font-semibold">{user?.displayName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {/* Analytics Section */}
<div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
  <p className="font-semibold text-[#7A4F3A]">
    Leave Analytics
  </p>

  <LeaveCharts
    usedCL={usedCL}
    usedHPL={usedHPL}
    monthlyData={monthlyData}
  />
</div>

        {/* Policy */}
        <div className="bg-white p-4 rounded-xl space-y-3 shadow-sm">
          <p className="font-semibold text-[#7A4F3A]">
            Leave Policy
          </p>

          <div>
            <label>CL Allowed</label>
            <input
              type="number"
              value={clAllowed}
              onChange={(e) => setClAllowed(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label>HPL Allowed</label>
            <input
              type="number"
              value={hplAllowed}
              onChange={(e) => setHplAllowed(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label>CL Carry Max</label>
            <input
              type="number"
              value={carryCLMax}
              onChange={(e) => setCarryCLMax(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label>HPL Carry Max</label>
            <input
              type="number"
              value={carryHPLMax}
              onChange={(e) => setCarryHPLMax(Number(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-between">
            <span>Enable Carry</span>
            <input
              type="checkbox"
              checked={carryEnabled}
              onChange={(e) => setCarryEnabled(e.target.checked)}
            />
          </div>

          <button
            onClick={savePolicy}
            className="w-full py-2 bg-[#7A4F3A] text-white rounded-lg"
          >
            Save Policy
          </button>
        </div>


        <button
          onClick={logout}
          className="w-full py-2 bg-black text-white rounded-lg"
        >
          Logout
        </button>

      </div>
    </>
  );
}

export default AccountDrawer;