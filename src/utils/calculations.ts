export const TOTAL_LEAVES = {
  CL: 12,
  HPL: 6,
};

export const MAX_CARRY = {
  HPL: 30,
};

// ----------------------------
// Calculate Remaining Leaves
// ----------------------------

export function calculateRemaining(
  usedCL: number,
  usedHPL: number,
  carryHPL: number = 0
) {
  const remainingCL = TOTAL_LEAVES.CL - usedCL;

  const remainingHPL =
    TOTAL_LEAVES.HPL +
    carryHPL -
    usedHPL;

  return {
    remainingCL: Math.max(0, remainingCL),
    remainingHPL: Math.max(0, remainingHPL),
  };
}

// ----------------------------
// HPL Carry Forward ONLY
// ----------------------------

export function calculateCarryForward(
  remainingHPL: number
) {
  return {
    carryCL: 0, // ❌ CL never carries
    carryHPL: Math.min(
      MAX_CARRY.HPL,
      Math.max(0, remainingHPL)
    ),
  };
}