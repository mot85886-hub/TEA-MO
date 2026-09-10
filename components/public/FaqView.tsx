'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Headphones } from 'lucide-react';
import { useTournament } from '@/lib/store';

export default function FaqView() {
  const { setActiveView, setActiveTab } = useTournament();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I join a Free Fire tournament on this platform?',
      a: 'Browse the Tournaments page, select an upcoming tournament that fits your mode (Solo, Duo, Squad), click "Join Tournament", confirm your IGN/UID, and lock your slot. If it is a paid tournament, ensure you have sufficient wallet balance.',
    },
    {
      q: 'Where and when do I get the Custom Room ID and Password?',
      a: 'Room ID and Password are automatically revealed inside the "Match Room" tab on your dashboard 15 minutes before the match start time. We also notify you via in-app push alerts.',
    },
    {
      q: 'What are the withdrawal rules and how fast are payouts?',
      a: 'Withdrawals are processed directly to UPI, Paytm, or Net Banking. Verified tournament prize earnings are eligible for instant withdrawal with an automated processing SLA under 15 minutes.',
    },
    {
      q: 'Are PC emulators like BlueStacks or LDPlayer allowed?',
      a: 'Strictly NO. Our tournament system only permits physical smartphones (Android/iOS). We use room telemetry checks to identify emulators. Any emulator usage results in an instant ban and forfeiture of all tournament winnings.',
    },
    {
      q: 'What if someone in the lobby is hacking or teaming?',
      a: 'If you suspect illegal gameplay, save your in-game replay or record the match. Submit a support ticket under "Match Dispute" with video timestamps within 30 minutes of match completion.',
    },
    {
      q: 'How are points calculated in Battle Royale matches?',
      a: 'Each kill grants +2 kill points. Placement points are awarded based on final survival: 1st Place (Booyah) = 15 points, 2nd Place = 12 points, 3rd Place = 10 points, and decreasing down the table.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <div className="flex items-center gap-2 text-[#00F59B] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>Support Knowledge Base</span>
        </div>
        <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
          Everything you need to know about room access, prize distribution, and fair-play enforcement.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={faq.q}
              className="rounded-2xl bg-[#0E131E] border border-[#1C2538] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 hover:bg-[#121824] transition-colors cursor-pointer"
              >
                <span className="font-gaming font-bold text-sm text-white">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#FF2A4D] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-[#8E9EB5] leading-relaxed border-t border-[#161D2C]">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support CTA card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#182133] to-[#121824] border border-[#232D42] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-gaming font-bold text-base text-white uppercase">Still have questions?</h3>
          <p className="text-xs text-[#8E9EB5]">Our 24/7 esports tournament referees and financial support desk are here to assist.</p>
        </div>
        <button
          onClick={() => {
            setActiveView('user');
            setActiveTab('support');
          }}
          className="px-5 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF2A4D]/25 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
        >
          <Headphones className="w-4 h-4" />
          Open Support Ticket
        </button>
      </div>
    </div>
  );
}
