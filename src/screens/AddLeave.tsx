import { useState } from "react";

import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";

import { db } from "../services/firebase";

import { useAuth } from "../context/AuthContext";

import { getAcademicYear }
from "../utils/academicYear";

import { createAcademicPolicyIfNeeded }
from "../utils/createAcademicPolicy";

function AddLeave() {

  const { user } = useAuth();

  const [leaveType, setLeaveType] =
    useState("CL");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");

  const [days, setDays] =
    useState(0);

  // Calculate total leave days
  const calculateDays = (
    from: string,
    to: string
  ) => {

    if (!from || !to) return 0;

    const start = new Date(from);

    const end = new Date(to);

    const diff =
      Math.ceil(
        (
          end.getTime() -
          start.getTime()
        ) /
        (1000 * 60 * 60 * 24)
      ) + 1;

    return diff > 0 ? diff : 0;
  };

  // Save leave
  const handleSubmit = async () => {

    if (!user) {

      alert("User not found ❌");

      return;
    }

    // EMPTY DATE CHECK
    if (!dateFrom || !dateTo) {

      alert("Please select dates ❌");

      return;
    }

    // INVALID DATE RANGE
    if (
      new Date(dateTo) <
      new Date(dateFrom)
    ) {

      alert(
        "End date cannot be before start date ❌"
      );

      return;
    }

    try {

      // GET EXISTING LEAVES
      const snapshot = await getDocs(
        collection(db, "leaveRecords")
      );

      let overlapFound = false;

      snapshot.forEach((document) => {

        const data: any =
          document.data();

        // ONLY CURRENT USER
        if (
          data.userId !== user.uid
        ) return;

        const existingFrom =
          new Date(
            data.dateFrom.seconds
            * 1000
          );

        const existingTo =
          new Date(
            data.dateTo.seconds
            * 1000
          );

        const newFrom =
          new Date(dateFrom);

        const newTo =
          new Date(dateTo);

        // OVERLAP CHECK
        if (
          newFrom <= existingTo &&
          newTo >= existingFrom
        ) {

          overlapFound = true;
        }
      });

      // OVERLAP FOUND
      if (overlapFound) {

        alert(
          "Leave already exists for selected dates ❌"
        );

        return;
      }

      // Academic year
      const academicYear =
        getAcademicYear(
          new Date(dateFrom)
        );

      // Auto create policy
      await createAcademicPolicyIfNeeded(
        user.uid,
        academicYear
      );

      // Save leave record
      await addDoc(
        collection(db, "leaveRecords"),
        {

          userId: user.uid,

          academicYear,

          leaveType,

          dateFrom:
            Timestamp.fromDate(
              new Date(dateFrom)
            ),

          dateTo:
            Timestamp.fromDate(
              new Date(dateTo)
            ),

          days: Number(days),

          createdAt:
            Timestamp.now(),
        }
      );

      alert("Leave added ✅");

      window.location.href =
        "/dashboard";

    } catch (error) {

      console.error(error);

      alert(
        "Error adding leave ❌"
      );
    }
  };

  return (

    <div className="min-h-screen bg-[#F4F1EE] px-6 py-8">

      <div className="max-w-md mx-auto space-y-6 bg-white border border-[#E8E2DD] rounded-3xl shadow-sm p-6">

        <h2 className="text-2xl font-semibold text-[#7A4F3A]">
          Add Leave
        </h2>

        {/* Leave Type */}

        <select
          value={leaveType}
          onChange={(e) =>
            setLeaveType(
              e.target.value
            )
          }
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3"
        >

          <option value="CL">
            Casual Leave (CL)
          </option>

          <option value="HPL">
            Half Pay Leave (HPL)
          </option>

        </select>

        {/* Date From */}

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => {

            const value =
              e.target.value;

            setDateFrom(value);

            setDays(
              calculateDays(
                value,
                dateTo
              )
            );
          }}
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3"
        />

        {/* Date To */}

        <input
          type="date"
          value={dateTo}
          onChange={(e) => {

            const value =
              e.target.value;

            setDateTo(value);

            setDays(
              calculateDays(
                dateFrom,
                value
              )
            );
          }}
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3"
        />

        {/* Days */}

        <input
          type="number"
          value={days}
          readOnly
          className="w-full border border-[#E8E2DD] rounded-xl px-4 py-3 bg-gray-50"
        />

        {/* Button */}

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