import React, { useState } from 'react';
import {
  Menu,
  Search,
  Sun,
  Moon,
  Bell,
  Trophy,
  ChevronDown,
  Sparkles,
  Radio
} from 'lucide-react';
import { useAuth, ROLES, ROLE_LABELS } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import ProfileDropdown from './ProfileDropdown';
import Badge from '../ui/Badge';
import { Link } from 'react-router-dom';

export default function TopNav({ openMobile }) {
  const { user, currentRole, switchRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount, toggleDrawer } = useNotifications();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-crick-navy/90 backdrop-blur-md border-b border-slate-200 dark:border-crick-border px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Left Area: Mobile Menu + Tournament Switcher */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Trigger */}
        <button
          onClick={openMobile}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Active Tournament Selector Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-crick-surface border border-slate-200 dark:border-crick-border text-xs">
          <Trophy className="w-4 h-4 text-crick-lime" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
            {user?.activeTournament?.name || 'Select Tournament'}
          </span>
          <Badge variant="lime" size="sm">
            {user?.activeTournament?.currency || 'LKR'}
          </Badge>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1" />
        </div>

        {/* Quick Link to Live Auction Room */}
        <Link
          to="/dashboard/live-auction"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/30 text-xs font-bold transition-all shadow-sm"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
          <span>Gavel Room Live</span>
        </Link>
      </div>

      {/* Middle Area: Global Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-crick-textMuted" />
          <input
            type="text"
            placeholder="Search players, lots, teams... (Press ⌘K)"
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-crick-surface border border-transparent dark:border-crick-border focus:outline-none focus:ring-1 focus:ring-crick-lime text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-crick-textMuted"
          />
        </div>
      </div>

      {/* Right Area: Controls & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Pill (Great for demonstration & testing all 5 roles) */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-crick-surface hover:bg-slate-200 dark:hover:bg-crick-card border border-slate-200 dark:border-crick-border text-xs transition-colors"
            title="Switch testing role"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-semibold text-slate-700 dark:text-slate-200">
              Role:
            </span>
            <span className="font-bold text-crick-lime">
              {ROLE_LABELS[currentRole]}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-crick-card border border-slate-200 dark:border-crick-border shadow-xl z-50 p-2 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-crick-textMuted border-b border-slate-100 dark:border-crick-border/60">
                Switch Role View
              </div>
              <div className="mt-1 space-y-0.5">
                {Object.keys(ROLES).map((roleKey) => (
                  <button
                    key={roleKey}
                    onClick={() => {
                      switchRole(roleKey);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      currentRole === roleKey
                        ? 'bg-crick-lime/15 text-emerald-600 dark:text-crick-lime font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface'
                    }`}
                  >
                    <span>{ROLE_LABELS[roleKey]}</span>
                    {currentRole === roleKey && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle (Dark Navy / Clean White) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface border border-slate-200 dark:border-crick-border transition-colors"
          title={isDark ? 'Switch to Light Dashboard' : 'Switch to Dark Sports Mode'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <button
          onClick={toggleDrawer}
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface border border-slate-200 dark:border-crick-border transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-crick-lime text-crick-dark font-mono font-extrabold text-[10px] flex items-center justify-center shadow-glow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Pill */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
