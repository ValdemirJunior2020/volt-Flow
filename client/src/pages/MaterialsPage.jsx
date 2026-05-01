// client/src/pages/MaterialsPage.jsx
import React from 'react'
import PageHeader from '../components/business/PageHeader'
import KpiCard from '../components/business/KpiCard'
import { Package, AlertTriangle, Truck, DollarSign } from 'lucide-react'
import { materials } from '../data/mockBusinessData'

export default function MaterialsPage() {
  const lowStock = materials.filter((item) => item.stock <= item.reorder).length
  const value = materials.reduce((sum, item) => sum + item.stock * item.cost, 0)
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <PageHeader eyebrow="Inventory" title="Materials" description="Track electrical parts, reorder points, vendors, job costing, and future QuickBooks item sync." primaryLabel="Add Material" secondaryLabel="Purchase Order" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"><KpiCard icon={Package} label="Inventory items" value={materials.length} sub="Tracked SKUs" /><KpiCard icon={AlertTriangle} label="Low stock" value={lowStock} sub="Needs reorder" /><KpiCard icon={DollarSign} label="Inventory value" value={`$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="Estimated cost on hand" /><KpiCard icon={Truck} label="Vendors" value={new Set(materials.map((m) => m.vendor)).size} sub="Preferred suppliers" /></div>
      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden"><div className="p-5 border-b border-slate-100"><h2 className="font-bold text-slate-900">Inventory Control</h2><p className="text-xs text-slate-500">Low-stock rows are highlighted automatically.</p></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-xs text-slate-500 uppercase"><tr><th className="px-5 py-3 text-left">SKU</th><th className="px-5 py-3 text-left">Item</th><th className="px-5 py-3 text-left">Category</th><th className="px-5 py-3 text-right">Stock</th><th className="px-5 py-3 text-right">Reorder</th><th className="px-5 py-3 text-right">Cost</th><th className="px-5 py-3 text-left">Vendor</th></tr></thead><tbody>{materials.map((item) => (<tr key={item.sku} className={`border-t border-slate-100 ${item.stock <= item.reorder ? 'bg-amber-50/60' : ''}`}><td className="px-5 py-4 font-black text-slate-900">{item.sku}</td><td className="px-5 py-4 font-semibold text-slate-700">{item.item}</td><td className="px-5 py-4 text-slate-500">{item.category}</td><td className="px-5 py-4 text-right font-bold">{item.stock}</td><td className="px-5 py-4 text-right text-slate-500">{item.reorder}</td><td className="px-5 py-4 text-right font-bold">${item.cost}</td><td className="px-5 py-4 text-slate-600">{item.vendor}</td></tr>))}</tbody></table></div></section>
    </div>
  )
}
