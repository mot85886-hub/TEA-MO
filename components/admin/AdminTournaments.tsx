'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Tournament, TournamentStatus } from '@/lib/types';
import { Trophy, Plus, Edit, Trash2, CheckCircle, AlertTriangle, Search } from 'lucide-react';

export default function AdminTournaments() {
  const { tournaments, adminCreateTournament, adminUpdateTournamentStatus } = useTournament();
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // New Tournament Form
  const [formData, setFormData] = useState(() => ({
    name: '',
    description: 'Competitive Free Fire MAX scrim featuring Bermuda map with mobile-only enforcement.',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    game: 'Free Fire MAX' as const,
    mode: 'Squad' as 'Solo' | 'Duo' | 'Squad',
    map: 'Bermuda' as 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra',
    entryFee: 50,
    prizePool: 5000,
    maxSlots: 48,
    tournamentStart: new Date(Date.now() + 3600000 * 4).toISOString(),
    registrationEnd: new Date(Date.now() + 3600000 * 3.5).toISOString(),
  }));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminCreateTournament({
      name: formData.name,
      description: formData.description,
      banner: formData.banner,
      game: formData.game,
      mode: formData.mode,
      map: formData.map,
      perspective: 'TPP',
      teamSize: formData.mode === 'Solo' ? 1 : formData.mode === 'Duo' ? 2 : 4,
      entryFee: Number(formData.entryFee),
      prizePool: Number(formData.prizePool),
      maxSlots: Number(formData.maxSlots),
      registrationStart: new Date().toISOString(),
      tournamentStart: formData.tournamentStart,
      registrationEnd: formData.registrationEnd,
      matchCount: 3,
      status: 'REGISTRATION_OPEN',
      prizes: [
        { rank: 1, label: '1st Place (Champion)', amount: Math.round(formData.prizePool * 0.5) },
        { rank: 2, label: '2nd Place', amount: Math.round(formData.prizePool * 0.25) },
        { rank: 3, label: '3rd Place', amount: Math.round(formData.prizePool * 0.15) },
        { rank: 4, label: '4th Place', amount: Math.round(formData.prizePool * 0.1) },
      ],
      rules: [
        'Mobile devices only (Strict No-Emulator Enforcement)',
        'Free Fire MAX official client required with latest patches',
        'Strict zero-tolerance policy against hacks or file tampering',
        'Screenshots and screen recording must be retained for prize claims',
      ],
      schedule: [
        { phase: 'Registration Close', timestamp: formData.registrationEnd, completed: false },
        { phase: 'Room Credentials Release', timestamp: formData.tournamentStart, completed: false },
        { phase: 'Match Start', timestamp: formData.tournamentStart, completed: false },
      ],
      scoringRules: {
        placementPoints: { 1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1 },
        killPoints: 2,
        bonusPoints: 0,
        penalties: 0,
        tieBreakRule: 'Most Kills',
      },
    });

    setShowBuilderModal(false);
    setFormData({ ...formData, name: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming font-bold text-xl text-white uppercase tracking-wide">
            Tournament Management & Builder
          </h2>
          <p className="text-xs text-[#8E9EB5]">
            Configure prize distribution matrices, map settings, registration deadlines, and lifecycle states.
          </p>
        </div>

        <button
          onClick={() => setShowBuilderModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF2A4D]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Tournament
        </button>
      </div>

      {/* Tournaments Table */}
      <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141A27] text-[#8E9EB5] uppercase font-gaming font-bold border-b border-[#1C2538]">
              <tr>
                <th className="py-3.5 px-4">Tournament</th>
                <th className="py-3.5 px-4">Mode / Map</th>
                <th className="py-3.5 px-4">Entry / Prize</th>
                <th className="py-3.5 px-4">Slots</th>
                <th className="py-3.5 px-4">Status & State Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {tournaments.map(t => (
                <tr key={t.id} className="hover:bg-[#121824] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.banner}
                        alt={t.name}
                        className="w-12 h-10 rounded-lg object-cover border border-[#232D42]"
                      />
                      <div>
                        <span className="font-bold text-white block text-sm">{t.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {t.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{t.mode}</span>
                    <span className="text-[11px] text-[#8E9EB5]">{t.map}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-gaming font-bold text-white block">
                      Fee: {t.entryFee === 0 ? 'FREE' : `₹${t.entryFee}`}
                    </span>
                    <span className="text-[#00F59B] font-gaming font-bold">
                      Prize: ₹{t.prizePool.toLocaleString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-gaming font-bold text-white">
                    {t.joinedSlots} / {t.maxSlots}
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={t.status}
                      onChange={(e) => adminUpdateTournamentStatus(t.id, e.target.value as TournamentStatus)}
                      className="bg-[#141A27] border border-[#232D42] text-xs font-gaming font-bold text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FF2A4D]"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                      <option value="LIVE">LIVE NOW</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showBuilderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0F131C] border border-[#232B3E] rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="font-gaming font-bold text-lg text-white uppercase">New Tournament Builder</h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Tournament Title</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Free Fire Masters Cup S7"
                  className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#FF2A4D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Mode</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as any })}
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Squad">Squad (4v4)</option>
                    <option value="Duo">Duo (2v2)</option>
                    <option value="Solo">Solo (1v1)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Map</label>
                  <select
                    value={formData.map}
                    onChange={(e) => setFormData({ ...formData, map: e.target.value as any })}
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Bermuda">Bermuda</option>
                    <option value="Purgatory">Purgatory</option>
                    <option value="Kalahari">Kalahari</option>
                    <option value="Alpine">Alpine</option>
                    <option value="NexTerra">NexTerra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Entry Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: Number(e.target.value) })}
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Prize Pool (₹)</label>
                  <input
                    type="number"
                    min={500}
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: Number(e.target.value) })}
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Max Slots</label>
                  <input
                    type="number"
                    min={12}
                    max={48}
                    value={formData.maxSlots}
                    onChange={(e) => setFormData({ ...formData, maxSlots: Number(e.target.value) })}
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBuilderModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-[#141A27] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#FF2A4D] text-white font-gaming font-bold uppercase tracking-wider shadow-lg shadow-[#FF2A4D]/25"
                >
                  Publish Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
