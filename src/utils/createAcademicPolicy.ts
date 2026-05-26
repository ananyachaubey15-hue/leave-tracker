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
  academicYear: any
) {

  const policyId =
    `${userId}_${academicYear}`;

  const policyRef = doc(
    db,
    "leavePolicies",
    policyId
  );

  const snapshot =
    await getDoc(policyRef);

  // POLICY ALREADY EXISTS
  if (snapshot.exists()) return;

  // -----------------------------
  // FIND PREVIOUS YEAR
  // -----------------------------

  const startYear =
    Number(
      academicYear.split("-")[0]
    );

  const previousYear =
    `${startYear - 1}-${startYear}`;

  const previousPolicyId =
    `${userId}_${previousYear}`;

  // -----------------------------
  // FETCH PREVIOUS POLICY
  // -----------------------------

  const previousPolicyRef = doc(
    db,
    "leavePolicies",
    previousPolicyId
  );

  const previousPolicySnapshot =
    await getDoc(previousPolicyRef);

  let carryHPL = 0;

  // -----------------------------
  // CALCULATE REMAINING HPL
  // -----------------------------

  if (
    previousPolicySnapshot.exists()
  ) {

    const previousPolicy =
      previousPolicySnapshot.data();

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

    // PREVIOUS TOTAL HPL
    const totalPreviousHPL =
      (previousPolicy.hplAllowed || 0)
      +
      (previousPolicy.carryHPL || 0);

    // REMAINING
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

    clAllowed: 12,

    hplAllowed: 6,

    carryEnabled: true,

    carryCL: 0,

    carryHPL,

    createdAt:
      new Date(),
  });
}