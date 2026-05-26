import { useAuth } from "../context/AuthContext";

import LeaveCharts from "./LeaveCharts";

interface AccountDrawerProps {

  isOpen: boolean;

  onClose: () => void;

  usedCL: number;

  usedHPL: number;

  monthlyData: {
    month: string;
    days: number;
  }[];
}

function AccountDrawer({

  isOpen,

  onClose,

  usedCL,

  usedHPL,

  monthlyData,

}: AccountDrawerProps) {

  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
      />

      {/* Drawer */}

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

                {user?.displayName
                  ?.charAt(0)
                  .toUpperCase()}

              </div>
            )}
          </div>

          <div>

            <p className="font-semibold">
              {user?.displayName}
            </p>

            <p className="text-sm text-gray-500">
              {user?.email}
            </p>

          </div>
        </div>

        {/* Analytics */}

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

        {/* Leave Policy */}

        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">

          <p className="font-semibold text-[#7A4F3A]">
            Leave Policy
          </p>

          <div className="space-y-2 text-sm text-gray-700">

            <p>
              • CL Allowed:
              12 days
            </p>

            <p>
              • CL Carry Forward:
              Not Allowed
            </p>

            <p>
              • HPL Allowed:
              6 days
            </p>

            <p>
              • HPL Carry Forward:
              Allowed
            </p>

            <p>
              • Academic Year:
              June → May
            </p>

          </div>

        </div>

        {/* Logout */}

        <button
          onClick={logout}
          className="w-full py-3 bg-black text-white rounded-xl"
        >
          Logout
        </button>

      </div>
    </>
  );
}

export default AccountDrawer;