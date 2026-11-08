import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, Radio, ShieldAlert, Menu } from 'lucide-react';

export default function MobileNav({ openDrawer }) {
  const navTabs = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Tourneys', path: '/dashboard/tournaments', icon: Trophy },
    { label: 'Live Auction', path: '/dashboard/live-auction', icon: Radio, isLive: true },
    { label: 'Teams', path: '/dashboard/teams', icon: ShieldAlert },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-crick-navy/95 backdrop-blur-md border-t border-slate-200 dark:border-crick-border py-2 px-3 flex items-center justify-around shadow-2xl">
      {navTabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/dashboard'}
            className={({ isActive }) => `
              flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-bold transition-all
              ${isActive
                ? 'text-emerald-600 dark:text-crick-lime'
                : 'text-slate-500 dark:text-crick-textMuted hover:text-slate-900 dark:hover:text-white'
              }
              ${tab.isLive && !isActive ? 'text-red-500 dark:text-red-400' : ''}
            `}
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
                  {tab.isLive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        );
      })}

      {/* Menu / Drawer Button */}
      <button
        onClick={openDrawer}
        className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-bold text-slate-500 dark:text-crick-textMuted hover:text-slate-900 dark:hover:text-white"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span>Menu</span>
      </button>
    </div>
  );
}
