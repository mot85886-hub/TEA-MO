'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import {
  Gamepad2,
  Lock,
  Unlock,
  Copy,
  Check,
  Upload,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Swords,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MatchRoomView() {
  const {
    matches,
    tournaments,
    selectedTournamentId,
    currentUser,
    registrations,
    submitMatchResult,
    results,
  } = useTournament();

  // Pick target match
  const currentMatch = matches.find(m => m.tournamentId === selectedTournamentId) || matches[0];
  const tournament = tournaments.find(t => t.id === currentMatch?.tournamentId);
  const userReg = registrations.find(r => r.tournamentId === currentMatch?.tournamentId && r.userId === currentUser.id);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Result submission state
  const [placement, setPlacement] = useState<number>(1);
  const [kills, setKills] = useState<number>(8);
  const [screenshotUrl, setScreenshotUrl] = useState<string>('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const copyToClipboard = (text: string | undefined, field: string) => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Calculate live preview points
  const placementPtsMap: Record<number, number> = { 1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1 };
  const previewPlacementPts = placementPtsMap[placement] || 0;
  const previewKillPts = kills * 2;
  const previewBonus = placement === 1 ? 0 : 0;
  const previewTotal = previewPlacementPts + previewKillPts + previewBonus;

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentMatch) {
      setErrorMsg('No active match room available.');
      return;
    }

    const res = submitMatchResult({
      matchId: currentMatch.id,
      tournamentId: currentMatch.tournamentId,
      placement,
      kills,
      evidenceUrl: screenshotUrl,
    });

    if (res.success) {
      setSubmittedSuccess(true);
      if (placement === 1) {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // fallback
        }
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  const existingResult = results.find(r => r.matchId === currentMatch?.id && r.submittedBy === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00F59B] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
            <Gamepad2 className="w-4 h-4" />
            <span>Custom Room Portal</span>
          </div>
          <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            {tournament?.name || 'Free Fire Tournament Room'}
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
            Match #{currentMatch?.matchNumber} • {tournament?.mode} • {tournament?.map}
          </p>
        </div>

        {/* Assigned slot badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-[#141A27] border border-[#232D42] text-right">
            <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Assigned Slot</span>
            <span className="font-gaming font-black text-base text-[#FF2A4D]">
              Slot #{userReg?.slotNumber || 4}
            </span>
          </div>
        </div>
      </div>

      {/* Main Room Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Credentials & Access */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-[#0E131E] border border-[#232D42] p-6 space-y-6 shadow-2xl">
            {/* Status pill */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-gaming font-bold text-[#8E9EB5] uppercase">
                Lobby Credentials
              </span>
              {currentMatch?.credentialsReleased ? (
                <span className="px-3 py-1 rounded-full bg-[#00F59B]/20 border border-[#00F59B]/40 text-[#00F59B] text-xs font-gaming font-bold flex items-center gap-1.5 shadow-md shadow-[#00F59B]/10">
                  <Unlock className="w-3.5 h-3.5" /> ROOM UNLOCKED
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-gaming font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> LOCKED UNTIL 15 MINS PRIOR
                </span>
              )}
            </div>

            {/* Credential Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Room ID */}
              <div className="p-4 rounded-xl bg-[#141A27] border border-[#1F283D] space-y-1 relative group">
                <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Custom Room ID</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xl sm:text-2xl text-white tracking-wider">
                    {currentMatch?.credentialsReleased ? currentMatch.roomId : '••••••••'}
                  </span>
                  {currentMatch?.credentialsReleased && (
                    <button
                      onClick={() => copyToClipboard(currentMatch.roomId, 'roomId')}
                      className="p-2 rounded-lg bg-[#1B2335] hover:bg-[#25314A] text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Room ID"
                    >
                      {copiedField === 'roomId' ? <Check className="w-4 h-4 text-[#00F59B]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="p-4 rounded-xl bg-[#141A27] border border-[#1F283D] space-y-1 relative group">
                <span className="text-[10px] text-[#8E9EB5] uppercase font-bold block">Room Password</span>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xl sm:text-2xl text-[#00F59B] tracking-wider">
                    {currentMatch?.credentialsReleased ? currentMatch.password : '••••••••'}
                  </span>
                  {currentMatch?.credentialsReleased && (
                    <button
                      onClick={() => copyToClipboard(currentMatch.password, 'password')}
                      className="p-2 rounded-lg bg-[#1B2335] hover:bg-[#25314A] text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy Password"
                    >
                      {copiedField === 'password' ? <Check className="w-4 h-4 text-[#00F59B]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* In-Game Entry Steps */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-gaming font-bold uppercase text-white tracking-wider">
                How to Enter Lobby in Free Fire
              </h4>
              <ol className="text-xs text-[#8E9EB5] space-y-2 list-decimal pl-4 leading-relaxed">
                <li>Launch Free Fire MAX on your smartphone.</li>
                <li>Tap Mode Selector &gt; Select <strong>Custom</strong> at the bottom right.</li>
                <li>Paste Room ID: <code className="text-white font-mono bg-[#161D2B] px-1.5 py-0.5 rounded">{currentMatch?.credentialsReleased ? currentMatch.roomId : '6582049'}</code> in the search bar.</li>
                <li>Click <strong>Join</strong> and enter Password: <code className="text-[#00F59B] font-mono bg-[#161D2B] px-1.5 py-0.5 rounded">{currentMatch?.credentialsReleased ? currentMatch.password : 'FF#PRO88'}</code>.</li>
                <li>Sit strictly in your assigned slot: <strong className="text-white">Slot #{userReg?.slotNumber || 4}</strong>.</li>
              </ol>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Do NOT share credentials outside your squad. Unregistered entries are kicked by referees.</span>
            </div>
          </div>
        </div>

        {/* Right: Submit Match Result */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-[#0E131E] border border-[#232D42] p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2538]">
              <div className="flex items-center gap-2">
                <Swords className="w-4 h-4 text-[#FFB800]" />
                <h3 className="font-gaming font-bold text-base text-white uppercase">Submit Match Results</h3>
              </div>
              <span className="text-[11px] text-[#8E9EB5]">Post-Match</span>
            </div>

            {existingResult ? (
              <div className="p-4 rounded-xl bg-[#141A27] border border-[#1F273B] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Submission Status</span>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                    existingResult.status === 'VERIFIED'
                      ? 'bg-[#00F59B]/20 text-[#00F59B]'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {existingResult.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-[#8E9EB5]">
                  <span>Placement:</span>
                  <strong className="text-white font-gaming">#{existingResult.placement}</strong>
                </div>
                <div className="flex justify-between text-[#8E9EB5]">
                  <span>Total Kills:</span>
                  <strong className="text-white font-gaming">{existingResult.kills} Frags</strong>
                </div>
                <div className="flex justify-between text-[#8E9EB5] border-t border-[#1C2538] pt-2">
                  <span>Awarded Points:</span>
                  <strong className="text-[#00F59B] font-gaming text-sm">{existingResult.totalScore} pts</strong>
                </div>
              </div>
            ) : submittedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#00F59B]/20 text-[#00F59B] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-gaming font-bold text-white text-lg uppercase">Evidence Submitted</h4>
                <p className="text-xs text-[#8E9EB5]">
                  Your results have been sent to tournament referee administrators. Leaderboard will update upon verification.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitResult} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Squad Placement</label>
                    <select
                      value={placement}
                      onChange={(e) => setPlacement(Number(e.target.value))}
                      className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          #{num} {num === 1 ? '— Booyah 🏆' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Total Team Kills</label>
                    <input
                      type="number"
                      min={0}
                      max={48}
                      value={kills}
                      onChange={(e) => setKills(Number(e.target.value))}
                      className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#FF2A4D]"
                    />
                  </div>
                </div>

                {/* Score Preview Box */}
                <div className="p-3 rounded-xl bg-[#141A27] border border-[#1D2538] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#8E9EB5] block text-[10px]">Calculated Points</span>
                    <span className="text-slate-400">
                      {previewPlacementPts} (Place) + {previewKillPts} (Kills)
                    </span>
                  </div>
                  <span className="font-gaming font-black text-xl text-[#00F59B]">
                    {previewTotal} pts
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1">Screenshot Evidence URL</label>
                  <input
                    type="url"
                    value={screenshotUrl}
                    onChange={(e) => setScreenshotUrl(e.target.value)}
                    placeholder="https://imgur.com/your-scoreboard-screenshot.png"
                    className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Upload your end-match scoreboard screenshot showing kills and placement.
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF2A4D] to-[#FF6B00] hover:opacity-95 text-white font-gaming font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF2A4D]/25 transition-all cursor-pointer"
                >
                  Submit Score for Referee Verification
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
