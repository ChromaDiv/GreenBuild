// src/features/leed-calculator/types.ts

export interface ConstructionMaterial {
  id: string;
  name: string;
  category: 'structural' | 'enclosure' | 'mechanical' | 'finishes';
  cost: number;
  weight: number;
  unit: 'kg' | 'ton' | 'm3';
  
  // Add these for the Sustainability Logic
  embodiedCarbon: number;    // kg CO2e per kg of material
  transportDistance: number; // km from supplier to UAE site
  
  recycledContentPre: number;
  recycledContentPost: number;
  isLocallySourced: boolean;
  hasEPD: boolean;
  vocLevel: number;
  supplier: {
    name: string;
    location: string;
    icvScore: number;
  };
}