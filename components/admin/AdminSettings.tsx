'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Settings, ShieldAlert, Check, AlertTriangle } from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings } = useTournament();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-gaming font-bold text-xl text-white uppercase tracking-wide">
          Platform Governance & System Parameters
        </h2>
        <p className="text-xs text-[#8E9EB5]">
          Manage platform fee commissions, liquidity safety thresholds, and anti-cheat policies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0E131E] rounded-2xl border border-[#1C2538] p-6 space-y-6 shadow-xl">
        {/* Fee & Limits */}
        <div className="space-y-4">
          <h3 className="font-gaming font-bold text-sm text-white uppercase pb-2 border-b border-[#1C2538]">
            Fintech Economics & Commission
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Platform Commission Fee (%)</label>
              <input
                type="number"
                min={0}
                max={30}
                value={form.platformFeePercent}
                onChange={(e) => setForm({ ...form, platformFeePercent: Number(e.target.value) })}
                className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-white font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Deducted from gross entry pool</span>
            </div>

            <div>
              <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Min Deposit (₹)</label>
              <input
                type="number"
                min={10}
                value={form.minDeposit}
                onChange={(e) => setForm({ ...form, minDeposit: Number(e.target.value) })}
                className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-white font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Min Withdrawal (₹)</label>
              <input
                type="number"
                min={50}
                value={form.minWithdrawal}
                onChange={(e) => setForm({ ...form, minWithdrawal: Number(e.target.value) })}
                className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-white font-bold"
              />
            </div>
          </div>
        </div>

        {/* Anti-cheat Policy */}
        <div className="space-y-4">
          <h3 className="font-gaming font-bold text-sm text-white uppercase pb-2 border-b border-[#1C2538]">
            Anti-Cheat & Regulatory Protocols
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Enforced Policy Statement</label>
            <textarea
              rows={3}
              value={form.antiCheatNotice}
              onChange={(e) => setForm({ ...form, antiCheatNotice: e.target.value })}
              className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-xs text-white leading-relaxed"
            />
          </div>
        </div>

        {/* Maintenance Toggle */}
        <div className="p-4 rounded-xl bg-[#141A27] border border-[#232D42] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-gaming font-bold text-sm text-white uppercase">System Maintenance Lockout</span>
            <p className="text-xs text-[#8E9EB5]">Lock tournament registrations and custom room access for server upgrades.</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.maintenanceMode}
              onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF2A4D]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs text-[#00F59B] font-bold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Parameters saved successfully
            </span>
          ) : <div />}

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF2A4D]/25 transition-all cursor-pointer"
          >
            Save Global Settings
          </button>
        </div>
      </form>
    </div>
  );
}
