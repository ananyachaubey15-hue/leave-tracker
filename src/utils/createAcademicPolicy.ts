import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../services/firebase";

export async function createAcademicPolicyIfNeeded(
  userId: string,
  academicYear: string
) {

  const policyId =
    `${userId}_${academicYear}`;

  const policyRef = doc(
    db,
    "leavePolicies",
    policyId
  );

  const existingPolicy =
    await getDoc(policyRef);

  // POLICY EXISTS
  if (existingPolicy.exists()) {
    return;
  }

  // -----------------------------
  // PREVIOUS YEAR
  // -----------------------------

  const startYear =
    Number(
      academicYear.split("-")[0]
    );

  const previousYear =
    `${startYear - 1}-${startYear}`;

  const previousPolicyId =
    `${userId}_${previousYear}`;

  const previousPolicyRef = doc(
    db,
    "leavePolicies",
    previousPolicyId
  );

  const previousPolicySnapshot =
    await getDoc(previousPolicyRef);

  // DEFAULT CARRY
  let carryHPL = 0;

  // -----------------------------
  // IF PREVIOUS POLICY EXISTS
  // -----------------------------

  if (
    previousPolicySnapshot.exists()
  ) {

    const previousPolicy =
      previousPolicySnapshot.data();

    // FETCH ALL LEAVES
    const leavesSnapshot =
      await getDocs(
        collection(
          db,
          "leaveRecords"
        )
      );

    let usedHPL = 0;

    leavesSnapshot.forEach(
      (document) => {

        const data: any =
          document.data();

        // ONLY PREVIOUS YEAR HPL
        if (
          data.userId === userId &&
          data.academicYear === previousYear &&
          data.leaveType === "HPL"
        ) {

          usedHPL += Number(
            data.days || 0
          );
        }
      }
    );

    // TOTAL AVAILABLE HPL
    const totalPreviousHPL =
      Number(
        previousPolicy.hplAllowed || 0
      ) +
      Number(
        previousPolicy.carryHPL || 0
      );

    // REMAINING HPL
    carryHPL =
      Math.max(
        totalPreviousHPL - usedHPL,
        0
      );
  }

  // -----------------------------
  // CREATE NEW POLICY
  // -----------------------------

  await setDoc(policyRef, {

    userId,

    academicYear,

    // FIXED RULES
    clAllowed: 12,

    hplAllowed: 6,

    // CL NEVER CARRIES
    carryCL: 0,

    // HPL AUTO CARRY
    carryHPL,

    createdAt: new Date(),
  });
}