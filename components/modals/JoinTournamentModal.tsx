'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Tournament } from '@/lib/types';
import { Trophy, Users, ShieldAlert, CheckCircle2, Wallet, ArrowRight, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import ClientDate from '../common/ClientDate';

interface JoinTournamentModalProps {
  tournament: Tournament;
  onClose: () => void;
}

export default function JoinTournamentModal({ tournament, onClose }: JoinTournamentModalProps) {
  const { currentUser, teams, wallet, joinTournament, setActiveTab } = useTournament();
  const [step, setStep] = useState<number>(1);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(currentUser.teamId || '');
  const [ign, setIgn] = useState<string>(currentUser.ign || '');
  const [playerUid, setPlayerUid] = useState<string>(currentUser.playerUid || '');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [assignedSlot, setAssignedSlot] = useState<number>(tournament.joinedSlots + 1);

  const userTeam = teams.find(t => t.id === selectedTeamId);
  const hasSufficientBalance = wallet.availableBalance >= tournament.entryFee;

  const handleConfirmRegistration = () => {
    setErrorMsg('');
    if (!termsAccepted) {
      setErrorMsg('You must agree to the tournament fair-play rules.');
      return;
    }

    if (tournament.mode !== 'Solo' && !selectedTeamId) {
      setErrorMsg('Please select or create a team for squad/duo modes.');
      return;
    }

    if (!hasSufficientBalance && tournament.entryFee > 0) {
      setErrorMsg(`Insufficient wallet balance. You need ₹${tournament.entryFee}, but your available balance is ₹${wallet.availableBalance}.`);
      return;
    }

    const res = joinTournament(tournament.id, selectedTeamId || undefined, ign, playerUid);
    if (res.success) {
      setIsSuccess(true);
      setAssignedSlot(tournament.joinedSlots + 1);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // confetti fallback
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F131C] border border-[#232B3E] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1C2333] bg-[#141925]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2A4D] to-[#FF6B00] flex items-center justify-center text-white shadow-lg shadow-[#FF2A4D]/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-white text-lg tracking-wide uppercase">Join Tournament</h3>
              <p className="text-xs text-[#8E9EB5] truncate max-w-xs">{tournament.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#8E9EB5] hover:text-white hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isSuccess ? (
            <div>
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-6 px-2">
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 1 ? 'text-[#FF2A4D]' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-[#FF2A4D] text-white' : 'bg-[#1C2333] text-slate-400'}`}>1</span>
                  Details
                </div>
                <div className="h-[2px] w-8 bg-[#1C2333]" />
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 2 ? 'text-[#FF2A4D]' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-[#FF2A4D] text-white' : 'bg-[#1C2333] text-slate-400'}`}>2</span>
                  Verification
                </div>
                <div className="h-[2px] w-8 bg-[#1C2333]" />
                <div className={`flex items-center gap-2 text-xs font-semibold ${step >= 3 ? 'text-[#FF2A4D]' : 'text-slate-500'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-[#FF2A4D] text-white' : 'bg-[#1C2333] text-slate-400'}`}>3</span>
                  Payment
                </div>
              </div>

              {/* Step 1: Team & Player Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-[#141926] p-3.5 rounded-xl border border-[#1F273B] flex items-center justify-between text-xs">
                    <span className="text-[#8E9EB5]">Tournament Mode:</span>
                    <span className="font-semibold text-white px-2 py-0.5 rounded bg-[#FF2A4D]/20 text-[#FF2A4D]">
                      {tournament.mode} • {tournament.map}
                    </span>
                  </div>

                  {tournament.mode !== 'Solo' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1.5">Select Team</label>
                      <select
                        value={selectedTeamId}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2A4D]"
                      >
                        <option value="">-- Choose Team --</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name} ({team.tag}) — {team.members.length} Players
                          </option>
                        ))}
                      </select>
                      {!selectedTeamId && (
                        <p className="text-[11px] text-amber-400 mt-1">Squad mode requires an eligible team roster.</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1.5">Free Fire In-Game Name (IGN)</label>
                    <input
                      type="text"
                      value={ign}
                      onChange={(e) => setIgn(e.target.value)}
                      placeholder="e.g. Phoenix_99"
                      className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2A4D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1.5">Free Fire Player UID</label>
                    <input
                      type="text"
                      value={playerUid}
                      onChange={(e) => setPlayerUid(e.target.value)}
                      placeholder="e.g. FF-89241031"
                      className="w-full bg-[#141926] border border-[#232B3E] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF2A4D]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setStep(2)}
                      disabled={tournament.mode !== 'Solo' && !selectedTeamId}
                      className="w-full py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#FF2A4D]/25 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      Next: Verify Eligibility <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Rules & Eligibility */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="bg-[#141926] p-4 rounded-xl border border-[#1F273B] space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF2A4D] flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> Official Eligibility Checks
                    </h4>
                    <ul className="text-xs text-[#8E9EB5] space-y-1.5 list-disc pl-4">
                      <li>Free Fire account level 40+ with clean fair-play record.</li>
                      <li>Smartphones only. Emulators (Bluestacks/LDPlayer) strictly barred.</li>
                      <li>Screenshot proof of final kill screen required within 15 mins.</li>
                      <li>Custom Room ID & Password released 15 mins prior to match.</li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141926] border border-[#1F273B]">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 accent-[#FF2A4D] w-4 h-4 rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-slate-300 leading-relaxed cursor-pointer">
                      I certify that our squad meets all criteria and accept anti-cheat hardware verification and tournament rules.
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3 rounded-xl bg-[#161D2B] hover:bg-[#1E2638] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!termsAccepted}
                      className="w-2/3 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#FF2A4D]/25 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      Next: Entry Fee & Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment & Ledger Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-[#141926] p-4 rounded-xl border border-[#1F273B] space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1F273B]">
                      <span className="text-[#8E9EB5]">Tournament Entry Fee:</span>
                      <span className="font-bold text-base text-white">
                        {tournament.entryFee === 0 ? 'FREE ENTRY' : `₹${tournament.entryFee}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1F273B]">
                      <span className="text-[#8E9EB5]">Your Available Wallet:</span>
                      <span className={`font-semibold ${hasSufficientBalance ? 'text-[#00F59B]' : 'text-red-400'}`}>
                        ₹{wallet.availableBalance.toLocaleString()}
                      </span>
                    </div>

                    {tournament.entryFee > 0 && (
                      <div className="flex items-center justify-between text-xs text-[#8E9EB5]">
                        <span>Balance After Deduction:</span>
                        <span className="font-medium text-white">
                          ₹{Math.max(0, wallet.availableBalance - tournament.entryFee).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {!hasSufficientBalance && tournament.entryFee > 0 && (
                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
                      <span>Insufficient wallet balance.</span>
                      <button
                        onClick={() => {
                          onClose();
                          setActiveTab('wallet');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 cursor-pointer"
                      >
                        Deposit ₹{tournament.entryFee - wallet.availableBalance}
                      </button>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3 rounded-xl bg-[#161D2B] hover:bg-[#1E2638] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmRegistration}
                      disabled={!hasSufficientBalance && tournament.entryFee > 0}
                      className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-[#FF2A4D] to-[#FF6B00] hover:opacity-95 text-white font-gaming font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#FF2A4D]/25 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      Confirm Registration
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Success confirmation */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#00F59B]/20 border border-[#00F59B]/40 text-[#00F59B] flex items-center justify-center mx-auto shadow-lg shadow-[#00F59B]/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-gaming font-bold text-xl text-white tracking-wide uppercase">Registration Confirmed!</h4>
                <p className="text-xs text-[#8E9EB5] mt-1">
                  You are officially locked in for <strong className="text-white">{tournament.name}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141926] border border-[#1F273B] text-left max-w-sm mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8E9EB5]">Assigned Slot:</span>
                  <span className="font-bold text-[#FF2A4D] text-sm">Slot #{assignedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E9EB5]">Team / Player:</span>
                  <span className="font-medium text-white">{userTeam?.name || ign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E9EB5]">Match Time:</span>
                  <ClientDate
                    date={tournament.tournamentStart}
                    format="time"
                    className="font-medium text-white"
                  />
                </div>
                <div className="flex justify-between border-t border-[#1F273B] pt-2">
                  <span className="text-[#8E9EB5]">Room Status:</span>
                  <span className="text-[#00F59B] font-semibold">Releases 15m Prior</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3 justify-center">
                <button
                  onClick={() => {
                    onClose();
                    setActiveTab('match-room');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs tracking-wider uppercase shadow-lg shadow-[#FF2A4D]/25 transition-all cursor-pointer"
                >
                  Go To Match Room
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#161D2B] hover:bg-[#1E2638] text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
