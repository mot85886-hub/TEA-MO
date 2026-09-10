'use client';

import React from 'react';
import { TournamentProvider, useTournament } from '@/lib/store';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

// Public views
import Hero from '@/components/public/Hero';
import UpcomingTournaments from '@/components/public/UpcomingTournaments';
import TournamentDetailsView from '@/components/public/TournamentDetailsView';
import LeaderboardView from '@/components/public/LeaderboardView';
import WinnersView from '@/components/public/WinnersView';
import RulesView from '@/components/public/RulesView';
import FaqView from '@/components/public/FaqView';

// User views
import UserDashboard from '@/components/user/UserDashboard';
import MatchRoomView from '@/components/user/MatchRoomView';
import WalletView from '@/components/user/WalletView';
import TeamSystemView from '@/components/user/TeamSystemView';
import UserProfileView from '@/components/user/UserProfileView';
import SupportTicketsView from '@/components/user/SupportTicketsView';

// Admin console
import AdminDashboard from '@/components/admin/AdminDashboard';

// Modals
import JoinTournamentModal from '@/components/modals/JoinTournamentModal';
import AuthModal from '@/components/modals/AuthModal';

function AppContent() {
  const {
    activeView,
    activeTab,
    isJoinModalOpen,
    setIsJoinModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    tournaments,
    selectedTournamentId,
    settings,
  } = useTournament();

  const currentTournament = tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];

  // If Admin View is active, show the master operations suite
  if (activeView === 'admin') {
    return (
      <div className="min-h-screen bg-[#06080D]">
        <AdminDashboard />
        {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080A0F] text-[#E2E8F0]">
      {/* Top Navbar */}
      <Navbar />

      {/* Maintenance alert banner if enabled */}
      {settings.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-gaming font-bold uppercase tracking-wider">
          ⚠️ Maintenance Mode Active — Custom room queues and withdrawal processing may be delayed.
        </div>
      )}

      {/* Main Content Router */}
      <main className="flex-1 pb-20 md:pb-10">
        {/* PUBLIC VIEWS */}
        {activeView === 'public' && (
          <>
            {activeTab === 'home' && (
              <>
                <Hero />
                <UpcomingTournaments />
                <LeaderboardView />
              </>
            )}

            {activeTab === 'tournaments' && <UpcomingTournaments />}
            {(activeTab === 'tournament-details' || activeTab === 'tournament-detail') && <TournamentDetailsView />}
            {activeTab === 'leaderboard' && <LeaderboardView />}
            {activeTab === 'winners' && <WinnersView />}
            {activeTab === 'rules' && <RulesView />}
            {activeTab === 'faq' && <FaqView />}
          </>
        )}

        {/* USER / PLAYER VIEWS */}
        {activeView === 'user' && (
          <>
            {activeTab === 'dashboard' && <UserDashboard />}
            {activeTab === 'tournaments' && <UpcomingTournaments />}
            {(activeTab === 'tournament-details' || activeTab === 'tournament-detail') && <TournamentDetailsView />}
            {activeTab === 'match-room' && <MatchRoomView />}
            {activeTab === 'wallet' && <WalletView />}
            {activeTab === 'team' && <TeamSystemView />}
            {activeTab === 'profile' && <UserProfileView />}
            {activeTab === 'support' && <SupportTicketsView />}
            {activeTab === 'leaderboard' && <LeaderboardView />}
            {activeTab === 'rules' && <RulesView />}
            {activeTab === 'faq' && <FaqView />}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {isJoinModalOpen && currentTournament && (
        <JoinTournamentModal
          tournament={currentTournament}
          onClose={() => setIsJoinModalOpen(false)}
        />
      )}
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <TournamentProvider>
      <AppContent />
    </TournamentProvider>
  );
}
