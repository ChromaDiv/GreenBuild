import type{ ConstructionMaterial } from "../types";

export const useSustainabilityLogic = (materials: ConstructionMaterial[]) => {
  const totalCarbon = materials.reduce((acc, m) => {
    const mWeight = Number(m.weight) || 0;
    const mEmbodied = Number(m.embodiedCarbon) || 0;
    const mDist = Number(m.transportDistance) || 0;

    const materialCarbon = mWeight * mEmbodied;
    const transportFactor = 0.1; 
    const transportCarbon = (mWeight / 1000) * mDist * transportFactor;

    return acc + materialCarbon + transportCarbon;
  }, 0);

  const carbonIntensity = materials.length > 0 ? totalCarbon / materials.length : 0;
  const isBelowNationalAvg = carbonIntensity < 500; 

  return { 
    totalEmbodiedCarbon: Number(totalCarbon.toFixed(2)), 
    carbonIntensity: Number(carbonIntensity.toFixed(2)), 
    isBelowNationalAvg 
  };
};