'use client';

import React, { useState } from 'react';
import ClientDate from '../common/ClientDate';
import { useTournament } from '@/lib/store';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ShieldCheck,
  Plus,
  Send,
  AlertCircle,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Lock
} from 'lucide-react';
import DepositModal from '../modals/DepositModal';

export default function WalletView() {
  const { wallet, ledger, withdrawals, requestWithdrawal, settings } = useTournament();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'WITHDRAW' | 'LEDGER'>('OVERVIEW');
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawMethod, setWithdrawMethod] = useState<'UPI' | 'BANK_TRANSFER' | 'PAYTM'>('UPI');
  const [accountDetails, setAccountDetails] = useState<string>('player@upi');
  const [withdrawMsg, setWithdrawMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Filter ledger
  const [ledgerFilter, setLedgerFilter] = useState<string>('ALL');

  const filteredLedger = ledger.filter(item => {
    if (ledgerFilter === 'ALL') return true;
    return item.type === ledgerFilter;
  });

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawMsg(null);

    const res = requestWithdrawal(withdrawAmount, withdrawMethod, accountDetails);
    if (res.success) {
      setWithdrawMsg({ success: true, text: res.message });
      setTimeout(() => {
        setActiveTab('OVERVIEW');
      }, 1500);
    } else {
      setWithdrawMsg({ success: false, text: res.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00F59B] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" />
            <span>Fintech Wallet & Double-Entry Ledger</span>
          </div>
          <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Esports Balance & Payouts
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
            Bank-grade cryptographic ledger with automated UPI payouts and instantaneous tournament settlements.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-5 py-3 rounded-xl bg-[#00F59B] hover:bg-[#00D484] text-black font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00F59B]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Funds
          </button>
          <button
            onClick={() => setActiveTab('WITHDRAW')}
            className="px-5 py-3 rounded-xl bg-[#141A27] hover:bg-[#1E2638] text-white font-gaming font-bold text-xs uppercase tracking-wider border border-[#232D42] flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" /> Withdraw
          </button>
        </div>
      </div>

      {/* Balance Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#121A2A] to-[#0D121D] border border-[#232F47] space-y-2 relative overflow-hidden shadow-xl">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
            <div className="w-7 h-7 rounded-lg bg-[#00F59B]/10 text-[#00F59B] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="font-gaming font-black text-3xl text-[#00F59B]">
            ₹{wallet.availableBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8E9EB5] block">Ready for entry fees or withdrawal</span>
        </div>

        {/* Pending In-Flight Balance */}
        <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-xs font-bold uppercase tracking-wider">In-Flight / Pending</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-gaming font-black text-3xl text-amber-300">
            ₹{wallet.pendingBalance.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8E9EB5] block">Queued in payout verification</span>
        </div>

        {/* Total Deposited */}
        <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Deposited</span>
            <div className="w-7 h-7 rounded-lg bg-[#00B0FF]/10 text-[#00B0FF] flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="font-gaming font-black text-3xl text-white">
            ₹{wallet.totalDeposited.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8E9EB5] block">Lifetime inward transactions</span>
        </div>

        {/* Total Winnings */}
        <div className="p-6 rounded-2xl bg-[#0E131E] border border-[#1F273B] space-y-2">
          <div className="flex items-center justify-between text-[#8E9EB5]">
            <span className="text-xs font-bold uppercase tracking-wider">Total Winnings</span>
            <div className="w-7 h-7 rounded-lg bg-[#FFB800]/10 text-[#FFB800] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-gaming font-black text-3xl text-[#FFB800]">
            ₹{wallet.totalWinnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#8E9EB5] block">Cumulative prize earnings</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1C2538] space-x-6 text-xs font-gaming font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'OVERVIEW'
              ? 'border-[#00F59B] text-[#00F59B]'
              : 'border-transparent text-[#8E9EB5] hover:text-white'
          }`}
        >
          Ledger Transactions ({ledger.length})
        </button>
        <button
          onClick={() => setActiveTab('WITHDRAW')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'WITHDRAW'
              ? 'border-[#00F59B] text-[#00F59B]'
              : 'border-transparent text-[#8E9EB5] hover:text-white'
          }`}
        >
          Withdraw Funds
        </button>
        <button
          onClick={() => setActiveTab('LEDGER')}
          className={`pb-3 transition-colors cursor-pointer border-b-2 ${
            activeTab === 'LEDGER'
              ? 'border-[#00F59B] text-[#00F59B]'
              : 'border-transparent text-[#8E9EB5] hover:text-white'
          }`}
        >
          Pending Payout Requests ({withdrawals.length})
        </button>
      </div>

      {/* Tab: Overview (Ledger) */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'ENTRY_FEE', 'PRIZE', 'REFUND'].map(type => (
                <button
                  key={type}
                  onClick={() => setLedgerFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-gaming font-bold uppercase transition-all cursor-pointer ${
                    ledgerFilter === type
                      ? 'bg-[#1C263A] text-white border border-[#2D3C5C]'
                      : 'bg-[#0E131E] text-[#8E9EB5] hover:text-white border border-[#182030]'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>

            <span className="text-xs text-[#8E9EB5] hidden sm:inline">
              Double-Entry Immutable Audit Log
            </span>
          </div>

          {/* Ledger Table */}
          <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141A27] text-[#8E9EB5] uppercase font-gaming font-bold border-b border-[#1C2538]">
                  <tr>
                    <th className="py-3.5 px-4">Tx Reference</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Balance Movement</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#172033]">
                  {filteredLedger.map((tx) => {
                    const isCredit = tx.type === 'DEPOSIT' || tx.type === 'PRIZE' || tx.type === 'REFUND';
                    return (
                      <tr key={tx.id} className="hover:bg-[#121824] transition-colors">
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          <span className="font-semibold text-white block">{tx.reference}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{tx.idempotencyKey}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'PRIZE'
                              ? 'bg-[#FFB800]/20 text-[#FFB800]'
                              : tx.type === 'DEPOSIT'
                              ? 'bg-[#00F59B]/20 text-[#00F59B]'
                              : tx.type === 'WITHDRAWAL'
                              ? 'bg-[#00B0FF]/20 text-[#00B0FF]'
                              : tx.type === 'REFUND'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-[#FF2A4D]/20 text-[#FF2A4D]'
                          }`}>
                            {tx.type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-gaming font-bold text-sm">
                          <span className={isCredit ? 'text-[#00F59B]' : 'text-red-400'}>
                            {isCredit ? '+' : '-'}₹{tx.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          ₹{tx.balanceBefore.toLocaleString()} &rarr; <strong className="text-white">₹{tx.balanceAfter.toLocaleString()}</strong>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#00F59B] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                          <ClientDate
                            date={tx.timestamp}
                            format="full"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Withdraw */}
      {activeTab === 'WITHDRAW' && (
        <div className="max-w-xl mx-auto bg-[#0E131E] border border-[#212B3E] rounded-2xl p-6 space-y-6 shadow-2xl">
          <div>
            <h3 className="font-gaming font-bold text-lg text-white uppercase">Request Instant Withdrawal</h3>
            <p className="text-xs text-[#8E9EB5] mt-1">
              Funds will be disbursed to your bank or UPI account upon referee compliance verification.
            </p>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1.5">
                Amount to Withdraw (₹)
              </label>
              <input
                type="number"
                min={settings.minWithdrawal}
                max={settings.maxWithdrawal}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-[#00F59B]"
              />
              <div className="flex justify-between text-[11px] text-[#8E9EB5] mt-1">
                <span>Min: ₹{settings.minWithdrawal}</span>
                <span>Available: ₹{wallet.availableBalance.toLocaleString()}</span>
                <span>Max: ₹{settings.maxWithdrawal}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1.5">
                Payout Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'UPI', label: 'UPI Fast' },
                  { id: 'BANK_TRANSFER', label: 'Bank IMPS' },
                  { id: 'PAYTM', label: 'Paytm Wallet' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setWithdrawMethod(p.id as any)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      withdrawMethod === p.id
                        ? 'bg-[#00F59B]/15 border-[#00F59B] text-white'
                        : 'bg-[#141A27] border-[#1E273B] text-[#8E9EB5] hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1.5">
                {withdrawMethod === 'UPI' ? 'UPI Virtual Payment Address (VPA)' : 'Bank Account & IFSC'}
              </label>
              <input
                type="text"
                required
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder={withdrawMethod === 'UPI' ? 'yourname@oksbi' : 'A/C 501004..., IFSC HDFC000...'}
                className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00F59B]"
              />
            </div>

            {withdrawMsg && (
              <div
                className={`p-3 rounded-xl border text-xs ${
                  withdrawMsg.success
                    ? 'bg-[#00F59B]/10 border-[#00F59B]/30 text-[#00F59B]'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {withdrawMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={withdrawAmount > wallet.availableBalance}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00B0FF] hover:opacity-95 text-slate-950 font-gaming font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00F59B]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              Submit Withdrawal Request
            </button>
          </form>
        </div>
      )}

      {/* Tab: Pending Withdrawals */}
      {activeTab === 'LEDGER' && (
        <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl p-5 space-y-4">
          <h3 className="font-gaming font-bold text-base text-white uppercase">
            Queued Withdrawal Requests ({withdrawals.length})
          </h3>

          <div className="space-y-3">
            {withdrawals.map(req => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-[#141A27] border border-[#1D2538] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-gaming font-bold text-base text-white">₹{req.amount}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00B0FF]/20 text-[#00B0FF]">
                      {req.method}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.status === 'PAID'
                        ? 'bg-[#00F59B]/20 text-[#00F59B]'
                        : req.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <span className="text-[#8E9EB5] block mt-1">Recipient: {req.accountDetails}</span>
                </div>

                <div className="text-right text-[11px] text-slate-400">
                  <span>Requested: <ClientDate date={req.requestDate} format="full" /></span>
                  {req.adminNote && (
                    <span className="block text-slate-300 italic mt-0.5">Note: {req.adminNote}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showDepositModal && <DepositModal onClose={() => setShowDepositModal(false)} />}
    </div>
  );
}
