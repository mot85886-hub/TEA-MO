'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { CheckCircle2, XCircle, ExternalLink, Image as ImageIcon, Award, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminResultsVerification() {
  const { results, adminVerifyResult } = useTournament();
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = (id: string) => {
    adminVerifyResult(id, true, 'Verified via match lobby scoreboard screenshot.');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // fallback
    }
  };

  const handleRejectClick = (id: string) => {
    setSelectedResultId(id);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!selectedResultId) return;
    adminVerifyResult(selectedResultId, false, rejectReason || 'Scoreboard does not match lobby telemetry.');
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gaming font-bold text-xl text-white uppercase tracking-wide">
          Match Result Verification & Automated Payouts
        </h2>
        <p className="text-xs text-[#8E9EB5]">
          Inspect uploaded in-game scoreboard screenshots, verify team frags, auto-calculate points, and disburse prize pool funds directly to winning wallets.
        </p>
      </div>

      <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141A27] text-[#8E9EB5] uppercase font-gaming font-bold border-b border-[#1C2538]">
              <tr>
                <th className="py-3.5 px-4">Squad / Player</th>
                <th className="py-3.5 px-4 text-center">Placement</th>
                <th className="py-3.5 px-4 text-center">Kills</th>
                <th className="py-3.5 px-4 text-center">Total Points</th>
                <th className="py-3.5 px-4 text-center">Scoreboard Evidence</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Referee Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {results.map(res => (
                <tr key={res.id} className="hover:bg-[#121824] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white text-sm block">{res.teamName}</span>
                    <span className="text-[10px] text-[#8E9EB5] font-mono">UID: {res.playerUid}</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded font-gaming font-bold text-xs ${
                      res.placement === 1 ? 'bg-[#FFB800] text-black' : 'bg-[#182133] text-white'
                    }`}>
                      #{res.placement} {res.placement === 1 ? '🏆' : ''}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center font-gaming font-bold text-white text-sm">
                    {res.kills}
                  </td>

                  <td className="py-3.5 px-4 text-center font-gaming font-black text-sm text-[#00F59B]">
                    {res.totalScore} pts
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <a
                      href={res.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#00B0FF] hover:underline bg-[#141A27] px-2.5 py-1 rounded-lg border border-[#212B3E]"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      View Screenshot
                    </a>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      res.status === 'VERIFIED'
                        ? 'bg-[#00F59B]/20 text-[#00F59B]'
                        : res.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {res.status.replace('_', ' ')}
                    </span>
                    {res.adminNote && (
                      <span className="block text-[10px] text-slate-400 italic mt-0.5 truncate max-w-xs">
                        {res.adminNote}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {res.status === 'UNDER_REVIEW' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(res.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#00F59B] hover:bg-[#00D484] text-black font-gaming font-bold text-xs uppercase flex items-center gap-1 shadow-md shadow-[#00F59B]/15 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve & Pay
                        </button>
                        <button
                          onClick={() => handleRejectClick(res.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#182133] hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#232B3E] rounded-2xl p-6 space-y-4">
            <h3 className="font-gaming font-bold text-base text-white uppercase text-red-400">
              Reject Match Result
            </h3>
            <p className="text-xs text-[#8E9EB5]">
              Specify the reason for rejecting this match submission (e.g. missing screenshot, emulator detected, kills mismatch).
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. End scoreboard screenshot does not display full team lobby..."
              className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="w-1/3 py-2 rounded-xl bg-[#141A27] text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="w-2/3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-gaming font-bold text-xs uppercase"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
