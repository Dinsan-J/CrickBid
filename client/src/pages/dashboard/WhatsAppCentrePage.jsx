import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Send,
  CheckCheck,
  AlertCircle,
  Phone,
  Coins,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';

export default function WhatsAppCentrePage() {
  const [selectedTemplate, setSelectedTemplate] = useState('PLAYER_SOLD');

  const stats = [
    { label: 'Total Dispatched', value: '1,894', subtext: 'Meta Cloud API v19+', color: 'lime' },
    { label: 'Delivery Rate', value: '99.4%', subtext: '1,882 Delivered to Handset', color: 'blue' },
    { label: 'Player Opt-In Rate', value: '100%', subtext: 'Recorded digital consent', color: 'purple' },
    { label: 'Platform Absorbed Cost', value: 'LKR 0', subtext: 'Paid 100% by CrickBid Platform', color: 'amber' }
  ];

  const notificationLogs = [
    {
      id: 'wa_01',
      phone: '+94 77 987 6543',
      player: 'Wanindu Hasaranga',
      event: 'PLAYER_SOLD',
      message: 'Sold to Kandy Warriors for LKR 1,200,000.',
      status: 'READ',
      time: '6 mins ago',
      cost: 'Paid by Platform'
    },
    {
      id: 'wa_02',
      phone: '+94 71 456 7890',
      player: 'Dushmantha Chameera',
      event: 'PLAYER_SOLD',
      message: 'Sold to Galle Titans for LKR 650,000.',
      status: 'DELIVERED',
      time: '14 mins ago',
      cost: 'Paid by Platform'
    },
    {
      id: 'wa_03',
      phone: '+94 77 123 4567',
      player: 'Pathum Nissanka',
      event: 'UNDER_THE_HAMMER',
      message: 'You are now under the hammer (Lot #18).',
      status: 'READ',
      time: '20 mins ago',
      cost: 'Paid by Platform'
    },
    {
      id: 'wa_04',
      phone: '+94 75 333 9999',
      player: 'Charith Asalanka',
      event: 'PLAYER_SOLD',
      message: 'Sold to Jaffna Stallions for LKR 750,000.',
      status: 'READ',
      time: '32 mins ago',
      cost: 'Paid by Platform'
    }
  ];

  const columns = [
    {
      header: 'Recipient Phone',
      accessor: (row) => (
        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
          {row.phone}
        </span>
      )
    },
    {
      header: 'Player Name',
      accessor: (row) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {row.player}
        </span>
      )
    },
    {
      header: 'Template / Action',
      accessor: (row) => (
        <Badge variant={row.event === 'PLAYER_SOLD' ? 'lime' : 'amber'} size="sm">
          {row.event.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      header: 'Notification Body',
      accessor: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-xs block">
          {row.message}
        </span>
      )
    },
    {
      header: 'Delivery Status',
      accessor: (row) => (
        <Badge
          variant={row.status === 'READ' ? 'success' : 'blue'}
          size="sm"
        >
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Cost to Organiser',
      accessor: (row) => (
        <span className="text-xs text-emerald-600 dark:text-crick-lime font-bold">
          {row.cost}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              WhatsApp Centre
            </h1>
            <Badge variant="lime" size="sm">
              Central Number (+94)
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Centralized platform-owned WhatsApp Business dispatch engine with PDPA consent protection
          </p>
        </div>
      </div>

      {/* WhatsApp Platform Policy Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-500 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
              One Platform-Owned WhatsApp Account • Zero Messaging Cost for Organisers
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed max-w-2xl">
              All notifications are transmitted via our Meta Verified Sri Lanka Business line. The platform covers 100% of Meta conversation fees. Automatic opt-out listening is active: players replying STOP are immediately unsubscribed.
            </p>
          </div>
        </div>

        <Badge variant="lime" size="md">
          PDPA Compliant
        </Badge>
      </div>

      {/* 4 Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="space-y-2 p-5">
              <span className="text-[11px] uppercase font-bold text-slate-500 dark:text-crick-textMuted">
                {s.label}
              </span>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                {s.value}
              </div>
              <span className="text-xs text-slate-500 dark:text-crick-textMuted block pt-1 border-t border-slate-100 dark:border-crick-border/50">
                {s.subtext}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Preview & Live Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Preview Box (1 Col) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-crick-lime" />
            <span>Pre-Approved WhatsApp Template Preview</span>
          </h3>

          <Card className="p-4 space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400">Select Template:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSelectedTemplate('PLAYER_SOLD')}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedTemplate === 'PLAYER_SOLD'
                      ? 'bg-crick-lime text-crick-dark font-bold'
                      : 'bg-slate-100 dark:bg-crick-surface text-slate-300'
                  }`}
                >
                  Player Sold Alert
                </button>
                <button
                  onClick={() => setSelectedTemplate('UNDER_THE_HAMMER')}
                  className={`p-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedTemplate === 'UNDER_THE_HAMMER'
                      ? 'bg-crick-lime text-crick-dark font-bold'
                      : 'bg-slate-100 dark:bg-crick-surface text-slate-300'
                  }`}
                >
                  Under Hammer Alert
                </button>
              </div>
            </div>

            {/* Mobile WhatsApp Screen Preview */}
            <div className="rounded-2xl bg-[#0b141a] border border-[#222d34] p-4 text-slate-100 font-sans shadow-lg text-xs space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-[#222d34]">
                <div className="w-6 h-6 rounded-full bg-crick-lime flex items-center justify-center font-bold text-crick-dark text-[9px]">
                  CB
                </div>
                <div>
                  <span className="font-bold text-white block text-[11px] leading-tight">CrickBid Official</span>
                  <span className="text-[9px] text-slate-400">Verified Business Account</span>
                </div>
              </div>

              {selectedTemplate === 'PLAYER_SOLD' ? (
                <div className="bg-[#1f2c34] p-3 rounded-xl rounded-tl-none space-y-2 text-[11px] text-slate-200 leading-relaxed">
                  <p className="font-bold text-crick-lime">🏏 CRICKET AUCTION RESULT</p>
                  <p>Congratulations <strong>Pathum Nissanka</strong>!</p>
                  <p>You have been acquired by <strong>Colombo Kings</strong> in the MCA Premier League 2026 for <strong>LKR 850,000</strong>.</p>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-[#2a3942]">
                    Tournament: Mercantile Cricket Association • Reply STOP to unsubscribe.
                  </p>
                </div>
              ) : (
                <div className="bg-[#1f2c34] p-3 rounded-xl rounded-tl-none space-y-2 text-[11px] text-slate-200 leading-relaxed">
                  <p className="font-bold text-amber-400">🔨 LOT UNDER THE HAMMER</p>
                  <p>Hello <strong>Pathum Nissanka</strong>,</p>
                  <p>Your lot (<strong>Lot #18</strong>) is currently on the podium at the live auction. Tune in to the live broadcast now!</p>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-[#2a3942]">
                    Base Reserve: LKR 100,000 • Reply STOP to unsubscribe.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Live Notification Audit Log Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Real-Time WhatsApp Dispatch Stream
          </h3>

          <Table
            columns={columns}
            data={notificationLogs}
            searchField="player"
            searchPlaceholder="Search by player or phone..."
            pageSize={4}
          />
        </div>
      </div>
    </div>
  );
}
