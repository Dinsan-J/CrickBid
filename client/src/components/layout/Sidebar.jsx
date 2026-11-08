import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Trophy,
  Users,
  ShieldAlert,
  Gavel,
  Radio,
  Tv2,
  MessageSquare,
  FileSpreadsheet,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import Badge from '../ui/Badge';

export default function Sidebar({ mobileOpen = false, closeMobile }) {
  const [collapsed, setCollapsed] = useState(false);
  const { currentRole, user } = useAuth();

  // Navigation Items Catalog
  const allNavItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.AUCTIONEER, ROLES.TEAM_OWNER, ROLES.BROADCAST_OPERATOR]
    },
    {
      label: 'Organisations',
      path: '/dashboard/organisations',
      icon: Building2,
      roles: [ROLES.PLATFORM_ADMIN]
    },
    {
      label: 'Tournaments',
      path: '/dashboard/tournaments',
      icon: Trophy,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.AUCTIONEER]
    },
    {
      label: 'Players',
      path: '/dashboard/players',
      icon: Users,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.AUCTIONEER]
    },
    {
      label: 'Teams',
      path: '/dashboard/teams',
      icon: ShieldAlert,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.AUCTIONEER, ROLES.TEAM_OWNER]
    },
    {
      label: 'Auctions',
      path: '/dashboard/auctions',
      icon: Gavel,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.AUCTIONEER]
    },
    {
      label: 'Live Auction',
      path: '/dashboard/live-auction',
      icon: Radio,
      badge: 'LIVE',
      isLive: true,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.AUCTIONEER, ROLES.TEAM_OWNER, ROLES.BROADCAST_OPERATOR]
    },
    {
      label: 'Broadcast Studio',
      path: '/dashboard/broadcast-studio',
      icon: Tv2,
      badge: 'OBS',
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.BROADCAST_OPERATOR]
    },
    {
      label: 'WhatsApp Centre',
      path: '/dashboard/whatsapp',
      icon: MessageSquare,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER]
    },
    {
      label: 'Reports',
      path: '/dashboard/reports',
      icon: FileSpreadsheet,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.AUCTIONEER, ROLES.TEAM_OWNER]
    },
    {
      label: 'Payments',
      path: '/dashboard/payments',
      icon: CreditCard,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER]
    },
    {
      label: 'Settings',
      path: '/dashboard/settings',
      icon: Settings,
      roles: [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER, ROLES.BROADCAST_OPERATOR]
    }
  ];

  // Filter items based on active role
  const visibleItems = allNavItems.filter(item => item.roles.includes(currentRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 flex flex-col
          bg-crick-navy text-slate-100 border-r border-crick-border
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-crick-border/70">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-crick-surface border border-crick-border flex items-center justify-center shrink-0 shadow-glow-sm">
              <span className="font-extrabold text-emerald-400 text-xl font-mono">CB</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-white text-base leading-tight">
                  Cricket<span className="text-emerald-400">Bid</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Auction Platform
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-crick-textMuted hover:text-white hover:bg-crick-surface transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Tenant Organization Pill */}
        {!collapsed && user?.organisation && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-crick-surface/80 border border-crick-border/60">
            <div className="text-[10px] uppercase font-bold text-crick-textMuted tracking-wider">
              Active Organisation
            </div>
            <div className="text-xs font-bold text-white truncate mt-0.5">
              {user.organisation.name}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Badge variant="lime" size="sm">
                {user.organisation.plan}
              </Badge>
            </div>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => closeMobile && closeMobile()}
                className={({ isActive }) => `
                  group flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150
                  ${isActive
                    ? 'bg-crick-lime text-crick-dark font-bold shadow-glow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-crick-surface'
                  }
                  ${item.isLive && !isActive ? 'border border-red-500/30 bg-red-500/5 text-red-300 hover:bg-red-500/10' : ''}
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-crick-dark' : item.isLive ? 'text-red-400' : 'text-slate-400 group-hover:text-white'
                    }`} />
                    
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <Badge
                        variant={item.isLive ? (isActive ? 'neutral' : 'live') : (isActive ? 'neutral' : 'lime')}
                        size="sm"
                        dot={item.isLive}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Live Event Banner in Footer */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-crick-surface border border-crick-lime/20 text-xs">
            <div className="flex items-center gap-2 text-crick-lime font-bold">
              <Flame className="w-4 h-4 animate-bounce text-crick-lime" />
              <span>Next Auction Event</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              MCA Premier League Auction starts in <span className="font-mono text-white font-bold">2h 14m</span>
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
