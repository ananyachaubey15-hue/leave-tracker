export const TOTAL_LEAVES = {
  CL: 12,
  HPL: 20,
};

export const MAX_CARRY = {
  CL: 6,
  HPL: 10,
};

export function calculateRemaining(
  usedCL: number,
  usedHPL: number
) {
  const remainingCL = TOTAL_LEAVES.CL - usedCL;
  const remainingHPL = TOTAL_LEAVES.HPL - usedHPL;

  return { remainingCL, remainingHPL };
}

export function calculateCarryForward(
  remainingCL: number,
  remainingHPL: number
) {
  return {
    carryCL: Math.min(MAX_CARRY.CL, Math.max(0, remainingCL)),
    carryHPL: Math.min(MAX_CARRY.HPL, Math.max(0, remainingHPL)),
  };
}