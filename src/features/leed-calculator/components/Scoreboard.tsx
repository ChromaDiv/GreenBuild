
interface ScoreboardProps {
  stats: {
    totalPoints: number;
    epdCount: number;
    localPercentage: number;
    certLevel: string;
    totalCost: number;
  };
  carbonStats: {
    totalEmbodiedCarbon: number;
    carbonIntensity: number;
    isBelowNationalAvg: boolean;
  };
}

export const Scoreboard = ({ stats, carbonStats }: ScoreboardProps) => {
  const getBadgeStyles = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-slate-900 border-slate-700 text-white';
      case 'Gold': return 'bg-amber-500 border-amber-600 text-white';
      case 'Silver': return 'bg-slate-300 border-slate-400 text-slate-800';
      case 'Certified': return 'bg-green-600 border-green-700 text-white';
      default: return 'bg-slate-100 border-slate-200 text-slate-500';
    }
  };

  return (
    <div className="space-y-4 mb-8">
      {/* 1. Project Milestone Header (Enhanced with Carbon Status) */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border-2 transition-all duration-500 shadow-sm ${getBadgeStyles(stats.certLevel)}`}>
        <div className="flex flex-col">
          <span className="font-bold tracking-widest uppercase text-[10px] opacity-80">Certification Target</span>
          <span className="text-3xl font-black italic">{stats.certLevel.toUpperCase()}</span>
        </div>
        
        <div className="mt-4 md:mt-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">Net Zero 2050 Alignment</p>
          <p className="text-sm font-semibold">
            {carbonStats.isBelowNationalAvg ? "✓ Performance: Leading National Avg" : "⚠ Performance: High Intensity"}
          </p>
        </div>
      </div>

      {/* 2. Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total LEED Points */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-green-500 transition-colors group">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter mb-1">LEED Points Earned</p>
          <h2 className="text-4xl font-bold text-green-600 group-hover:scale-105 transition-transform origin-left">{stats.totalPoints}</h2>
          <p className="text-[10px] text-slate-400 mt-2">Materials & Resources Category</p>
        </div>

        {/* Embodied Carbon (Carbon Intelligence Card) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter mb-1">Carbon Footprint</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-bold text-slate-800">{carbonStats.totalEmbodiedCarbon.toLocaleString()}</h2>
            <span className="text-slate-400 text-[10px] font-bold">kg CO2e</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-medium">Intensity Score</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${carbonStats.isBelowNationalAvg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {carbonStats.carbonIntensity}
            </span>
          </div>
        </div>

        {/* Local Sourcing % */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter mb-1">Local Value Percentage</p>
          <h2 className="text-3xl font-bold text-slate-800">{stats.localPercentage.toFixed(1)}%</h2>
          <div className="w-full bg-slate-100 h-1 mt-4 rounded-full overflow-hidden">
            <div 
              className="bg-slate-800 h-full transition-all duration-700" 
              style={{ width: `${Math.min(stats.localPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Total Project Spend (MBA/Economic Card) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter mb-1">Total Procurement (AED)</p>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(stats.totalCost)}
          </h2>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">Weighted Cost Basis</p>
        </div>
      </div>
    </div>
  );
};