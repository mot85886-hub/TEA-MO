'use client';

import React, { useState } from 'react';
import ClientDate from '../common/ClientDate';
import { useTournament } from '@/lib/store';
import { CheckCircle2, XCircle, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react';

export default function AdminWalletPayments() {
  const { withdrawals, adminApproveWithdrawal, adminRejectWithdrawal, ledger } = useTournament();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING');

  const handleRejectConfirm = () => {
    if (!rejectId) return;
    adminRejectWithdrawal(rejectId, reason || 'Invalid payment account or failed bank verification.');
    setRejectId(null);
    setReason('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-gaming font-bold text-xl text-white uppercase tracking-wide">
          Treasury & Withdrawal Approvals
        </h2>
        <p className="text-xs text-[#8E9EB5]">
          Inspect pending user withdrawals, verify KYC/banking endpoints, and authorize automated UPI/IMPS payouts.
        </p>
      </div>

      {/* Pending Withdrawals Table */}
      <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl">
        <div className="p-4 bg-[#141A27] border-b border-[#1C2538] flex items-center justify-between">
          <span className="font-gaming font-bold text-sm text-white uppercase">
            Pending Payout Queue ({pendingWithdrawals.length})
          </span>
          <span className="text-xs text-[#8E9EB5]">Double-Entry Guaranteed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#101522] text-[#8E9EB5] uppercase font-gaming font-bold border-b border-[#1C2538]">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method & Account</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {withdrawals.map(w => (
                <tr key={w.id} className="hover:bg-[#121824] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {w.userName}
                    <span className="block text-[10px] text-slate-500 font-mono">ID: {w.id}</span>
                  </td>

                  <td className="py-3.5 px-4 font-gaming font-black text-sm text-[#00F59B]">
                    ₹{w.amount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00B0FF]/20 text-[#00B0FF] mr-2">
                      {w.method}
                    </span>
                    <span className="font-mono text-slate-300 text-xs">{w.accountDetails}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    <ClientDate
                      date={w.requestDate}
                      format="full"
                    />
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      w.status === 'PAID'
                        ? 'bg-[#00F59B]/20 text-[#00F59B]'
                        : w.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {w.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {w.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => adminApproveWithdrawal(w.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#00F59B] hover:bg-[#00D484] text-black font-gaming font-bold text-xs uppercase flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve Payout
                        </button>
                        <button
                          onClick={() => setRejectId(w.id)}
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

      {/* Rejection Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#232B3E] rounded-2xl p-6 space-y-4">
            <h3 className="font-gaming font-bold text-base text-white uppercase text-red-400">
              Reject Withdrawal Request
            </h3>
            <p className="text-xs text-[#8E9EB5]">
              Rejecting this request will immediately refund the full amount back to the user&apos;s available wallet balance.
            </p>

            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. UPI VPA invalid or KYC verification failure..."
              className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectId(null)}
                className="w-1/3 py-2 rounded-xl bg-[#141A27] text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                className="w-2/3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-gaming font-bold text-xs uppercase"
              >
                Reject & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
