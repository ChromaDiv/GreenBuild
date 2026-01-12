// src/features/leed-calculator/hooks/useLeedPoints.ts
import type { ConstructionMaterial } from "../types";

export const useLeedPoints = (materials: ConstructionMaterial[]) => {
  const totalCost = materials.reduce((sum, m) => sum + Number(m.cost), 0);
  
  // 1. EPD Credit
  const epdCount = materials.filter(m => m.hasEPD).length;
  const epdPoints = epdCount >= 20 ? 2 : epdCount >= 10 ? 1 : 0;

  // 2. Regional Sourcing (UAE 160km radius logic)
  const localValue = materials
    .filter(m => m.isLocallySourced)
    .reduce((sum, m) => sum + Number(m.cost), 0);
  const localPercentage = totalCost > 0 ? (localValue / totalCost) * 100 : 0;
  const localPoints = localPercentage >= 30 ? 2 : localPercentage >= 15 ? 1 : 0;

  // 3. NEW: Recycled Content Credit (MR Credit: Sourcing)
  const recycledValue = materials.reduce((sum, m) => {
    const pre = Number(m.recycledContentPre) || 0;
    const post = Number(m.recycledContentPost) || 0;
    // LEED weighted formula
    const weightedPercent = (post + (0.5 * pre)) / 100;
    return sum + (Number(m.cost) * weightedPercent);
  }, 0);

  const recycledPercentage = totalCost > 0 ? (recycledValue / totalCost) * 100 : 0;
  const recycledPoints = recycledPercentage >= 20 ? 2 : recycledPercentage >= 10 ? 1 : 0;

  // Calculate Total & Certification Level
  const totalPoints = epdPoints + localPoints + recycledPoints;
  
  let certLevel = "No Certification";
  if (totalPoints >= 5) certLevel = "Platinum";
  else if (totalPoints >= 4) certLevel = "Gold";
  else if (totalPoints >= 3) certLevel = "Silver";
  else if (totalPoints >= 1) certLevel = "Certified";

  return { 
    totalCost, 
    epdCount, 
    localPercentage, 
    recycledPercentage, // Now exposed for Scoreboard
    totalPoints, 
    certLevel 
  };
};