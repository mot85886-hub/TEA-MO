'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/store';
import { Wallet, CheckCircle2, QrCode, ShieldCheck, ArrowRight, X, Smartphone, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DepositModalProps {
  onClose: () => void;
}

export default function DepositModal({ onClose }: DepositModalProps) {
  const { wallet, depositFunds, settings } = useTournament();
  const [amount, setAmount] = useState<number>(500);
  const [method, setMethod] = useState<'UPI' | 'QR' | 'CARD'>('UPI');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [txId, setTxId] = useState<string>('TX-89218492');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const quickAmounts = [100, 250, 500, 1000, 2500];

  const handleDeposit = async () => {
    setErrorMsg('');
    if (amount < settings.minDeposit) {
      setErrorMsg(`Minimum deposit amount is ₹${settings.minDeposit}`);
      return;
    }
    if (amount > settings.maxDeposit) {
      setErrorMsg(`Maximum deposit amount is ₹${settings.maxDeposit}`);
      return;
    }

    setIsProcessing(true);

    // Simulate real fintech gateway webhook verification
    setTimeout(async () => {
      const res = await depositFunds(amount, method === 'UPI' ? 'UPI_FAST' : method === 'QR' ? 'UPI_DYNAMIC_QR' : 'RAZORPAY_GATEWAY');
      setIsProcessing(false);
      if (res.success) {
        setTxId(`TX-${Math.floor(10000000 + Math.random() * 90000000)}`);
        setIsSuccess(true);
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // fallback
        }
      } else {
        setErrorMsg(res.message);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F131C] border border-[#232B3E] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1C2333] bg-[#141925]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F59B] to-[#00B0FF] flex items-center justify-center text-slate-900 shadow-lg shadow-[#00F59B]/20">
              <Wallet className="w-5 h-5 text-black font-bold" />
            </div>
            <div>
              <h3 className="font-gaming font-bold text-white text-lg tracking-wide uppercase">Deposit Funds</h3>
              <p className="text-xs text-[#8E9EB5]">Instant Secure Wallet Credit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#8E9EB5] hover:text-white hover:bg-[#1E2638] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSuccess ? (
            <div className="space-y-5">
              {/* Current balance card */}
              <div className="p-3.5 rounded-xl bg-[#141926] border border-[#1F273B] flex items-center justify-between text-xs">
                <span className="text-[#8E9EB5]">Current Available Balance:</span>
                <span className="font-bold text-sm text-white">₹{wallet.availableBalance.toLocaleString()}</span>
              </div>

              {/* Amount input */}
              <div>
                <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-1.5">Enter Deposit Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-white">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={settings.minDeposit}
                    max={settings.maxDeposit}
                    className="w-full bg-[#141926] border border-[#232B3E] rounded-xl pl-9 pr-4 py-3 text-lg font-bold text-white focus:outline-none focus:border-[#FF2A4D]"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {quickAmounts.map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        amount === val
                          ? 'bg-[#FF2A4D]/20 border-[#FF2A4D] text-[#FF2A4D]'
                          : 'bg-[#141926] border-[#1F273B] text-slate-400 hover:text-white'
                      }`}
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-[#8E9EB5] uppercase mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMethod('UPI')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      method === 'UPI'
                        ? 'bg-[#FF2A4D]/15 border-[#FF2A4D] text-white shadow-md shadow-[#FF2A4D]/10'
                        : 'bg-[#141926] border-[#1F273B] text-[#8E9EB5] hover:border-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#FF2A4D]" />
                    <span className="text-xs font-bold">UPI Apps</span>
                    <span className="text-[10px] text-slate-400">GPay / PhonePe</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('QR')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      method === 'QR'
                        ? 'bg-[#FF2A4D]/15 border-[#FF2A4D] text-white shadow-md shadow-[#FF2A4D]/10'
                        : 'bg-[#141926] border-[#1F273B] text-[#8E9EB5] hover:border-slate-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#00F59B]" />
                    <span className="text-xs font-bold">Scan QR</span>
                    <span className="text-[10px] text-slate-400">Dynamic UPI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('CARD')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      method === 'CARD'
                        ? 'bg-[#FF2A4D]/15 border-[#FF2A4D] text-white shadow-md shadow-[#FF2A4D]/10'
                        : 'bg-[#141926] border-[#1F273B] text-[#8E9EB5] hover:border-slate-600'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#00B0FF]" />
                    <span className="text-xs font-bold">Cards / Net</span>
                    <span className="text-[10px] text-slate-400">Debit / Credit</span>
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDeposit}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00B0FF] hover:opacity-95 text-slate-950 font-gaming font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#00F59B]/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Verifying Ledger...
                    </span>
                  ) : (
                    <>
                      Pay ₹{amount.toLocaleString()} & Add Funds <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E9EB5]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
                <span>256-bit Bank-Grade Encryption • Immutable Ledger</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-[#00F59B]/20 border border-[#00F59B]/40 text-[#00F59B] flex items-center justify-center mx-auto shadow-lg shadow-[#00F59B]/25">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-gaming font-bold text-xl text-white tracking-wide uppercase">Payment Verified!</h4>
                <p className="text-xs text-[#8E9EB5] mt-1">
                  ₹{amount.toLocaleString()} has been credited to your available balance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141926] border border-[#1F273B] text-left max-w-sm mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8E9EB5]">New Available Balance:</span>
                  <span className="font-bold text-[#00F59B] text-sm">₹{wallet.availableBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E9EB5]">Transaction ID:</span>
                  <span className="font-mono text-slate-400">{txId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E9EB5]">Ledger Status:</span>
                  <span className="text-[#00F59B] font-semibold">CONFIRMED IMMUTABLE</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
