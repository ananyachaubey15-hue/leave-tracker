export const TOTAL_LEAVES = {
  CL: 12,
  HPL: 6,
};

export const MAX_CARRY = {
  HPL: 12,
};


// REMAINING LEAVES
export function calculateRemaining(
  usedCL: number,
  usedHPL: number,
  carryHPL: number = 0
) {

  // CL resets every year
  const remainingCL = TOTAL_LEAVES.CL - usedCL;

  // HPL includes previous carry
  const totalHPL = TOTAL_LEAVES.HPL + carryHPL;

  const remainingHPL = totalHPL - usedHPL;

  return {
    remainingCL: Math.max(0, remainingCL),
    remainingHPL: Math.max(0, remainingHPL),
  };
}



// CARRY FORWARD CALCULATION
export function calculateCarryForward(
  remainingHPL: number
) {

  return {

    // CL NEVER carries
    carryCL: 0,

    // HPL carries with max limit
    carryHPL: Math.min(
      MAX_CARRY.HPL,
      Math.max(0, remainingHPL)
    ),

  };
}