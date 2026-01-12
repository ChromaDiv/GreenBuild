import { useState } from 'react';
import type{ ConstructionMaterial } from '../types';

interface Props {
  onAdd: (material: ConstructionMaterial) => void;
}

export const MaterialForm = ({ onAdd }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'structural' as const,
    cost: '',
    weight: '',
    embodiedCarbon: '',
    transportDistance: '',
    recycledContentPre: '',
    recycledContentPost: '',
    isLocallySourced: false,
    hasEPD: false, // Added missing comma
    supplierName: '',
    supplierLocation: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMaterial: ConstructionMaterial = {
      id: crypto.randomUUID(),
      name: formData.name || 'Unnamed Material',
      category: formData.category,
      cost: Number(formData.cost) || 0,
      weight: Number(formData.weight) || 0,
      embodiedCarbon: Number(formData.embodiedCarbon) || 0,
      transportDistance: Number(formData.transportDistance) || 0,
      recycledContentPre: Number(formData.recycledContentPre) || 0,
      recycledContentPost: Number(formData.recycledContentPost) || 0,
      isLocallySourced: formData.isLocallySourced,
      hasEPD: formData.hasEPD,
      unit: 'kg',
      vocLevel: 0,
      // FIX: Use the actual form data here
      supplier: { 
        name: formData.supplierName || 'Direct', 
        location: formData.supplierLocation || 'UAE', 
        icvScore: 0 
      }
    };

    onAdd(newMaterial);
    
    // Reset form including supplier fields
    setFormData({ 
      name: '', 
      category: 'structural',
      cost: '', 
      weight: '', 
      embodiedCarbon: '', 
      transportDistance: '',
      recycledContentPre: '',
      recycledContentPost: '',
      isLocallySourced: false,
      hasEPD: false,
      supplierName: '', // Reset these
      supplierLocation: '' // Reset these
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Basic Info */}
        <div className="col-span-2">
          <label className="text-[10px] font-bold uppercase text-slate-400">Material Name</label>
          <input 
            className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Low-Carbon Concrete"
            required
          />
        </div>

        {/* Categories */}
        <div className="col-span-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
          <select 
            className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value as any})}
          >
            <option value="structural">Structural</option>
            <option value="enclosure">Enclosure</option>
            <option value="mechanical">Mechanical</option>
            <option value="finishes">Finishes</option>
          </select>
        </div>

        {/* Economic */}
        <div className="col-span-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Cost (AED)</label>
          <input 
            type="number"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.cost}
            onChange={(e) => setFormData({...formData, cost: e.target.value})}
          />
        </div>

        {/* Supplier Info Grid */}
        <div className="col-span-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Supplier Name</label>
          <input 
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.supplierName}
            onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
            placeholder="Company Name"
          />
        </div>
        <div className="col-span-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Supplier Location</label>
          <input 
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.supplierLocation}
            onChange={(e) => setFormData({...formData, supplierLocation: e.target.value})}
            placeholder="City/Country"
          />
        </div>

        {/* Sustainability Data */}
        <div className="col-span-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">Weight (kg)</label>
          <input 
            type="number"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.weight}
            onChange={(e) => setFormData({...formData, weight: e.target.value})}
          />
        </div>

        <div className="col-span-1">
          <label className="text-[10px] font-bold uppercase text-slate-400">CO2 Factor (kg/kg)</label>
          <input 
            type="number"
            step="0.01"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.embodiedCarbon}
            onChange={(e) => setFormData({...formData, embodiedCarbon: e.target.value})}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400">Pre-Consumer (%)</label>
          <input 
            type="number"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.recycledContentPre}
            onChange={(e) => setFormData({...formData, recycledContentPre: e.target.value})}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400">Post-Consumer (%)</label>
          <input 
            type="number"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.recycledContentPost}
            onChange={(e) => setFormData({...formData, recycledContentPost: e.target.value})}
          />
        </div>

        <div className="col-span-2">
          <label className="text-[10px] font-bold uppercase text-slate-400">Transport Distance (km)</label>
          <input 
            type="number"
            className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            value={formData.transportDistance}
            onChange={(e) => setFormData({...formData, transportDistance: e.target.value})}
          />
        </div>
      </div>

      {/* Compliance Switches */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.hasEPD}
            onChange={(e) => setFormData({...formData, hasEPD: e.target.checked})}
            className="accent-green-600"
          />
          <span className="text-xs font-semibold text-slate-600">Has EPD</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isLocallySourced}
            onChange={(e) => setFormData({...formData, isLocallySourced: e.target.checked})}
            className="accent-green-600"
          />
          <span className="text-xs font-semibold text-slate-600">Locally Sourced</span>
        </label>
      </div>

      <button 
        type="submit"
        className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-green-600 transition-colors uppercase tracking-widest text-xs"
      >
        Add to Project Ledger
      </button>
    </form>
  );
};