'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tournament,
  User,
  Team,
  Match,
  Registration,
  MatchResult,
  UserWallet,
  WalletLedgerItem,
  WithdrawalRequest,
  SupportTicket,
  AppNotification,
  AuditLog,
  SystemSettings,
  LeaderboardEntry,
  Role,
  TournamentStatus,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_TEAMS,
  INITIAL_TOURNAMENTS,
  INITIAL_MATCHES,
  INITIAL_REGISTRATIONS,
  INITIAL_RESULTS,
  INITIAL_LEADERBOARD,
  INITIAL_WALLET,
  INITIAL_LEDGER,
  INITIAL_WITHDRAWALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SETTINGS,
} from './mockData';

interface TournamentContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: Role) => void;
  allUsers: User[];
  
  // Navigation
  activeView: 'public' | 'user' | 'admin';
  setActiveView: (view: 'public' | 'user' | 'admin') => void;
  activeTab: string;
  setActiveTab: (tab: string, contextId?: string) => void;
  selectedTournamentId: string | null;
  setSelectedTournamentId: (id: string | null) => void;
  isJoinModalOpen: boolean;
  setIsJoinModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Data Collections
  tournaments: Tournament[];
  matches: Match[];
  registrations: Registration[];
  results: MatchResult[];
  leaderboard: LeaderboardEntry[];
  wallet: UserWallet;
  ledger: WalletLedgerItem[];
  withdrawals: WithdrawalRequest[];
  notifications: AppNotification[];
  tickets: SupportTicket[];
  teams: Team[];
  auditLogs: AuditLog[];
  settings: SystemSettings;

  // Actions
  joinTournament: (tournamentId: string, teamId?: string, ign?: string, playerUid?: string) => { success: boolean; message: string };
  depositFunds: (amount: number, provider: string) => Promise<{ success: boolean; message: string }>;
  requestWithdrawal: (amount: number, method: 'UPI' | 'BANK_TRANSFER' | 'PAYTM', accountDetails: string) => { success: boolean; message: string };
  adminApproveWithdrawal: (id: string, adminNote?: string) => void;
  adminRejectWithdrawal: (id: string, reason: string) => void;
  submitMatchResult: (data: { matchId: string; tournamentId: string; placement: number; kills: number; evidenceUrl?: string }) => { success: boolean; message: string };
  adminVerifyResult: (resultId: string, verified: boolean, adminNote?: string) => void;
  adminCreateTournament: (tournament: Omit<Tournament, 'id' | 'slug' | 'joinedSlots' | 'createdAt'>) => void;
  adminUpdateTournamentStatus: (id: string, status: TournamentStatus) => void;
  adminUpdateMatchCredentials: (matchId: string, roomId: string, password: string, releaseNow: boolean) => void;
  createTeam: (name: string, tag: string) => Team;
  createSupportTicket: (category: SupportTicket['category'], subject: string, message: string) => void;
  replySupportTicket: (ticketId: string, message: string, isAdmin?: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [activeView, setActiveView] = useState<'public' | 'user' | 'admin'>('public');
  const [activeTab, setActiveTabState] = useState<string>('home');
  const [selectedTournamentId, setSelectedTournamentId] = useState<string | null>('tourn-1');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  const [results, setResults] = useState<MatchResult[]>(INITIAL_RESULTS);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [wallet, setWallet] = useState<UserWallet>(INITIAL_WALLET);
  const [ledger, setLedger] = useState<WalletLedgerItem[]>(INITIAL_LEDGER);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  const setActiveTab = (tab: string, contextId?: string) => {
    setActiveTabState(tab);
    if (contextId) {
      setSelectedTournamentId(contextId);
    }
  };

  const switchUserRole = (role: Role) => {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      setCurrentUser(INITIAL_USERS[2]);
      setActiveView('admin');
      setActiveTabState('admin-dashboard');
    } else {
      setCurrentUser({ ...INITIAL_USERS[0], role });
    }
  };

  // Join Tournament with Atomic Balance & Ledger Deduction
  const joinTournament = (tournamentId: string, teamId?: string, ign?: string, playerUid?: string): { success: boolean; message: string } => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) {
      return { success: false, message: 'Tournament not found.' };
    }

    if (tournament.joinedSlots >= tournament.maxSlots) {
      return { success: false, message: 'Tournament has reached maximum capacity.' };
    }

    if (tournament.status !== 'REGISTRATION_OPEN' && tournament.status !== 'LIVE') {
      return { success: false, message: 'Registration is currently closed for this event.' };
    }

    // Check if already registered
    const existing = registrations.find(r => r.tournamentId === tournamentId && r.userId === currentUser.id);
    if (existing) {
      return { success: false, message: 'You have already registered for this tournament.' };
    }

    // Check wallet balance if entry fee > 0
    if (tournament.entryFee > 0 && wallet.availableBalance < tournament.entryFee) {
      return {
        success: false,
        message: `Insufficient wallet balance. Entry fee is ₹${tournament.entryFee}, available: ₹${wallet.availableBalance}. Please deposit funds.`
      };
    }

    const assignedSlot = tournament.joinedSlots + 1;
    const team = teamId ? teams.find(t => t.id === teamId) : undefined;
    const userTeam = teams.find(t => t.id === currentUser.teamId);

    // Atomic wallet update
    if (tournament.entryFee > 0) {
      const balanceBefore = wallet.availableBalance;
      const balanceAfter = balanceBefore - tournament.entryFee;
      
      const newTx: WalletLedgerItem = {
        id: `tx-${Date.now()}`,
        userId: currentUser.id,
        amount: tournament.entryFee,
        currency: 'INR',
        type: 'ENTRY_FEE',
        status: 'COMPLETED',
        reference: `ENTRY-${tournament.name.slice(0, 16)}`,
        timestamp: new Date().toISOString(),
        balanceBefore,
        balanceAfter,
        idempotencyKey: `idem-join-${tournamentId}-${Date.now()}`,
      };

      setWallet(prev => ({
        ...prev,
        availableBalance: balanceAfter,
      }));
      setLedger(prev => [newTx, ...prev]);
    }

    // Create registration
    const newReg: Registration = {
      id: `reg-${Date.now()}`,
      tournamentId,
      userId: currentUser.id,
      userName: currentUser.username,
      teamId: team?.id || userTeam?.id,
      teamName: team?.name || userTeam?.name || currentUser.username,
      ign: ign || currentUser.ign,
      playerUid: playerUid || currentUser.playerUid,
      slotNumber: assignedSlot,
      registeredAt: new Date().toISOString(),
      status: 'CONFIRMED',
    };

    setRegistrations(prev => [newReg, ...prev]);

    // Increment slot in tournament
    setTournaments(prev =>
      prev.map(t => (t.id === tournamentId ? { ...t, joinedSlots: t.joinedSlots + 1 } : t))
    );

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Registration Confirmed!',
      message: `You successfully joined ${tournament.name} (Assigned Slot #${assignedSlot}). Good luck!`,
      type: 'TOURNAMENT',
      read: false,
      timestamp: new Date().toISOString(),
      link: '/user/my-tournaments',
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Audit log
    const newAudit: AuditLog = {
      id: `audit-${Date.now()}`,
      actor: currentUser.username,
      actorRole: currentUser.role,
      action: 'TOURNAMENT_JOINED',
      entity: 'Registration',
      entityId: newReg.id,
      metadata: { tournamentId, entryFee: tournament.entryFee, slotNumber: assignedSlot },
      ip: '127.0.0.1',
      userAgent: 'WebClient/EsportsPlatform',
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newAudit, ...prev]);

    return {
      success: true,
      message: `Registration confirmed! Slot #${assignedSlot} assigned.`
    };
  };

  // Deposit funds
  const depositFunds = async (amount: number, provider: string): Promise<{ success: boolean; message: string }> => {
    if (amount < settings.minDeposit) {
      return { success: false, message: `Minimum deposit amount is ₹${settings.minDeposit}` };
    }
    if (amount > settings.maxDeposit) {
      return { success: false, message: `Maximum deposit amount is ₹${settings.maxDeposit}` };
    }

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore + amount;

    const newTx: WalletLedgerItem = {
      id: `tx-${Date.now()}`,
      userId: currentUser.id,
      amount,
      currency: 'INR',
      type: 'DEPOSIT',
      status: 'COMPLETED',
      reference: `${provider}-PAY-${Date.now().toString().slice(-8)}`,
      timestamp: new Date().toISOString(),
      balanceBefore,
      balanceAfter,
      idempotencyKey: `idem-dep-${Date.now()}`,
    };

    setWallet(prev => ({
      ...prev,
      availableBalance: balanceAfter,
      totalDeposited: prev.totalDeposited + amount,
    }));
    setLedger(prev => [newTx, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Deposit Successful!',
      message: `₹${amount.toLocaleString()} has been credited to your wallet via ${provider}.`,
      type: 'WALLET',
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: `₹${amount} added successfully to your wallet.` };
  };

  // Request withdrawal
  const requestWithdrawal = (
    amount: number,
    method: 'UPI' | 'BANK_TRANSFER' | 'PAYTM',
    accountDetails: string
  ): { success: boolean; message: string } => {
    if (amount < settings.minWithdrawal) {
      return { success: false, message: `Minimum withdrawal is ₹${settings.minWithdrawal}` };
    }
    if (amount > settings.maxWithdrawal) {
      return { success: false, message: `Maximum withdrawal is ₹${settings.maxWithdrawal}` };
    }
    if (amount > wallet.availableBalance) {
      return { success: false, message: `Insufficient balance. Available: ₹${wallet.availableBalance}` };
    }

    const fee = method === 'BANK_TRANSFER' ? 25 : 0;
    const finalAmount = amount - fee;

    const newReq: WithdrawalRequest = {
      id: `wdr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      amount,
      method,
      accountDetails,
      processingFee: fee,
      finalAmount,
      status: 'PENDING',
      requestDate: new Date().toISOString(),
    };

    // Move from available to pending
    setWallet(prev => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      pendingBalance: prev.pendingBalance + amount,
    }));

    setWithdrawals(prev => [newReq, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Withdrawal Queued',
      message: `Withdrawal of ₹${amount} via ${method} has been submitted for verification.`,
      type: 'WALLET',
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: 'Withdrawal request submitted for compliance verification.' };
  };

  // Admin approves withdrawal
  const adminApproveWithdrawal = (id: string, adminNote?: string) => {
    const req = withdrawals.find(w => w.id === id);
    if (!req || req.status !== 'PENDING') return;

    setWithdrawals(prev =>
      prev.map(w =>
        w.id === id
          ? {
              ...w,
              status: 'PAID',
              processingDate: new Date().toISOString(),
              adminNote: adminNote || 'Approved and settled via automated payout pipe.',
            }
          : w
      )
    );

    // Ledger update
    const newTx: WalletLedgerItem = {
      id: `tx-${Date.now()}`,
      userId: req.userId,
      amount: req.amount,
      currency: 'INR',
      type: 'WITHDRAWAL',
      status: 'COMPLETED',
      reference: `WDR-PAYOUT-${req.method}-${req.id}`,
      timestamp: new Date().toISOString(),
      balanceBefore: wallet.availableBalance,
      balanceAfter: wallet.availableBalance,
      idempotencyKey: `idem-wdr-settle-${id}`,
    };

    setWallet(prev => ({
      ...prev,
      pendingBalance: Math.max(0, prev.pendingBalance - req.amount),
      totalWithdrawn: prev.totalWithdrawn + req.amount,
    }));
    setLedger(prev => [newTx, ...prev]);

    // Audit log
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        actor: currentUser.username,
        actorRole: currentUser.role,
        action: 'WITHDRAWAL_APPROVED',
        entity: 'WithdrawalRequest',
        entityId: id,
        metadata: { amount: req.amount, user: req.userName, method: req.method },
        ip: '127.0.0.1',
        userAgent: 'AdminConsole',
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Admin rejects withdrawal
  const adminRejectWithdrawal = (id: string, reason: string) => {
    const req = withdrawals.find(w => w.id === id);
    if (!req || req.status !== 'PENDING') return;

    setWithdrawals(prev =>
      prev.map(w =>
        w.id === id
          ? {
              ...w,
              status: 'REJECTED',
              processingDate: new Date().toISOString(),
              adminNote: reason,
            }
          : w
      )
    );

    // Refund pending back to available
    setWallet(prev => ({
      ...prev,
      availableBalance: prev.availableBalance + req.amount,
      pendingBalance: Math.max(0, prev.pendingBalance - req.amount),
    }));

    // Record refund ledger
    const refundTx: WalletLedgerItem = {
      id: `tx-${Date.now()}`,
      userId: req.userId,
      amount: req.amount,
      currency: 'INR',
      type: 'REFUND',
      status: 'COMPLETED',
      reference: `REFUND-WDR-${req.id}-${reason.slice(0, 16)}`,
      timestamp: new Date().toISOString(),
      balanceBefore: wallet.availableBalance,
      balanceAfter: wallet.availableBalance + req.amount,
      idempotencyKey: `idem-wdr-refund-${id}`,
    };
    setLedger(prev => [refundTx, ...prev]);
  };

  // Submit Match Result
  const submitMatchResult = (data: {
    matchId: string;
    tournamentId: string;
    placement: number;
    kills: number;
    evidenceUrl?: string;
  }): { success: boolean; message: string } => {
    const tournament = tournaments.find(t => t.id === data.tournamentId);
    const scoring = tournament?.scoringRules || {
      placementPoints: { 1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1 },
      killPoints: 2,
      bonusPoints: 0,
      penalties: 0,
      tieBreakRule: 'Most Kills',
    };

    const placementPts = scoring.placementPoints[data.placement] || 0;
    const killPts = data.kills * scoring.killPoints;
    const bonus = data.placement === 1 ? scoring.bonusPoints : 0;
    const totalScore = placementPts + killPts + bonus;

    const userTeam = teams.find(t => t.id === currentUser.teamId);

    const newResult: MatchResult = {
      id: `res-${Date.now()}`,
      matchId: data.matchId,
      tournamentId: data.tournamentId,
      teamId: userTeam?.id,
      teamName: userTeam?.name || currentUser.username,
      playerUid: currentUser.playerUid,
      placement: data.placement,
      kills: data.kills,
      placementPoints: placementPts,
      killPoints: killPts,
      bonusPoints: bonus,
      penalties: 0,
      totalScore,
      evidenceUrl: data.evidenceUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      status: 'UNDER_REVIEW',
      submittedBy: currentUser.id,
      submittedByName: currentUser.username,
      submittedAt: new Date().toISOString(),
    };

    setResults(prev => [newResult, ...prev]);

    return {
      success: true,
      message: `Result submitted (${totalScore} calculated points). Awaiting admin verification.`,
    };
  };

  // Admin verify result
  const adminVerifyResult = (resultId: string, verified: boolean, adminNote?: string) => {
    const res = results.find(r => r.id === resultId);
    if (!res) return;

    const newStatus = verified ? 'VERIFIED' : 'REJECTED';

    setResults(prev =>
      prev.map(r =>
        r.id === resultId
          ? {
              ...r,
              status: newStatus,
              verifiedAt: new Date().toISOString(),
              adminNote: adminNote || (verified ? 'Verified with lobby telemetry.' : 'Rejected - invalid screenshot.'),
            }
          : r
      )
    );

    if (verified) {
      // Update or insert into leaderboard
      setLeaderboard(prev => {
        const existingIdx = prev.findIndex(item => item.teamOrPlayerName === res.teamName);
        if (existingIdx >= 0) {
          const updated = [...prev];
          const current = updated[existingIdx];
          updated[existingIdx] = {
            ...current,
            matches: current.matches + 1,
            kills: current.kills + res.kills,
            placementPoints: current.placementPoints + res.placementPoints,
            killPoints: current.killPoints + res.killPoints,
            bonus: current.bonus + res.bonusPoints,
            totalScore: current.totalScore + res.totalScore,
          };
          return updated.sort((a, b) => b.totalScore - a.totalScore).map((item, idx) => ({ ...item, rank: idx + 1 }));
        } else {
          const newEntry: LeaderboardEntry = {
            rank: prev.length + 1,
            teamOrPlayerName: res.teamName,
            teamId: res.teamId,
            matches: 1,
            kills: res.kills,
            placementPoints: res.placementPoints,
            killPoints: res.killPoints,
            bonus: res.bonusPoints,
            penalty: 0,
            totalScore: res.totalScore,
          };
          return [...prev, newEntry].sort((a, b) => b.totalScore - a.totalScore).map((item, idx) => ({ ...item, rank: idx + 1 }));
        }
      });

      // If rank 1 champion, reward prize
      if (res.placement === 1) {
        const tournament = tournaments.find(t => t.id === res.tournamentId);
        const firstPrize = tournament?.prizes?.find(p => p.rank === 1)?.amount || 1000;

        const prizeTx: WalletLedgerItem = {
          id: `tx-${Date.now()}`,
          userId: res.submittedBy,
          amount: firstPrize,
          currency: 'INR',
          type: 'PRIZE',
          status: 'COMPLETED',
          reference: `PRIZE-BOOYAH-1ST-${res.tournamentId}`,
          timestamp: new Date().toISOString(),
          balanceBefore: wallet.availableBalance,
          balanceAfter: wallet.availableBalance + firstPrize,
          idempotencyKey: `idem-prize-${resultId}`,
        };

        setWallet(prev => ({
          ...prev,
          availableBalance: prev.availableBalance + firstPrize,
          totalWinnings: prev.totalWinnings + firstPrize,
        }));
        setLedger(prev => [prizeTx, ...prev]);

        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            userId: res.submittedBy,
            title: 'Prize Credited! 🏆',
            message: `Booyah! Your 1st place prize of ₹${firstPrize} has been credited to your wallet.`,
            type: 'WALLET',
            read: false,
            timestamp: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    }

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        actor: currentUser.username,
        actorRole: currentUser.role,
        action: verified ? 'RESULT_VERIFIED' : 'RESULT_REJECTED',
        entity: 'MatchResult',
        entityId: resultId,
        metadata: { teamName: res.teamName, kills: res.kills, placement: res.placement },
        ip: '127.0.0.1',
        userAgent: 'AdminConsole',
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Admin create tournament
  const adminCreateTournament = (tournamentData: Omit<Tournament, 'id' | 'slug' | 'joinedSlots' | 'createdAt'>) => {
    const slug = tournamentData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newTournament: Tournament = {
      ...tournamentData,
      id: `tourn-${Date.now()}`,
      slug,
      joinedSlots: 0,
      createdAt: new Date().toISOString(),
    };

    setTournaments(prev => [newTournament, ...prev]);

    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        actor: currentUser.username,
        actorRole: currentUser.role,
        action: 'TOURNAMENT_CREATED',
        entity: 'Tournament',
        entityId: newTournament.id,
        metadata: { name: newTournament.name, prizePool: newTournament.prizePool, mode: newTournament.mode },
        ip: '127.0.0.1',
        userAgent: 'AdminConsole',
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Admin update tournament status
  const adminUpdateTournamentStatus = (id: string, status: TournamentStatus) => {
    setTournaments(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
    setAuditLogs(prev => [
      {
        id: `audit-${Date.now()}`,
        actor: currentUser.username,
        actorRole: currentUser.role,
        action: 'TOURNAMENT_STATUS_UPDATED',
        entity: 'Tournament',
        entityId: id,
        metadata: { newStatus: status },
        ip: '127.0.0.1',
        userAgent: 'AdminConsole',
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Admin update match room credentials
  const adminUpdateMatchCredentials = (matchId: string, roomId: string, password: string, releaseNow: boolean) => {
    setMatches(prev =>
      prev.map(m =>
        m.id === matchId
          ? {
              ...m,
              roomId,
              password,
              credentialsReleased: releaseNow,
              status: releaseNow ? 'LIVE' : m.status,
            }
          : m
      )
    );

    if (releaseNow) {
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          title: 'Room Details Released!',
          message: `Room ID: ${roomId} | Password: ${password}. Enter the custom room lobby immediately.`,
          type: 'MATCH',
          read: false,
          timestamp: new Date().toISOString(),
          link: '/user/match-room',
        },
        ...prev,
      ]);
    }
  };

  // Create team
  const createTeam = (name: string, tag: string): Team => {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name,
      tag: tag.toUpperCase(),
      logo: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=150&auto=format&fit=crop&q=80',
      captainId: currentUser.id,
      matchesPlayed: 0,
      wins: 0,
      totalEarnings: 0,
      createdAt: new Date().toISOString(),
      members: [
        {
          userId: currentUser.id,
          username: currentUser.username,
          ign: currentUser.ign,
          playerUid: currentUser.playerUid,
          role: 'CAPTAIN',
          joinedAt: new Date().toISOString(),
        },
      ],
    };

    setTeams(prev => [newTeam, ...prev]);
    setCurrentUser(prev => ({ ...prev, teamId: newTeam.id }));
    return newTeam;
  };

  // Support ticket
  const createSupportTicket = (category: SupportTicket['category'], subject: string, message: string) => {
    const newTicket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.username,
      category,
      subject,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'USER',
          senderName: currentUser.username,
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const replySupportTicket = (ticketId: string, message: string, isAdmin = false) => {
    setTickets(prev =>
      prev.map(t => {
        if (t.id === ticketId) {
          const newMessage = {
            id: `msg-${Date.now()}`,
            sender: isAdmin ? ('ADMIN' as const) : ('USER' as const),
            senderName: isAdmin ? 'Support Officer' : currentUser.username,
            message,
            timestamp: new Date().toISOString(),
          };
          return {
            ...t,
            status: isAdmin ? 'WAITING_USER' : 'IN_PROGRESS',
            updatedAt: new Date().toISOString(),
            messages: [...t.messages, newMessage],
          };
        }
        return t;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <TournamentContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        allUsers,
        activeView,
        setActiveView,
        activeTab,
        setActiveTab,
        selectedTournamentId,
        setSelectedTournamentId,
        isJoinModalOpen,
        setIsJoinModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        tournaments,
        matches,
        registrations,
        results,
        leaderboard,
        wallet,
        ledger,
        withdrawals,
        notifications,
        tickets,
        teams,
        auditLogs,
        settings,
        joinTournament,
        depositFunds,
        requestWithdrawal,
        adminApproveWithdrawal,
        adminRejectWithdrawal,
        submitMatchResult,
        adminVerifyResult,
        adminCreateTournament,
        adminUpdateTournamentStatus,
        adminUpdateMatchCredentials,
        createTeam,
        createSupportTicket,
        replySupportTicket,
        markNotificationAsRead,
        markAllNotificationsRead,
        updateSettings,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}
