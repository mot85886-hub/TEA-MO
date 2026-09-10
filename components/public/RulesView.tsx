'use client';

import React from 'react';
import { ShieldAlert, BookOpen, CheckCircle, Smartphone, AlertTriangle, Scale, Trophy } from 'lucide-react';

export default function RulesView() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[#FF2A4D] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Rulebook & Handbook</span>
        </div>
        <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
          Official Tournament Regulations
        </h1>
        <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
          Standard operational competitive guidelines governing custom room matches, scoring mechanics, and anti-cheat policies.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1C2538] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF2A4D]/10 text-[#FF2A4D] flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="font-gaming font-bold text-lg text-white uppercase">Player & Account Eligibility</h2>
          </div>
          <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-5 leading-relaxed">
            <li>Players must have an active Free Fire MAX profile at Level 40 or above with an account age exceeding 30 calendar days.</li>
            <li>In-game nicknames (IGN) submitted at registration must exactly mirror the in-game account. Any discrepancies may forfeit lobby slots.</li>
            <li>Smurf accounts or accounts previously banned by Garena will be immediately disqualified with no refund of entry fees.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1C2538] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="font-gaming font-bold text-lg text-white uppercase">Hardware & Platform Constraints</h2>
          </div>
          <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-5 leading-relaxed">
            <li><strong>Smartphone Only:</strong> Tournaments strictly mandate physical Android or iOS smartphones.</li>
            <li><strong>Emulators Strictly Prohibited:</strong> BlueStacks, LDPlayer, Gameloop, Nox, or any PC emulation layers will trigger automated detection and immediate forfeiture.</li>
            <li><strong>No External Triggers:</strong> Hardware macros or mechanical triggers with programmable rapid-fire chips are banned.</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1C2538] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00F59B]/10 text-[#00F59B] flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="font-gaming font-bold text-lg text-white uppercase">Room Entry & Punctuality Protocol</h2>
          </div>
          <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-5 leading-relaxed">
            <li>Custom Room ID and Password will be unlocked inside the web portal precisely 15 minutes before the match start time.</li>
            <li>Squads must join their pre-assigned slot number (e.g. Slot #4). Sitting in another team’s slot will result in being kicked by the lobby referee.</li>
            <li>Matches will launch exactly on schedule. If a player or squad fails to connect in time, the match will proceed without delay.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1C2538] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00B0FF]/10 text-[#00B0FF] flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="font-gaming font-bold text-lg text-white uppercase">Proof of Results & Payout Settlement</h2>
          </div>
          <ul className="text-xs text-slate-300 space-y-2.5 list-disc pl-5 leading-relaxed">
            <li>The winning team and participating captains must capture clear, unedited screenshots of the final results scoreboard showing kills and placement.</li>
            <li>Evidence must be submitted within 15 minutes of match completion via the Match Room dashboard.</li>
            <li>Once verified by referee administrators, prize funds are credited automatically to the winning captain’s double-entry wallet ledger.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
