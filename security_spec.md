# Security Specification: Free Fire Tournament Platform

## 1. Data Invariants
1. **Financial Immutability**: Wallet ledger records (`/ledger/{ledgerId}`) and audit logs (`/auditLogs/{logId}`) cannot be updated or deleted once created.
2. **Identity Integrity**: Normal users cannot self-escalate their role to `ADMIN` or `SUPER_ADMIN`.
3. **Owner Isolation**: Users can only read and query their own private registrations, tickets, notifications, wallets, and withdrawal requests.
4. **Slot Monotonicity**: Non-admins can only atomically increment `joinedSlots` on a tournament during tournament registration.
5. **Anti-Spoofing & Verified Email**: Admin privileges require `request.auth.token.email_verified == true` if matching the bootstrapped administrator email.
6. **Path Integrity**: All document IDs must adhere to `isValidId()` (size <= 128, non-empty, matching `^[a-zA-Z0-9_\-]+$`).

## 2. The Dirty Dozen Payloads (Designed to be REJECTED with PERMISSION_DENIED)
1. **Unauthenticated Tournament Mutation**: `POST /tournaments/tourn-999` without auth header.
2. **Ghost Role Escalation**: `POST /users/attacker-uid` with `{ role: "SUPER_ADMIN" }` by unverified user.
3. **Wallet Balance Injection**: `PATCH /wallets/victim-uid` with `{ availableBalance: 999999 }` by non-admin.
4. **Impersonated Registration**: `POST /registrations/reg-hack` with `{ userId: "victim-uid" }` by `attacker-uid`.
5. **Ledger Record Tampering**: `PATCH /ledger/tx-123` with `{ amount: 0 }`.
6. **Malicious Match Score Tampering**: `PATCH /results/res-123` to alter status to `VERIFIED` by player.
7. **Cross-User Withdrawal Request**: `POST /withdrawals/w-hack` with `{ userId: "victim-uid" }`.
8. **ID Poisoning Attack**: `POST /tournaments/<100KB-junk-chars>` attempting DoS.
9. **Blanket Query Scraping**: `GET /registrations` without filtering by own `userId`.
10. **Spoofed Admin Email without Verification**: Token `{ email: "mot85886@gmail.com", email_verified: false }` attempting admin operations.
11. **Negative Entry Fee**: `POST /tournaments/tourn-exploit` with `{ entryFee: -500 }`.
12. **Foreign Ticket Snooping**: `GET /tickets/userA-ticket` by `userB`.
