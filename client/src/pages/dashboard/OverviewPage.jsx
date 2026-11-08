import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Coins,
  MessageSquare,
  Radio,
  Tv2,
  ArrowUpRight,
  Flame,
  Gavel,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTournament } from '../../context/TournamentContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';

export default function OverviewPage() {
  const { user, roleLabel } = useAuth();
  const { format, currencyCode, isPoints, formatAmount, formatCompact } = useTournament();

  const statCards = [
    {
      title: 'Active Tournaments',
      value: '3',
      subtext: `1 Live Now (${user?.activeTournament?.name || 'MCA Premier'})`,
      icon: Trophy,
      color: 'lime',
      badge: 'Active'
    },
    {
      title: 'Registered Players',
      value: '248',
      subtext: '100% WhatsApp Consent Recorded',
      icon: Users,
      color: 'blue',
      badge: '+34 today'
    },
    {
      title: `Total Purse Spent (${currencyCode})`,
      value: formatCompact(38400000),
      subtext: `Out of ${formatCompact(60000000)} Total Purse Pool`,
      icon: Coins,
      color: 'amber',
      badge: '64% Allocated'
    },
    {
      title: 'WhatsApp Dispatches',
      value: '1,894',
      subtext: 'Central Platform Number (+94)',
      icon: MessageSquare,
      color: 'purple',
      badge: '99.4% Delivery'
    }
  ];

  const recentBids = [
    {
      id: 'bid_01',
      lot: 'Lot #18',
      player: 'Pathum Nissanka',
      category: 'ICON',
      role: 'Top Order Bat',
      team: 'Colombo Kings',
      amount: formatAmount(850000),
      time: '1 min ago',
      status: 'Current High Bid'
    },
    {
      id: 'bid_02',
      lot: 'Lot #17',
      player: 'Wanindu Hasaranga',
      category: 'ICON',
      role: 'Spin All-Rounder',
      team: 'Kandy Warriors',
      amount: formatAmount(1200000),
      time: '6 mins ago',
      status: 'Sold'
    },
    {
      id: 'bid_03',
      lot: 'Lot #16',
      player: 'Dushmantha Chameera',
      category: 'PLATINUM',
      role: 'Fast Bowler',
      team: 'Galle Titans',
      amount: formatAmount(650000),
      time: '14 mins ago',
      status: 'Sold'
    },
    {
      id: 'bid_04',
      lot: 'Lot #15',
      player: 'Charith Asalanka',
      category: 'PLATINUM',
      role: 'Middle Order Bat',
      team: 'Jaffna Stallions',
      amount: formatAmount(750000),
      time: '22 mins ago',
      status: 'Sold'
    }
  ];

  const columns = [
    {
      header: 'Lot & Player',
      accessor: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-slate-400 dark:text-crick-textMuted">
              {row.lot}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {row.player}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-crick-textMuted">
            {row.role}
          </span>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (row) => (
        <Badge variant={row.category === 'ICON' ? 'amber' : 'purple'} size="sm">
          {row.category}
        </Badge>
      )
    },
    {
      header: 'Winning Team',
      accessor: (row) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {row.team}
        </span>
      )
    },
    {
      header: 'Amount',
      accessor: (row) => (
        <span className="font-mono font-bold text-emerald-600 dark:text-crick-lime">
          {row.amount}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant={row.status === 'Current High Bid' ? 'live' : 'success'} size="sm" dot={row.status === 'Current High Bid'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Time',
      accessor: (row) => (
        <span className="text-xs text-slate-400 font-mono">
          {row.time}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Auction Overview
            </h1>
            <Badge variant="lime" size="sm">
              {roleLabel} View
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Real-time telemetry for <strong className="text-slate-800 dark:text-slate-200">{user?.activeTournament?.name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/dashboard/broadcast-studio">
            <Button variant="outline" size="sm" icon={Tv2}>
              OBS Overlays
            </Button>
          </Link>
          <Link to="/dashboard/live-auction">
            <Button variant="primary" size="sm" icon={Radio} className="shadow-glow-sm">
              Enter Live Gavel Room
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Auction Hero Banner Card */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-crick-card via-crick-navy to-emerald-950/40 border border-crick-lime/30 shadow-card-dark">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-crick-lime/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              AUCTION SESSION IN PROGRESS
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Under the Hammer: Lot #18 Pathum Nissanka
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Current highest bid <strong className="text-crick-lime font-mono">{formatAmount(850000)}</strong> held by <strong className="text-white">Colombo Kings</strong>. Hammer stage: <span className="text-amber-400 font-bold">Going Twice...</span>
            </p>

            <div className="flex items-center gap-4 pt-1 text-xs font-mono text-crick-textMuted">
              <span>Next Bid: <strong>{formatAmount(900000)}</strong></span>
              <span>•</span>
              <span>Timer: <strong className="text-red-400">00:08s</strong></span>
              <span>•</span>
              <span>Purse Remaining: <strong>{formatAmount(3450000)}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto">
            <Link to="/dashboard/live-auction" className="w-full">
              <Button variant="primary" size="lg" icon={Gavel} className="w-full shadow-glow-sm">
                Open Auctioneer Gavel
              </Button>
            </Link>
            <Link to="/dashboard/broadcast-studio" className="w-full">
              <Button variant="outline" size="md" icon={Tv2} className="w-full">
                Broadcast Stream Feed
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} hover>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-crick-surface border border-slate-200 dark:border-crick-border">
                    <Icon className="w-5 h-5 text-crick-lime" />
                  </div>
                  <Badge variant={card.color === 'lime' ? 'lime' : 'neutral'} size="sm">
                    {card.badge}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-crick-textMuted">
                    {card.title}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
                    {card.value}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-crick-textMuted truncate pt-1 border-t border-slate-100 dark:border-crick-border/50">
                  {card.subtext}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid: Recent Activity & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bids Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-crick-lime" />
              <span>Live Bidding Stream & Recent Acquisitions</span>
            </h3>
            <Link to="/dashboard/reports" className="text-xs font-semibold text-emerald-600 dark:text-crick-lime hover:underline">
              View Audit Log
            </Link>
          </div>

          <Table
            columns={columns}
            data={recentBids}
            searchField="player"
            searchPlaceholder="Filter recent bids..."
            pageSize={4}
          />
        </div>

        {/* Tournament Squad Standings Mini Roster (1 Col) */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-crick-lime" />
            <span>Franchise Purse Leaderboard</span>
          </h3>

          <Card>
            <CardContent className="p-4 space-y-4">
              {[
                { name: 'Colombo Kings', spent: 'LKR 8.4M', rem: 'LKR 1.6M', players: '11/15', pct: 84 },
                { name: 'Kandy Warriors', spent: 'LKR 7.1M', rem: 'LKR 2.9M', players: '9/15', pct: 71 },
                { name: 'Galle Titans', spent: 'LKR 6.5M', rem: 'LKR 3.5M', players: '10/15', pct: 65 },
                { name: 'Jaffna Stallions', spent: 'LKR 5.8M', rem: 'LKR 4.2M', players: '8/15', pct: 58 }
              ].map((team, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{team.name}</span>
                    <span className="font-mono text-emerald-600 dark:text-crick-lime font-bold">{team.rem} left</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-crick-surface overflow-hidden">
                    <div
                      className="h-full bg-crick-lime transition-all duration-300 rounded-full"
                      style={{ width: `${team.pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Squad: {team.players} slots</span>
                    <span>Spent: {team.spent}</span>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link to="/dashboard/teams">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Teams & Rosters
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
