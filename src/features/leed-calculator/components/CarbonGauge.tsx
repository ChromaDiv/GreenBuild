import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Props {
  totalCarbon: number;
}

export const CarbonGauge = ({ totalCarbon }: Props) => {
  const target = 50000;
  const percentage = Math.min((totalCarbon / target) * 100, 100);
  
  const data = [
    { value: totalCarbon },
    { value: Math.max(target - totalCarbon, 0) }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-80 flex flex-col items-center relative">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest absolute top-6 left-6">
        Net-Zero Threshold
      </h3>
      
      {/* FIX: Direct parent has a fixed height (h-[180px]).
         This satisfies Recharts' requirement for positive dimensions.
      */}
      <div className="w-full h-[180px] mt-10 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%" // Anchored at the bottom center
              startAngle={180}
              endAngle={0}
              innerRadius={75} // Thinner arc gives text more room
              outerRadius={100}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={totalCarbon > target ? '#ef4444' : '#10b981'} />
              <Cell fill="#f1f5f9" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* FIX FOR OVERLAP: Don't use <Label /> inside the SVG. 
           Use an absolute-positioned div. It is easier to control.
        */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className="text-4xl font-black text-slate-800">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <p className="text-[10px] font-bold text-slate-500 uppercase">
          {totalCarbon.toLocaleString()} / {target.toLocaleString()} kg CO2e
        </p>
      </div>
    </div>
  );
};