'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { db, auth, googleProvider, testConnection } from './firebase';
import { handleFirestoreError, OperationType } from './firebaseErrors';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';

interface TournamentContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: Role) => void;
  allUsers: User[];

  // Firebase Auth
  firebaseUser: FirebaseUser | null;
  isFirebaseLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isFirebaseConnected: boolean;

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

  // Firebase auth state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Collections
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

  const setActiveTab = useCallback((tab: string, contextId?: string) => {
    setActiveTabState(tab);
    if (contextId) {
      setSelectedTournamentId(contextId);
    }
  }, []);

  const switchUserRole = useCallback((role: Role) => {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      setCurrentUser(INITIAL_USERS[2]);
      setActiveView('admin');
      setActiveTabState('admin-dashboard');
    } else {
      setCurrentUser({ ...INITIAL_USERS[0], role });
    }
  }, []);

  // 1. Initial connection verification
  useEffect(() => {
    async function initConnection() {
      try {
        await testConnection();
        setIsFirebaseConnected(true);
      } catch (err) {
        console.warn('Firebase offline or initial check:', err);
      }
    }
    initConnection();
  }, []);

  // 2. Auth State Changed Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsFirebaseLoading(false);
      setFirebaseUser(fbUser);

      if (fbUser) {
        setIsFirebaseConnected(true);
        const userRef = doc(db, 'users', fbUser.uid);
        const walletRef = doc(db, 'wallets', fbUser.uid);

        try {
          const userSnap = await getDoc(userRef);
          const isBootstrappedAdmin = fbUser.email === 'mot85886@gmail.com';

          if (userSnap.exists()) {
            const data = userSnap.data() as User;
            setCurrentUser(data);
            if (data.role === 'SUPER_ADMIN' || data.role === 'ADMIN') {
              setActiveView('admin');
              setActiveTabState('admin-dashboard');
            }
          } else {
            // Seed new user profile in Firestore
            const newProfile: User = {
              id: fbUser.uid,
              fullName: fbUser.displayName || 'Gamer ' + fbUser.uid.slice(0, 5),
              username: fbUser.displayName ? fbUser.displayName.replace(/\s+/g, '_') : 'Gamer_' + fbUser.uid.slice(0, 5),
              email: fbUser.email || '',
              mobile: fbUser.phoneNumber || '+91 98765 00000',
              role: isBootstrappedAdmin ? 'SUPER_ADMIN' : 'USER',
              playerUid: 'FF-' + Math.floor(10000000 + Math.random() * 90000000),
              ign: (fbUser.displayName || 'Player').replace(/\s+/g, '_').slice(0, 16),
              avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              createdAt: new Date().toISOString(),
              status: 'ACTIVE',
              stats: {
                totalMatches: 0,
                wins: 0,
                winRate: 0,
                totalEarnings: 0,
                kills: 0,
                kdRatio: 0,
              },
              achievements: [
                {
                  id: 'ach-welcome',
                  title: 'Verified Competitor',
                  description: 'Linked Firebase Google Account to Esports Network',
                  icon: 'Flame',
                  unlockedAt: new Date().toISOString(),
                },
              ],
            };

            await setDoc(userRef, newProfile);
            setCurrentUser(newProfile);

            if (isBootstrappedAdmin) {
              const adminRef = doc(db, 'admins', fbUser.uid);
              await setDoc(adminRef, {
                userId: fbUser.uid,
                email: fbUser.email,
                role: 'SUPER_ADMIN',
                createdAt: new Date().toISOString(),
              });
              setActiveView('admin');
              setActiveTabState('admin-dashboard');
            }
          }

          // Ensure wallet exists in Firestore
          const walletSnap = await getDoc(walletRef);
          if (!walletSnap.exists()) {
            const initialWallet: UserWallet = {
              userId: fbUser.uid,
              availableBalance: 500, // ₹500 welcome bonus
              pendingBalance: 0,
              lockedBalance: 0,
              totalDeposited: 500,
              totalWithdrawn: 0,
              totalWinnings: 0,
            };
            await setDoc(walletRef, initialWallet);
            setWallet(initialWallet);
          } else {
            setWallet(walletSnap.data() as UserWallet);
          }
        } catch (error) {
          console.error('Error synchronizing user profile with Firestore:', error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 3. Realtime Firestore Listeners
  // Tournaments Listener
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'tournaments'),
      async (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Tournament);
          setTournaments(list);
        } else {
          // Auto-seed initial tournaments to Firestore for instant usability
          for (const t of INITIAL_TOURNAMENTS) {
            try {
              await setDoc(doc(db, 'tournaments', t.id), t);
            } catch {
              // Ignore seed errors if offline or unauthorized
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'tournaments');
      }
    );

    return () => unsub();
  }, []);

  // Matches Listener
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'matches'),
      async (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Match);
          setMatches(list);
        } else {
          for (const m of INITIAL_MATCHES) {
            try {
              await setDoc(doc(db, 'matches', m.id), m);
            } catch {
              // ignore
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'matches');
      }
    );

    return () => unsub();
  }, []);

  // Teams Listener
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'teams'),
      async (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Team);
          setTeams(list);
        } else {
          for (const tm of INITIAL_TEAMS) {
            try {
              await setDoc(doc(db, 'teams', tm.id), tm);
            } catch {
              // ignore
            }
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'teams');
      }
    );

    return () => unsub();
  }, []);

  // Settings Listener
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'global'),
      async (snapshot) => {
        if (snapshot.exists()) {
          setSettings(snapshot.data() as SystemSettings);
        } else {
          try {
            await setDoc(doc(db, 'settings', 'global'), INITIAL_SETTINGS);
          } catch {
            // ignore
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/global');
      }
    );

    return () => unsub();
  }, []);

  // User-specific listeners (Registrations, Wallet, Ledger, Withdrawals, Tickets, Notifications)
  useEffect(() => {
    const regUnsub = onSnapshot(
      collection(db, 'registrations'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as Registration);
          setRegistrations(list);
        }
      },
      () => {}
    );

    const walletUnsub = onSnapshot(
      doc(db, 'wallets', currentUser.id),
      (snapshot) => {
        if (snapshot.exists()) {
          setWallet(snapshot.data() as UserWallet);
        }
      },
      () => {}
    );

    const ledgerUnsub = onSnapshot(
      collection(db, 'ledger'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as WalletLedgerItem);
          setLedger(list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
      },
      () => {}
    );

    const wdrUnsub = onSnapshot(
      collection(db, 'withdrawals'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as WithdrawalRequest);
          setWithdrawals(list.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
        }
      },
      () => {}
    );

    const ticketUnsub = onSnapshot(
      collection(db, 'tickets'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as SupportTicket);
          setTickets(list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        }
      },
      () => {}
    );

    const notifUnsub = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as AppNotification);
          setNotifications(list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
      },
      () => {}
    );

    const resUnsub = onSnapshot(
      collection(db, 'results'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as MatchResult);
          setResults(list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
        }
      },
      () => {}
    );

    const auditUnsub = onSnapshot(
      collection(db, 'auditLogs'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => d.data() as AuditLog);
          setAuditLogs(list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        }
      },
      () => {}
    );

    return () => {
      regUnsub();
      walletUnsub();
      ledgerUnsub();
      wdrUnsub();
      ticketUnsub();
      notifUnsub();
      resUnsub();
      auditUnsub();
    };
  }, [currentUser.id]);

  // Auth Functions
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setIsAuthModalOpen(false);
      }
    } catch (error) {
      console.error('Firebase Google Sign-In Error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(INITIAL_USERS[0]);
      setActiveView('public');
      setActiveTabState('home');
    } catch (error) {
      console.error('Firebase Sign-Out Error:', error);
    }
  };

  // Join Tournament with Atomic Balance & Ledger Deduction + Firestore persistence
  const joinTournament = async (
    tournamentId: string,
    teamId?: string,
    ign?: string,
    playerUid?: string
  ): Promise<{ success: boolean; message: string }> => {
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

    // Create registration record
    const newRegId = `reg-${Date.now()}`;
    const newReg: Registration = {
      id: newRegId,
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

    // Optimistic local updates
    setRegistrations(prev => [newReg, ...prev]);
    setTournaments(prev =>
      prev.map(t => (t.id === tournamentId ? { ...t, joinedSlots: t.joinedSlots + 1 } : t))
    );

    // Atomic wallet update
    if (tournament.entryFee > 0) {
      const balanceBefore = wallet.availableBalance;
      const balanceAfter = balanceBefore - tournament.entryFee;

      const newTxId = `tx-${Date.now()}`;
      const newTx: WalletLedgerItem = {
        id: newTxId,
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

      const updatedWallet: UserWallet = {
        ...wallet,
        availableBalance: balanceAfter,
      };

      setWallet(updatedWallet);
      setLedger(prev => [newTx, ...prev]);

      try {
        await setDoc(doc(db, 'ledger', newTxId), newTx);
        await setDoc(doc(db, 'wallets', currentUser.id), updatedWallet);
      } catch (err) {
        console.warn('Firestore ledger write deferred/local:', err);
      }
    }

    // Persist to Firestore
    try {
      await setDoc(doc(db, 'registrations', newRegId), newReg);
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        joinedSlots: assignedSlot,
      });

      const notifId = `notif-${Date.now()}`;
      const newNotif: AppNotification = {
        id: notifId,
        userId: currentUser.id,
        title: 'Registration Confirmed!',
        message: `You successfully joined ${tournament.name} (Slot #${assignedSlot}). Good luck!`,
        type: 'TOURNAMENT',
        read: false,
        timestamp: new Date().toISOString(),
        link: '/user/my-tournaments',
      };
      await setDoc(doc(db, 'notifications', notifId), newNotif);
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      console.warn('Firestore registration write deferred/local:', err);
    }

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

    const txId = `tx-${Date.now()}`;
    const newTx: WalletLedgerItem = {
      id: txId,
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

    const updatedWallet: UserWallet = {
      ...wallet,
      availableBalance: balanceAfter,
      totalDeposited: wallet.totalDeposited + amount,
    };

    setWallet(updatedWallet);
    setLedger(prev => [newTx, ...prev]);

    const notifId = `notif-${Date.now()}`;
    const notif: AppNotification = {
      id: notifId,
      userId: currentUser.id,
      title: 'Deposit Successful!',
      message: `₹${amount.toLocaleString()} credited to your wallet via ${provider}.`,
      type: 'WALLET',
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'ledger', txId), newTx);
      await setDoc(doc(db, 'wallets', currentUser.id), updatedWallet);
      await setDoc(doc(db, 'notifications', notifId), notif);
    } catch (err) {
      console.warn('Firestore deposit sync:', err);
    }

    return { success: true, message: `₹${amount} added successfully to your wallet.` };
  };

  // Request withdrawal
  const requestWithdrawal = async (
    amount: number,
    method: 'UPI' | 'BANK_TRANSFER' | 'PAYTM',
    accountDetails: string
  ): Promise<{ success: boolean; message: string }> => {
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
    const wdrId = `wdr-${Date.now()}`;

    const newReq: WithdrawalRequest = {
      id: wdrId,
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

    const updatedWallet: UserWallet = {
      ...wallet,
      availableBalance: wallet.availableBalance - amount,
      pendingBalance: wallet.pendingBalance + amount,
    };

    setWallet(updatedWallet);
    setWithdrawals(prev => [newReq, ...prev]);

    const notifId = `notif-${Date.now()}`;
    const notif: AppNotification = {
      id: notifId,
      userId: currentUser.id,
      title: 'Withdrawal Queued',
      message: `Withdrawal of ₹${amount} via ${method} submitted for verification.`,
      type: 'WALLET',
      read: false,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);

    try {
      await setDoc(doc(db, 'withdrawals', wdrId), newReq);
      await setDoc(doc(db, 'wallets', currentUser.id), updatedWallet);
      await setDoc(doc(db, 'notifications', notifId), notif);
    } catch (err) {
      console.warn('Firestore withdrawal sync:', err);
    }

    return { success: true, message: 'Withdrawal request submitted for compliance verification.' };
  };

  // Admin approves withdrawal
  const adminApproveWithdrawal = async (id: string, adminNote?: string) => {
    const req = withdrawals.find(w => w.id === id);
    if (!req || req.status !== 'PENDING') return;

    const updatedWdr: WithdrawalRequest = {
      ...req,
      status: 'PAID',
      processingDate: new Date().toISOString(),
      adminNote: adminNote || 'Approved and settled via automated payout pipe.',
    };

    setWithdrawals(prev => prev.map(w => (w.id === id ? updatedWdr : w)));

    const txId = `tx-${Date.now()}`;
    const newTx: WalletLedgerItem = {
      id: txId,
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

    const updatedWallet: UserWallet = {
      ...wallet,
      pendingBalance: Math.max(0, wallet.pendingBalance - req.amount),
      totalWithdrawn: wallet.totalWithdrawn + req.amount,
    };

    setWallet(updatedWallet);
    setLedger(prev => [newTx, ...prev]);

    try {
      await updateDoc(doc(db, 'withdrawals', id), {
        status: 'PAID',
        processingDate: updatedWdr.processingDate,
        adminNote: updatedWdr.adminNote,
      });
      await setDoc(doc(db, 'ledger', txId), newTx);
      await setDoc(doc(db, 'wallets', req.userId), updatedWallet);
    } catch (err) {
      console.warn('Firestore adminApproveWithdrawal sync:', err);
    }
  };

  // Admin rejects withdrawal
  const adminRejectWithdrawal = async (id: string, reason: string) => {
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

    const updatedWallet: UserWallet = {
      ...wallet,
      availableBalance: wallet.availableBalance + req.amount,
      pendingBalance: Math.max(0, wallet.pendingBalance - req.amount),
    };
    setWallet(updatedWallet);

    const txId = `tx-${Date.now()}`;
    const refundTx: WalletLedgerItem = {
      id: txId,
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

    try {
      await updateDoc(doc(db, 'withdrawals', id), {
        status: 'REJECTED',
        processingDate: new Date().toISOString(),
        adminNote: reason,
      });
      await setDoc(doc(db, 'wallets', req.userId), updatedWallet);
      await setDoc(doc(db, 'ledger', txId), refundTx);
    } catch (err) {
      console.warn('Firestore adminRejectWithdrawal sync:', err);
    }
  };

  // Submit match result
  const submitMatchResult = async (data: {
    matchId: string;
    tournamentId: string;
    placement: number;
    kills: number;
    evidenceUrl?: string;
  }): Promise<{ success: boolean; message: string }> => {
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

    const resId = `res-${Date.now()}`;
    const newResult: MatchResult = {
      id: resId,
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

    try {
      await setDoc(doc(db, 'results', resId), newResult);
    } catch (err) {
      console.warn('Firestore submitMatchResult sync:', err);
    }

    return {
      success: true,
      message: `Result submitted (${totalScore} calculated points). Awaiting admin verification.`,
    };
  };

  // Admin verify result
  const adminVerifyResult = async (resultId: string, verified: boolean, adminNote?: string) => {
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
    }

    try {
      await updateDoc(doc(db, 'results', resultId), {
        status: newStatus,
        verifiedAt: new Date().toISOString(),
        adminNote: adminNote || (verified ? 'Verified with lobby telemetry.' : 'Rejected.'),
      });
    } catch (err) {
      console.warn('Firestore adminVerifyResult sync:', err);
    }
  };

  // Admin create tournament
  const adminCreateTournament = async (tournamentData: Omit<Tournament, 'id' | 'slug' | 'joinedSlots' | 'createdAt'>) => {
    const slug = tournamentData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tournId = `tourn-${Date.now()}`;
    const newTournament: Tournament = {
      ...tournamentData,
      id: tournId,
      slug,
      joinedSlots: 0,
      createdAt: new Date().toISOString(),
    };

    setTournaments(prev => [newTournament, ...prev]);

    try {
      await setDoc(doc(db, 'tournaments', tournId), newTournament);
    } catch (err) {
      console.warn('Firestore adminCreateTournament sync:', err);
    }
  };

  // Admin update tournament status
  const adminUpdateTournamentStatus = async (id: string, status: TournamentStatus) => {
    setTournaments(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
    try {
      await updateDoc(doc(db, 'tournaments', id), { status });
    } catch (err) {
      console.warn('Firestore adminUpdateTournamentStatus sync:', err);
    }
  };

  // Admin update match credentials
  const adminUpdateMatchCredentials = async (matchId: string, roomId: string, password: string, releaseNow: boolean) => {
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

    try {
      await updateDoc(doc(db, 'matches', matchId), {
        roomId,
        password,
        credentialsReleased: releaseNow,
        status: releaseNow ? 'LIVE' : 'SCHEDULED',
      });
    } catch (err) {
      console.warn('Firestore adminUpdateMatchCredentials sync:', err);
    }
  };

  // Create team
  const createTeam = async (name: string, tag: string): Promise<Team> => {
    const teamId = `team-${Date.now()}`;
    const newTeam: Team = {
      id: teamId,
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
    setCurrentUser(prev => ({ ...prev, teamId }));

    try {
      await setDoc(doc(db, 'teams', teamId), newTeam);
      await updateDoc(doc(db, 'users', currentUser.id), { teamId });
    } catch (err) {
      console.warn('Firestore createTeam sync:', err);
    }

    return newTeam;
  };

  // Support ticket
  const createSupportTicket = async (category: SupportTicket['category'], subject: string, message: string) => {
    const ticketId = `ticket-${Date.now()}`;
    const newTicket: SupportTicket = {
      id: ticketId,
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

    try {
      await setDoc(doc(db, 'tickets', ticketId), newTicket);
    } catch (err) {
      console.warn('Firestore createSupportTicket sync:', err);
    }
  };

  const replySupportTicket = async (ticketId: string, message: string, isAdmin = false) => {
    const t = tickets.find(ticket => ticket.id === ticketId);
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: isAdmin ? ('ADMIN' as const) : ('USER' as const),
      senderName: isAdmin ? 'Support Officer' : currentUser.username,
      message,
      timestamp: new Date().toISOString(),
    };

    setTickets(prev =>
      prev.map(item => {
        if (item.id === ticketId) {
          return {
            ...item,
            status: isAdmin ? 'WAITING_USER' : 'IN_PROGRESS',
            updatedAt: new Date().toISOString(),
            messages: [...item.messages, newMessage],
          };
        }
        return item;
      })
    );

    try {
      if (t) {
        await updateDoc(doc(db, 'tickets', ticketId), {
          status: isAdmin ? 'WAITING_USER' : 'IN_PROGRESS',
          updatedAt: new Date().toISOString(),
          messages: [...t.messages, newMessage],
        });
      }
    } catch (err) {
      console.warn('Firestore replySupportTicket sync:', err);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      console.warn('Firestore markNotificationAsRead sync:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    try {
      await updateDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (err) {
      console.warn('Firestore updateSettings sync:', err);
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchUserRole,
        allUsers,
        firebaseUser,
        isFirebaseLoading,
        signInWithGoogle,
        signOutUser,
        isFirebaseConnected,
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
