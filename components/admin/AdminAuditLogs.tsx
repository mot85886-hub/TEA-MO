'use client';

import React, { useState } from 'react';
import ClientDate from '../common/ClientDate';
import { useTournament } from '@/lib/store';
import { History, Shield, Filter, Search } from 'lucide-react';

export default function AdminAuditLogs() {
  const { auditLogs } = useTournament();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.entityId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-gaming font-bold text-xl text-white uppercase tracking-wide flex items-center gap-2">
            <History className="w-5 h-5 text-[#00B0FF]" /> Security & Financial Audit Trail
          </h2>
          <p className="text-xs text-[#8E9EB5]">
            Immutable chronological record of administrative actions, credential releases, and treasury payouts.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search action or actor..."
            className="w-full bg-[#141A27] border border-[#232D42] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00B0FF]"
          />
        </div>
      </div>

      <div className="bg-[#0E131E] rounded-2xl border border-[#1C2538] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141A27] text-[#8E9EB5] uppercase font-gaming font-bold border-b border-[#1C2538]">
              <tr>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Operator / Role</th>
                <th className="py-3.5 px-4">Entity Target</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172033]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#121824] transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-white bg-[#161E2E] px-2 py-0.5 rounded text-[11px] border border-[#243048]">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{log.actor}</span>
                    <span className="text-[10px] text-amber-400 font-mono">{log.actorRole}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {log.entity} <span className="text-[10px] text-slate-500 font-mono">({log.entityId})</span>
                  </td>

                  <td className="py-3.5 px-4 text-[#8E9EB5] max-w-sm truncate">
                    {JSON.stringify(log.metadata)}
                  </td>

                  <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                    <ClientDate
                      date={log.timestamp}
                      format="full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
