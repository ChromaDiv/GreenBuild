import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { MaterialForm } from './features/leed-calculator/components/MaterialForm';
import { MaterialTable } from './features/leed-calculator/components/MaterialTable';
import { CreditSummary } from './features/leed-calculator/components/CreditSummary';
import { Scoreboard } from './features/leed-calculator/components/Scoreboard';
import { CarbonCategoryChart } from './features/leed-calculator/components/CarbonCategoryChart';
import { useLeedPoints } from './features/leed-calculator/hooks/useLeedPoints';
import { useSustainabilityLogic } from './features/leed-calculator/hooks/useSustainabilityLogic';
import type { ConstructionMaterial } from './features/leed-calculator/types';
import { CarbonGauge } from './features/leed-calculator/components/CarbonGauge';

function App() {
  const [materials, setMaterials] = useState<ConstructionMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Lifecycle: Initialize Cloud Connection and Fetch Data
  useEffect(() => {
    async function initSustainabilityEngine() {
      setLoading(true);
  
      // 1. QA Infrastructure Check
      const { error: connError } = await supabase
        .from('construction_materials')
        .select('id', { count: 'exact', head: true });
      
      if (connError) {
        console.error("❌ Supabase Connection Failed:", connError.message);
      }
  
      // 2. Data Retrieval with Aliasing
      // This renames the database snake_case to frontend camelCase automatically
      const { data, error } = await supabase
      .from('construction_materials')
      .select(`
        id,
        name,
        category,
        cost,
        weight,
        embodiedCarbon:embodied_carbon,
        transportDistance:transport_distance,
        recycledContentPre:recycled_content_pre,
        recycledContentPost:recycled_content_post,
        isLocallySourced:is_locally_sourced,
        hasEPD:has_epd,
        supplier,
        created_at
      `)
      .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching materials:', error.message);
      } else if (data) {
        // Cast the aliased data to your ConstructionMaterial type
        setMaterials(data as unknown as ConstructionMaterial[]);
      }
      
      setLoading(false);
    }
  
    initSustainabilityEngine();
  }, []);

  // 2. Intelligence Layer: Calculate LEED & Carbon metrics
  const leedStats = useLeedPoints(materials);
  const carbonStats = useSustainabilityLogic(materials);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  // 3. Operational Logic: Create
  const addMaterial = async (newMaterial: ConstructionMaterial) => {
    setSyncStatus('syncing');
  
    const { data, error } = await supabase
      .from('construction_materials')
      .insert([{
        name: newMaterial.name,
        category: newMaterial.category,
        cost: newMaterial.cost,
        weight: newMaterial.weight,
        embodied_carbon: newMaterial.embodiedCarbon,
        transport_distance: newMaterial.transportDistance,
        recycled_content_pre: newMaterial.recycledContentPre,
        recycled_content_post: newMaterial.recycledContentPost,
        is_locally_sourced: newMaterial.isLocallySourced,
        has_epd: newMaterial.hasEPD,
        supplier: newMaterial.supplier
      }])
      .select(`
        id, name, category, cost, weight,
        embodiedCarbon:embodied_carbon,
        transportDistance:transport_distance,
        recycledContentPre:recycled_content_pre,
        recycledContentPost:recycled_content_post,
        isLocallySourced:is_locally_sourced,
        hasEPD:has_epd,
        supplier
      `);
  
    if (!error && data) {
      setMaterials([data[0] as unknown as ConstructionMaterial, ...materials]);
      setTimeout(() => setSyncStatus('synced'), 800);
    } else {
      setSyncStatus('error');
      console.error("Sync Error:", error.message);
    }
  };

  // 4. Operational Logic: Delete
  const deleteMaterial = async (id: string) => {
    const { error } = await supabase
      .from('construction_materials')
      .delete()
      .eq('id', id);

    if (!error) {
      setMaterials(materials.filter(m => m.id !== id));
    } else {
      alert(`Delete operation failed: ${error.message}`);
    }
  };

  // 5. Operational Logic: Bulk Reset (QA/Audit Purpose)
  const clearProject = async () => {
    if (window.confirm("CRITICAL: Are you sure? This will wipe all LEED data from the cloud for this project.")) {
      const { error } = await supabase
        .from('construction_materials')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Targeted deletion of all records

      if (!error) {
        setMaterials([]);
      } else {
        alert("Failed to clear ledger: " + error.message);
      }
    }
  };

  const exportToCSV = () => {
    if (materials.length === 0) {
      alert("No data available to export.");
      return;
    }
  
    // Define headers
    const headers = [
      "ID", "Name", "Category", "Cost (AED)", "Weight (kg)", 
      "Embodied Carbon", "Transport Distance", "Local Sourced", 
      "Has EPD", "Supplier Name", "Supplier Location"
    ];
  
    // Map data rows
    const rows = materials.map(m => [
      m.id,
      `"${m.name}"`, // Wrap in quotes to handle commas in names
      m.category,
      m.cost,
      m.weight,
      m.embodiedCarbon,
      m.transportDistance,
      m.isLocallySourced ? "Yes" : "No",
      m.hasEPD ? "Yes" : "No",
      `"${m.supplier?.name || 'N/A'}"`,
      `"${m.supplier?.location || 'UAE'}"`
    ]);
  
    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
  
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GreenBuild_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 6. Loading State (Prevents layout shift during sync)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing GreenBuild Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* --- EXECUTIVE HEADER --- */}
    <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            GreenBuild <span className="text-green-600">Ledger</span>
          </h1>
          <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Cloud v1.0</span>
        </div>
        <p className="text-slate-500 text-sm font-medium">
          Sustainability Compliance Portal | LEED v4.1 & UAE National Targets
        </p>
      </div>
      
      <div className="flex gap-3">
        {/* NEW EXPORT BUTTON */}
        <button 
          onClick={exportToCSV}
          className="px-4 py-2 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-widest flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
          </svg>
          Export Audit
        </button>

        <button 
          onClick={clearProject}
          className="px-4 py-2 text-xs font-bold text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-all uppercase tracking-widest"
        >
          Reset Cloud Project
        </button>
        
      </div>
      
    </header>

        {/* --- LEVEL 1: EXECUTIVE KPIs --- */}
        <Scoreboard stats={leedStats} carbonStats={carbonStats} />

      {/* --- LEVEL 2: ANALYTICS DASHBOARD --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Ensure the container has a minimum height before the chart loads */}
        <div className="lg:col-span-4 min-h-[320px]">
          <CarbonGauge totalCarbon={carbonStats.totalEmbodiedCarbon} /> 
        </div>
        <div className="lg:col-span-8 min-h-[320px]">
          <CarbonCategoryChart materials={materials} />
        </div>
      </div>

      {/* --- LEVEL 3: OPERATIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: Inputs & Credit Summaries */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest">Material Data Entry</h3>
              <MaterialForm onAdd={addMaterial} />
            </section>
            
            <CreditSummary materials={materials} />
          </div>

          {/* Main Content: Ledger Table */}
          <div className="lg:col-span-8">
  <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
      <h3 className="font-bold text-slate-800">Operational Compliance Ledger</h3>
      
      <div className="flex items-center gap-3">
        {/* Dynamic Sync Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 ${
          syncStatus === 'syncing' ? 'bg-amber-50 border-amber-200' : 
          syncStatus === 'error' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}>
          <div className={`h-1.5 w-1.5 rounded-full ${
            syncStatus === 'syncing' ? 'bg-amber-500 animate-pulse' : 
            syncStatus === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`} />
          <span className={`text-[10px] font-black uppercase tracking-tighter ${
            syncStatus === 'syncing' ? 'text-amber-700' : 
            syncStatus === 'error' ? 'text-red-700' : 'text-green-700'
          }`}>
            {syncStatus === 'syncing' ? 'Syncing...' : 
            syncStatus === 'error' ? 'Sync Error' : 'Cloud Synced'}
          </span>
        </div>

        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 font-bold uppercase">
          {materials.length} Materials
        </span>
      </div>
    </div>
    <MaterialTable materials={materials} onDelete={deleteMaterial} />
  </section>
</div>

        </div>
      </div>
    </div>
  );
}

export default App;