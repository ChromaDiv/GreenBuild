
import type { ConstructionMaterial } from '../types';

// 2. Define the Interface for the Props
interface CreditSummaryProps {
  materials: ConstructionMaterial[];
}

export const CreditSummary = ({ materials }: CreditSummaryProps) => {
  // Logic: Calculate % of local materials
  const totalCost = materials.reduce((acc, m) => acc + m.cost, 0);
  
  const localCost = materials
    .filter(m => m.isLocallySourced)
    .reduce((acc, m) => acc + m.cost, 0);
  
  // 3. Prevent Division by Zero (Safety Check)
  const localPercent = totalCost > 0 ? (localCost / totalCost) * 100 : 0;
  
  // LEED v4.1 threshold: 1 point for 15%, 2 points for 30%
  const pointsEarned = localPercent >= 30 ? 2 : localPercent >= 15 ? 1 : 0;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-green-100">
      <h3 className="text-lg font-bold text-slate-800">MR Credit: Sourcing</h3>
      <p className="text-sm text-slate-500 mb-4">Regional Material Tracking</p>
      
      <div className="flex items-end justify-between">
        <div>
          {/* Use toFixed only if totalCost > 0 to avoid errors */}
          <span className="text-3xl font-bold text-green-600">
            {localPercent.toFixed(1)}%
          </span>
          <span className="text-slate-400 ml-2 text-sm">Local Sourcing</span>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          pointsEarned > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {pointsEarned} LEED POINTS
        </div>
      </div>

      {/* 4. UX Enhancement: Progress bar */}
      <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full transition-all duration-500" 
          style={{ width: `${Math.min(localPercent, 100)}%` }}
        ></div>
      </div>
    </div>
  );
};