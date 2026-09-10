'use client';

import React, { useState } from 'react';
import ClientDate from '../common/ClientDate';
import { useTournament } from '@/lib/store';
import { SupportTicket } from '@/lib/types';
import { Headphones, Plus, Send, MessageSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function SupportTicketsView() {
  const { tickets, createSupportTicket, replySupportTicket, currentUser } = useTournament();
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('TOURNAMENT');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) return;
    createSupportTicket(newCategory, newSubject, newMessage);
    setShowNewTicketModal(false);
    setNewSubject('');
    setNewMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    replySupportTicket(selectedTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#00B0FF] text-xs font-gaming font-bold uppercase tracking-wider mb-1">
            <Headphones className="w-4 h-4" />
            <span>24/7 Esports Desk</span>
          </div>
          <h1 className="font-gaming font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
            Support & Disputes
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9EB5] mt-1">
            Submit match disputes, payment queries, or cheater reports directly to platform referees.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="px-5 py-3 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white font-gaming font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#FF2A4D]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Open New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Ticket List */}
        <div className="lg:col-span-4 bg-[#0E131E] rounded-2xl border border-[#1C2538] p-4 space-y-3">
          <span className="text-xs font-gaming font-bold text-[#8E9EB5] uppercase block px-1">
            Your Tickets ({tickets.length})
          </span>

          <div className="space-y-2 overflow-y-auto max-h-[480px]">
            {tickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicketId(ticket.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedTicket?.id === ticket.id
                    ? 'bg-[#182133] border-[#FF2A4D]/50 text-white'
                    : 'bg-[#141A27] border-[#1D2538] text-[#8E9EB5] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#FF2A4D]/20 text-[#FF2A4D]">
                    {ticket.category}
                  </span>
                  <span className={`text-[10px] font-bold ${ticket.status === 'RESOLVED' ? 'text-[#00F59B]' : 'text-amber-400'}`}>
                    {ticket.status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs truncate">{ticket.subject}</h4>
                <ClientDate
                  date={ticket.updatedAt}
                  format="date"
                  className="text-[10px] text-slate-500 block mt-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Thread */}
        <div className="lg:col-span-8 bg-[#0E131E] rounded-2xl border border-[#1C2538] flex flex-col justify-between overflow-hidden shadow-xl">
          {selectedTicket ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-[#1C2538] bg-[#141A27] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedTicket.subject}</h3>
                  <span className="text-[11px] text-[#8E9EB5]">
                    Category: {selectedTicket.category} • Status: <strong className="text-[#00F59B]">{selectedTicket.status}</strong>
                  </span>
                </div>
              </div>

              {/* Message List */}
              <div className="p-5 overflow-y-auto space-y-4 flex-1 max-h-96">
                {selectedTicket.messages.map(msg => {
                  const isMe = msg.sender === 'USER';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#8E9EB5]">{msg.senderName}</span>
                        <ClientDate
                          date={msg.timestamp}
                          format="time"
                          className="text-[9px] text-slate-600"
                        />
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#FF2A4D] text-white rounded-tr-none shadow-md shadow-[#FF2A4D]/10'
                            : 'bg-[#182133] text-slate-200 border border-[#232D42] rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Input */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-[#1C2538] bg-[#121724] flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to support..."
                  className="flex-1 bg-[#182133] border border-[#232D42] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF2A4D]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#FF2A4D] hover:bg-[#E01E3F] text-white text-xs font-gaming font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply
                </button>
              </form>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">No ticket selected.</div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0F131C] border border-[#232B3E] rounded-2xl p-6 space-y-4">
            <h3 className="font-gaming font-bold text-lg text-white uppercase">Open Support Ticket</h3>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#FF2A4D]"
                >
                  <option value="TOURNAMENT">Tournament & Match Room</option>
                  <option value="WALLET">Wallet & Payouts</option>
                  <option value="CHEATING">Report Hacker / Teaming</option>
                  <option value="GENERAL">General Query</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Room password issue in Match #1"
                  className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF2A4D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#8E9EB5] uppercase mb-1">Details / Description</label>
                <textarea
                  rows={4}
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Explain the issue with relevant match details or transaction IDs..."
                  className="w-full bg-[#141A27] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF2A4D]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-[#141A27] text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-[#FF2A4D] text-white font-gaming font-bold uppercase tracking-wider"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
