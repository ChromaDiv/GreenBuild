import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ConstructionMaterial } from '../types'; 

interface Props {
  materials: ConstructionMaterial[];
}

export const CarbonCategoryChart = ({ materials }: Props) => {
  const data = materials.reduce((acc: any[], m) => {
    const weight = Number(m.weight) || 0;
    const embodied = Number(m.embodiedCarbon) || 0;
    const distance = Number(m.transportDistance) || 0;
    const transportFactor = 0.1; 

    const carbon = (weight * embodied) + ((weight / 1000) * distance * transportFactor);
    
    const existing = acc.find(item => item.category === m.category);
    if (existing) {
      existing.value = Number((existing.value + carbon).toFixed(2));
    } else {
      acc.push({ 
        category: String(m.category || 'Uncategorized'), 
        value: Number(carbon.toFixed(2)) 
      });
    }
    return acc;
  }, []);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80 w-full flex flex-col">
      <h3 className="text-xs font-black uppercase mb-6 tracking-widest text-slate-400">
        Carbon Footprint by Category (kg CO2e)
      </h3>
      
      {/* FIX: We wrap the ResponsiveContainer in a div with a hard-coded 
        height (h-[200px]) and min-height to eliminate the width(-1) height(-1) error.
      */}
      <div className="flex-1 w-full min-h-[200px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            layout="vertical" 
            margin={{ left: 20, right: 30, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="category" 
              type="category" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-4 rounded-xl shadow-xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-1">
                        {payload[0].payload.category}
                      </p>
                      <p className="text-lg font-bold text-slate-900">
                        {payload[0].value.toLocaleString()} 
                        <span className="text-xs font-normal text-slate-500 ml-1">kg CO2e</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};