import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, roleLabel, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-crick-surface border border-transparent hover:border-slate-200 dark:hover:border-crick-border transition-colors"
      >
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
          alt={user?.name || 'User'}
          className="w-7 h-7 rounded-lg object-cover ring-1 ring-crick-lime/40"
        />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {user?.name}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-crick-textMuted leading-none mt-0.5">
            {roleLabel}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-crick-card border border-slate-200 dark:border-crick-border shadow-2xl z-50 p-3 text-xs animate-fade-in">
          {/* Header Summary */}
          <div className="p-2 border-b border-slate-100 dark:border-crick-border/70 mb-2">
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {user?.name}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-crick-textMuted truncate">
              {user?.email}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant="lime" size="sm">
                {roleLabel}
              </Badge>
              <span className="text-[10px] text-crick-textMuted font-mono">
                {user?.organisation?.name}
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-1">
            <Link
              to="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile & Account</span>
            </Link>

            <Link
              to="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Tournament Rules & Settings</span>
            </Link>

            <Link
              to="/dashboard/payments"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span>Subscription & Credits</span>
            </Link>
          </div>

          {/* Logout Button */}
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-crick-border/70">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
