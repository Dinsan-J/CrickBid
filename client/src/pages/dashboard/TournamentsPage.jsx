import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Plus, Calendar, Radio, Coins, Users, Tv2, MoreVertical, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function TournamentsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const tournaments = [
    {
      id: 'trn_2026_mca_a',
      name: 'MCA Premier League 2026',
      season: '2026',
      status: 'AUCTION_LIVE',
      auctionType: 'MONEY',
      currency: 'LKR',
      pursePerTeam: 'LKR 10,000,000',
      totalTeams: 6,
      registeredPlayers: 94,
      squadLimits: '11 - 15 Players (Max 2 Overseas)',
      startDate: 'Live Right Now',
      isLive: true
    },
    {
      id: 'trn_2026_colombo_club',
      name: 'Colombo Invitational T20 Cup',
      season: '2026',
      status: 'REGISTRATION_OPEN',
      auctionType: 'POINTS',
      currency: 'PTS',
      pursePerTeam: '100,000 Points',
      totalTeams: 8,
      registeredPlayers: 128,
      squadLimits: '12 - 16 Players',
      startDate: 'May 14, 2026',
      isLive: false
    },
    {
      id: 'trn_2025_school_oba',
      name: 'Ananda vs Nalanda Alumni Trophy',
      season: '2025',
      status: 'COMPLETED',
      auctionType: 'MONEY',
      currency: 'LKR',
      pursePerTeam: 'LKR 5,000,000',
      totalTeams: 4,
      registeredPlayers: 64,
      squadLimits: '11 - 14 Players',
      startDate: 'Completed',
      isLive: false
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tournaments
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Manage seasons, squad regulations, and financial purse rules
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateModalOpen(true)}
        >
          Create New Tournament
        </Button>
      </div>

      {/* Tournaments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tournaments.map((trn) => (
          <Card key={trn.id} hover glow={trn.isLive} className="flex flex-col justify-between">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant={trn.isLive ? 'live' : trn.status === 'COMPLETED' ? 'neutral' : 'lime'}
                  size="sm"
                  dot={trn.isLive}
                >
                  {trn.status.replace('_', ' ')}
                </Badge>

                <Badge variant={trn.auctionType === 'MONEY' ? 'amber' : 'purple'} size="sm">
                  {trn.auctionType === 'MONEY' ? 'Currency (LKR)' : 'Points Model'}
                </Badge>
              </div>

              <CardTitle className="pt-1">{trn.name}</CardTitle>
              <CardDescription>Season {trn.season} • {trn.startDate}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 py-3 rounded-xl bg-slate-50 dark:bg-crick-surface/60 border border-slate-100 dark:border-crick-border/60 p-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-crick-textMuted block">
                    Team Purse
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {trn.pursePerTeam}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-crick-textMuted block">
                    Franchises
                  </span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {trn.totalTeams} Teams
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Registered Pool:</span>
                  <strong className="font-mono">{trn.registeredPlayers} Players</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Squad Requirement:</span>
                  <strong className="truncate max-w-[160px] text-right">{trn.squadLimits}</strong>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2">
              {trn.isLive ? (
                <Link to="/dashboard/live-auction" className="flex-1">
                  <Button variant="primary" size="sm" icon={Radio} className="w-full">
                    Gavel Room
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard/auctions" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Setup Auction
                  </Button>
                </Link>
              )}

              <Link to="/dashboard/broadcast-studio">
                <Button variant="outline" size="sm" icon={Tv2} title="OBS Overlays" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Create Tournament Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Cricket Tournament"
        description="Configure tournament financial purse limits and squad restrictions"
      >
        <form onSubmit={(e) => { e.preventDefault(); setCreateModalOpen(false); }} className="space-y-4">
          <Input label="Tournament Name" required placeholder="e.g. Colombo Premier League" defaultValue="Mercantile Super Cup 2026" />
          
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Auction Valuation Model"
              options={[
                { value: 'MONEY', label: 'Money (Sri Lankan Rupees - LKR)' },
                { value: 'POINTS', label: 'Points Purse (Equal Points)' }
              ]}
              defaultValue="MONEY"
            />
            <Input label="Starting Purse Per Team" required defaultValue="10,000,000" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Min Players Per Team" type="number" defaultValue="11" />
            <Input label="Max Players Per Team" type="number" defaultValue="16" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Max Overseas Cap" type="number" defaultValue="2" />
            <Input label="Min Wicketkeepers" type="number" defaultValue="1" />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save & Launch Tournament
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
