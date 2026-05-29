import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../services/firebase";

import { useAuth } from "../context/AuthContext";

import AccountDrawer from "../components/AccountDrawer";

interface Props {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

function Dashboard({
  isDrawerOpen,
  setIsDrawerOpen,
}: Props) {

  const { user } = useAuth();

  const [policy, setPolicy] =
    useState<any>(null);

  const [usedCL, setUsedCL] =
    useState(0);

  const [usedHPL, setUsedHPL] =
    useState(0);

  const [monthlyData, setMonthlyData] =
    useState<
      { month: string; days: number }[]
    >([]);

  // CURRENT ACADEMIC YEAR
  const [
    currentAcademicYear,
    setCurrentAcademicYear
  ] = useState("");

  // LOAD POLICY
  const loadPolicy = async (
    academicYear?: string
  ) => {

    if (!user) return;

    const year =
      academicYear || "";

    if (!year) return;

    const policyId =
      `${user.uid}_${year}`;

    const policyRef = doc(
      db,
      "leavePolicies",
      policyId
    );

    const snapshot =
      await getDoc(policyRef);

    if (snapshot.exists()) {

      setPolicy(snapshot.data());

    } else {

      setPolicy({
        clAllowed: 12,
        hplAllowed: 6,
        carryHPL: 0,
      });
    }
  };

  // LOAD LEAVES
  useEffect(() => {

    const fetchLeaves = async () => {

      if (!user) return;

      const snapshot =
        await getDocs(
          collection(
            db,
            "leaveRecords"
          )
        );

      let cl = 0;

      let hpl = 0;

      const monthlyMap:
        Record<string, number> = {};

      let latestAcademicYear = "";

      snapshot.forEach((document) => {

        const data: any =
          document.data();

        // ONLY CURRENT USER
        if (
          data.userId !== user.uid
        ) return;

        // SAVE LATEST ACADEMIC YEAR
        if (
          data.academicYear
        ) {

          latestAcademicYear =
            data.academicYear;
        }

        // CL
        if (
          data.leaveType === "CL"
        ) {

          cl += Number(
            data.days || 0
          );
        }

        // HPL
        if (
          data.leaveType === "HPL"
        ) {

          hpl += Number(
            data.days || 0
          );
        }

        // MONTHLY DATA
        if (
          data.dateFrom?.seconds
        ) {

          const month =
            new Date(
              data.dateFrom.seconds
              * 1000
            ).toLocaleString(
              "default",
              {
                month: "short",
              }
            );

          monthlyMap[month] =
            (
              monthlyMap[month]
              || 0
            )
            +
            Number(
              data.days || 0
            );
        }
      });

      setCurrentAcademicYear(
        latestAcademicYear
      );

      await loadPolicy(
        latestAcademicYear
      );

      setUsedCL(cl);

      setUsedHPL(hpl);

      setMonthlyData(

        Object.entries(
          monthlyMap
        ).map(
          ([month, days]) => ({
            month,
            days,
          })
        )
      );
    };

    fetchLeaves();

  }, [user]);

  // CL REMAINING
  const remainingCL =
    Math.max(
      (
        policy?.clAllowed ?? 12
      )
      - usedCL,
      0
    );

  // HPL REMAINING
  const remainingHPL =
    Math.max(
      (
        (
          policy?.hplAllowed ?? 6
        )
        +
        (
          policy?.carryHPL ?? 0
        )
      )
      - usedHPL,
      0
    );

  // CL NEVER CARRIES
  const carryCL = 0;

  // HPL CARRY
  const carryHPL =
    remainingHPL;

  return (

    <div className="min-h-screen bg-[#F4F1EE] px-6 py-8">

      <div className="max-w-md mx-auto space-y-6">

        {/* HEADER */}

        <div
          onClick={() =>
            setIsDrawerOpen(true)
          }
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

                {
                  user?.displayName
                  ?.charAt(0)
                }

              </div>
            )}
          </div>

          <div>

            <h2 className="text-xl font-semibold">
              Hello {user?.displayName}
            </h2>

            <p className="text-sm text-gray-500">
              Academic Year:
              {" "}
              {currentAcademicYear}
            </p>

          </div>
        </div>

        {/* CL CARD */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="text-lg font-semibold mb-2">
            Casual Leave (CL)
          </h3>

          <p>
            Allowed:
            {" "}
            {policy?.clAllowed ?? 12}
          </p>

          <p>
            Used:
            {" "}
            {usedCL}
          </p>

          <p>
            Remaining:
            {" "}
            {remainingCL}
          </p>

          <p>
            Carry:
            {" "}
            {carryCL}
          </p>

        </div>

        {/* HPL CARD */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <h3 className="text-lg font-semibold mb-2">
            Half Pay Leave (HPL)
          </h3>

          <p>
            Allowed:
            {" "}
            {policy?.hplAllowed ?? 6}
          </p>

          <p>
            Carry Forward:
            {" "}
            {policy?.carryHPL ?? 0}
          </p>

          <p>
            Used:
            {" "}
            {usedHPL}
          </p>

          <p>
            Remaining:
            {" "}
            {remainingHPL}
          </p>

          <p>
            Next Carry:
            {" "}
            {carryHPL}
          </p>

        </div>

      </div>

      <AccountDrawer
        isOpen={isDrawerOpen}
        onClose={() =>
          setIsDrawerOpen(false)
        }
        usedCL={usedCL}
        usedHPL={usedHPL}
        monthlyData={monthlyData}
      />

    </div>
  );
}

export default Dashboard;