import type { ConstructionMaterial } from "../types";

interface Props {
  materials: ConstructionMaterial[];
  onDelete: (id: string) => void;
}

export const MaterialTable = ({ materials, onDelete }: Props) => {
  const handleDeleteClick = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
      <table className="min-w-full table-auto text-left text-sm text-slate-700">
        <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-bold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 w-[45%]">Material Name</th> 
            <th className="px-4 py-4">Category</th>
            <th className="px-4 py-4 text-right">Cost (AED)</th>
            <th className="px-4 py-4 text-center">Recycled %</th>
            <th className="px-4 py-4 text-center">LEED Status</th>
            <th className="px-6 py-4 w-24 text-center">Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {materials.map((m) => {
            const weightedRecycled = (Number(m.recycledContentPost) || 0) + (0.5 * (Number(m.recycledContentPre) || 0));
            
            return (
              // align-top ensures all columns anchor to the top of the row
              <tr key={m.id} className="hover:bg-slate-50 transition-colors group align-top">
                
                {/* 1. Name Column (Wraps naturally) */}
                <td className="px-6 py-5 font-bold text-slate-900 whitespace-normal wrap-break-words leading-relaxed pt-6">
                  {m.name}
                </td>
                
                {/* 2. Category (Top Aligned) */}
                <td className="px-4 py-6 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    {m.category}
                  </span>
                </td>

                {/* 3. Cost (Top Aligned) */}
                <td className="px-4 py-6 text-right font-mono text-xs font-semibold text-slate-600">
                  {Number(m.cost).toLocaleString('en-AE')}
                </td>

                {/* 4. Recycled Content (Top Aligned Flexbox) */}
                <td className="px-4 py-6 whitespace-nowrap">
                  <div className="flex flex-col items-center justify-start h-full">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      weightedRecycled >= 25 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {weightedRecycled.toFixed(1)}%
                    </span>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase tracking-tighter">
                      {m.recycledContentPost}% Post / {m.recycledContentPre}% Pre
                    </span>
                  </div>
                </td>
                
                {/* 5. LEED Status (Top Aligned) */}
                <td className="px-4 py-6 whitespace-nowrap">
                  <div className="flex justify-center items-start gap-1">
                    {m.isLocallySourced && (
                      <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                        Local
                      </span>
                    )}
                    {m.hasEPD && (
                      <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                        EPD
                      </span>
                    )}
                  </div>
                </td>

                {/* 6. Interactive Bin (Top Aligned) */}
                <td className="px-6 py-5 text-center">
                  <div className="flex justify-center items-start h-full pt-1">
                    <button 
                      onClick={() => handleDeleteClick(m.id, m.name)}
                      className="p-2 rounded-lg transition-all duration-300 group/bin"
                      title="Delete Entry"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-slate-300 transition-all duration-300 group-hover:text-slate-400 group-hover/bin:text-red-600 group-hover/bin:scale-110" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          className="transition-all duration-300" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                        />
                      </svg>
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}     
        </tbody>
      </table>
    </div>
  );
};