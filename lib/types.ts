export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'TOURNAMENT_MANAGER'
  | 'FINANCE_MANAGER'
  | 'SUPPORT_AGENT'
  | 'MODERATOR'
  | 'USER';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  role: Role;
  playerUid: string;
  ign: string;
  avatar: string;
  createdAt: string;
  teamId?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  stats: {
    totalMatches: number;
    wins: number;
    winRate: number;
    totalEarnings: number;
    kills: number;
    kdRatio: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
}

export interface TeamMember {
  userId: string;
  username: string;
  ign: string;
  playerUid: string;
  role: 'CAPTAIN' | 'MEMBER';
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo: string;
  captainId: string;
  members: TeamMember[];
  matchesPlayed: number;
  wins: number;
  totalEarnings: number;
  createdAt: string;
}

export type TournamentStatus =
  | 'DRAFT'
  | 'UPCOMING'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'LIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export type GameMode = 'Solo' | 'Duo' | 'Squad';
export type GameMap = 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'NexTerra';

export interface PrizeBreakdown {
  rank: number;
  label: string;
  amount: number;
}

export interface ScoringConfig {
  placementPoints: Record<number, number>; // e.g. {1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1}
  killPoints: number; // e.g. 2
  bonusPoints: number;
  penalties: number;
  tieBreakRule: string; // e.g. "Most Kills, then Placement in Final Match"
}

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  description: string;
  banner: string;
  game: 'Free Fire' | 'Free Fire MAX';
  mode: GameMode;
  map: GameMap;
  perspective: 'TPP' | 'FPP';
  teamSize: number;
  entryFee: number;
  prizePool: number;
  prizes: PrizeBreakdown[];
  maxSlots: number;
  joinedSlots: number;
  status: TournamentStatus;
  registrationStart: string;
  registrationEnd: string;
  tournamentStart: string;
  matchCount: number;
  scoringRules: ScoringConfig;
  rules: string[];
  schedule: {
    phase: string;
    timestamp: string;
    completed: boolean;
  }[];
  createdAt: string;
}

export type MatchStatus = 'SCHEDULED' | 'WAITING_ROOM' | 'LIVE' | 'RESULTS_SUBMITTED' | 'COMPLETED';

export interface Match {
  id: string;
  tournamentId: string;
  matchNumber: number;
  map: GameMap;
  startTime: string;
  status: MatchStatus;
  roomId?: string;
  password?: string;
  credentialsReleased: boolean;
  instructions: string;
}

export interface Registration {
  id: string;
  tournamentId: string;
  userId: string;
  userName: string;
  teamId?: string;
  teamName?: string;
  ign: string;
  playerUid: string;
  slotNumber: number;
  registeredAt: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'DISQUALIFIED';
}

export type ResultStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'DISPUTED';

export interface MatchResult {
  id: string;
  matchId: string;
  tournamentId: string;
  teamId?: string;
  teamName: string;
  playerUid: string;
  placement: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  bonusPoints: number;
  penalties: number;
  totalScore: number;
  evidenceUrl?: string;
  status: ResultStatus;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  adminNote?: string;
  verifiedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamOrPlayerName: string;
  teamId?: string;
  matches: number;
  kills: number;
  placementPoints: number;
  killPoints: number;
  bonus: number;
  penalty: number;
  totalScore: number;
  prizeWon?: number;
}

export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'ENTRY_FEE'
  | 'PRIZE'
  | 'REFUND'
  | 'BONUS'
  | 'ADJUSTMENT'
  | 'REVERSAL';

export interface WalletLedgerItem {
  id: string;
  userId: string;
  amount: number;
  currency: 'INR' | 'USD';
  type: TransactionType;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REJECTED';
  reference: string;
  timestamp: string;
  balanceBefore: number;
  balanceAfter: number;
  idempotencyKey: string;
}

export interface UserWallet {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  lockedBalance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  totalWinnings: number;
}

export type WithdrawalStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'APPROVED'
  | 'PAID'
  | 'REJECTED'
  | 'FAILED'
  | 'CANCELLED';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'UPI' | 'BANK_TRANSFER' | 'PAYTM';
  accountDetails: string;
  processingFee: number;
  finalAmount: number;
  status: WithdrawalStatus;
  requestDate: string;
  processingDate?: string;
  adminNote?: string;
}

export interface DepositOrder {
  id: string;
  userId: string;
  amount: number;
  paymentId: string;
  provider: 'UPI_FAST' | 'RAZORPAY' | 'PAYTM';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  category: 'PAYMENT' | 'TOURNAMENT' | 'RESULT' | 'ACCOUNT' | 'TECHNICAL' | 'OTHER';
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_USER' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'USER' | 'ADMIN';
    senderName: string;
    message: string;
    timestamp: string;
    attachmentUrl?: string;
  }[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'TOURNAMENT' | 'MATCH' | 'WALLET' | 'SUPPORT' | 'SYSTEM';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, any>;
  ip: string;
  userAgent: string;
  timestamp: string;
}

export interface SystemSettings {
  platformFeePercent: number;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  maintenanceMode: boolean;
  antiCheatNotice: string;
  roomAutoReleaseMins: number;
}
