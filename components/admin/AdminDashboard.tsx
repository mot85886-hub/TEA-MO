'use client';

import React, { useState } from 'react';
import ClientDate from '../common/ClientDate';
import { useTournament } from '@/lib/store';
import {
  ShieldAlert,
  Trophy,
  Swords,
  Wallet,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  KeyRound,
  FileCheck,
  Settings,
  History,
  Lock,
  ExternalLink
} from 'lucide-react';
import AdminTournaments from './AdminTournaments';
import AdminMatchManagement from './AdminMatchManagement';
import AdminResultsVerification from './AdminResultsVerification';
import AdminWalletPayments from './AdminWalletPayments';
import AdminAuditLogs from './AdminAuditLogs';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  const {
    currentUser,
    tournaments,
    matches,
    results,
    withdrawals,
    auditLogs,
    settings,
    setActiveView,
    setActiveTab,
  } = useTournament();

  const [adminTab, setAdminTab] = useState<
    'OVERVIEW' | 'TOURNAMENTS' | 'MATCHES' | 'RESULTS' | 'PAYMENTS' | 'AUDIT' | 'SETTINGS'
  >('OVERVIEW');

  const pendingResults = results.filter(r => r.status === 'UNDER_REVIEW').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING').length;
  const activeLobbies = matches.filter(m => m.status === 'LIVE').length;

  return (
    <div className="min-h-screen bg-[#06080D] text-slate-200">
      {/* Admin Top Banner */}
      <div className="border-b border-[#1A2336] bg-[#0A0E17] px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold shadow-lg shadow-amber-500/10">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-gaming font-black text-lg text-white uppercase tracking-wide">
                SUPER ADMIN OPERATIONS CONSOLE
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase">
                TIER-1 ACCESS
              </span>
            </div>
            <p className="text-xs text-[#8E9EB5]">
              Logged in as: <strong className="text-white">{currentUser.username}</strong> ({currentUser.role})
            </p>
          </div>
        </div>

        {/* Navigation back to public or user view */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveView('public');
              setActiveTab('home');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#141A27] hover:bg-[#1E2638] text-slate-300 text-xs font-bold border border-[#232D42] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Exit to Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Admin Sub-Navbar */}
      <div className="border-b border-[#1A2336] bg-[#0C101A] px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 overflow-x-auto py-2.5 text-xs font-gaming font-bold uppercase tracking-wider">
          {[
            { id: 'OVERVIEW', label: 'Platform Metrics' },
            { id: 'TOURNAMENTS', label: `Tournaments (${tournaments.length})` },
            { id: 'MATCHES', label: 'Match Rooms & IDs' },
            { id: 'RESULTS', label: `Result Verification (${pendingResults} Pending)` },
            { id: 'PAYMENTS', label: `Payouts & Ledger (${pendingWithdrawals} Pending)` },
            { id: 'AUDIT', label: 'Audit Trail' },
            { id: 'SETTINGS', label: 'Platform Controls' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                adminTab === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-[#8E9EB5] hover:text-white hover:bg-[#151C2C]'
              }`}
            >
              {tab.label}
              {tab.id === 'RESULTS' && pendingResults > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
              {tab.id === 'PAYMENTS' && pendingWithdrawals > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Admin Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* OVERVIEW TAB */}
        {adminTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E9EB5]">Total Tournaments</span>
                <div className="font-gaming font-black text-3xl text-white">{tournaments.length}</div>
                <span className="text-[11px] text-[#00F59B] block">All Brackets Active</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E9EB5]">Pending Results Review</span>
                <div className={`font-gaming font-black text-3xl ${pendingResults > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                  {pendingResults}
                </div>
                <button
                  onClick={() => setAdminTab('RESULTS')}
                  className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                >
                  Inspect Screenshots &rarr;
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E9EB5]">Pending Payouts</span>
                <div className={`font-gaming font-black text-3xl ${pendingWithdrawals > 0 ? 'text-amber-400' : 'text-[#00F59B]'}`}>
                  {pendingWithdrawals}
                </div>
                <button
                  onClick={() => setAdminTab('PAYMENTS')}
                  className="text-[11px] text-[#00F59B] hover:underline cursor-pointer"
                >
                  Approve Bank/UPI &rarr;
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8E9EB5]">Platform Fee Model</span>
                <div className="font-gaming font-black text-3xl text-white">{settings.platformFeePercent}%</div>
                <span className="text-[11px] text-[#8E9EB5] block">Automated rake deduction</span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-4">
              <h3 className="font-gaming font-bold text-base text-white uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Referee Operational Shortcuts
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setAdminTab('TOURNAMENTS')}
                  className="p-4 rounded-xl bg-[#141A27] hover:bg-[#1C2538] border border-[#212C42] text-left space-y-1 transition-all cursor-pointer group"
                >
                  <Trophy className="w-5 h-5 text-[#FF2A4D] group-hover:scale-110 transition-transform" />
                  <span className="font-gaming font-bold text-sm text-white block">Create New Tournament</span>
                  <span className="text-[11px] text-[#8E9EB5] block">Build brackets, set entry fee and prize matrix</span>
                </button>

                <button
                  onClick={() => setAdminTab('MATCHES')}
                  className="p-4 rounded-xl bg-[#141A27] hover:bg-[#1C2538] border border-[#212C42] text-left space-y-1 transition-all cursor-pointer group"
                >
                  <KeyRound className="w-5 h-5 text-[#00F59B] group-hover:scale-110 transition-transform" />
                  <span className="font-gaming font-bold text-sm text-white block">Release Room Credentials</span>
                  <span className="text-[11px] text-[#8E9EB5] block">Dispatch Room ID & Password to squads</span>
                </button>

                <button
                  onClick={() => setAdminTab('RESULTS')}
                  className="p-4 rounded-xl bg-[#141A27] hover:bg-[#1C2538] border border-[#212C42] text-left space-y-1 transition-all cursor-pointer group"
                >
                  <FileCheck className="w-5 h-5 text-[#FFB800] group-hover:scale-110 transition-transform" />
                  <span className="font-gaming font-bold text-sm text-white block">Verify Scoreboards</span>
                  <span className="text-[11px] text-[#8E9EB5] block">Inspect screenshots and credit winner wallets</span>
                </button>
              </div>
            </div>

            {/* Recent Audit Logs snippet */}
            <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-gaming font-bold text-base text-white uppercase flex items-center gap-2">
                  <History className="w-4 h-4 text-[#00B0FF]" /> Live Audit Stream
                </h3>
                <button
                  onClick={() => setAdminTab('AUDIT')}
                  className="text-xs text-[#00B0FF] hover:underline cursor-pointer"
                >
                  View Full Audit Log
                </button>
              </div>

              <div className="divide-y divide-[#172033] text-xs">
                {auditLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white font-mono">{log.action}</span>
                      <span className="text-[#8E9EB5]">by {log.actor} ({log.actorRole})</span>
                    </div>
                    <ClientDate
                      date={log.timestamp}
                      format="time"
                      className="text-slate-500 font-mono text-[11px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TOURNAMENTS TAB */}
        {adminTab === 'TOURNAMENTS' && <AdminTournaments />}

        {/* MATCHES TAB */}
        {adminTab === 'MATCHES' && <AdminMatchManagement />}

        {/* RESULTS VERIFICATION TAB */}
        {adminTab === 'RESULTS' && <AdminResultsVerification />}

        {/* PAYMENTS & LEDGER TAB */}
        {adminTab === 'PAYMENTS' && <AdminWalletPayments />}

        {/* AUDIT LOG TAB */}
        {adminTab === 'AUDIT' && <AdminAuditLogs />}

        {/* SETTINGS TAB */}
        {adminTab === 'SETTINGS' && <AdminSettings />}
      </div>
    </div>
  );
}
