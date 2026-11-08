import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public & Auth Views
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Main Application Layout
import AppLayout from './components/layout/AppLayout';

// Dashboard Views
import OverviewPage from './pages/dashboard/OverviewPage';
import OrganisationsPage from './pages/dashboard/OrganisationsPage';
import TournamentsPage from './pages/dashboard/TournamentsPage';
import PlayersPage from './pages/dashboard/PlayersPage';
import TeamsPage from './pages/dashboard/TeamsPage';
import AuctionsPage from './pages/dashboard/AuctionsPage';
import LiveAuctionPage from './pages/dashboard/LiveAuctionPage';
import BroadcastStudioPage from './pages/dashboard/BroadcastStudioPage';
import WhatsAppCentrePage from './pages/dashboard/WhatsAppCentrePage';
import ReportsPage from './pages/dashboard/ReportsPage';
import PaymentsPage from './pages/dashboard/PaymentsPage';
import SettingsPage from './pages/dashboard/SettingsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Main Authenticated Dashboard Layout */}
      <Route path="/dashboard" element={<AppLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="organisations" element={<OrganisationsPage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="players" element={<PlayersPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="auctions" element={<AuctionsPage />} />
        <Route path="live-auction" element={<LiveAuctionPage />} />
        <Route path="broadcast-studio" element={<BroadcastStudioPage />} />
        <Route path="whatsapp" element={<WhatsAppCentrePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
