import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, CheckCircle2, XCircle, ArrowUp, RefreshCw, Radio, Sparkles, Coins, Users } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function InteractiveAuctionDemo() {
  const players = [
    {
      id: 'p1',
      name: 'Wanindu Hasaranga',
      lot: '17',
      role: 'Spin Bowling All-Rounder',
      category: 'ICON',
      basePrice: 150000,
      photo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=200&auto=format&fit=crop&q=80',
      stats: '44 Mat • 78 Wkts • 142.1 SR'
    },
    {
      id: 'p2',
      name: 'Pathum Nissanka',
      lot: '18',
      role: 'Top Order Batsman',
      category: 'ICON',
      basePrice: 100000,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      stats: '48 Mat • 1,540 Runs • 138.4 SR'
    },
    {
      id: 'p3',
      name: 'Matheesha Pathirana',
      lot: '19',
      role: 'Fast Bowler (150 kph)',
      category: 'PLATINUM',
      basePrice: 120000,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      stats: '32 Mat • 52 Wkts • 7.4 Econ'
    }
  ];

  const initialTeams = [
    { id: 'ck', name: 'Colombo Kings', budget: 3450000, color: '#1E40AF' },
    { id: 'kw', name: 'Kandy Warriors', budget: 2900000, color: '#B91C1C' },
    { id: 'gt', name: 'Galle Titans', budget: 4200000, color: '#047857' },
    { id: 'js', name: 'Jaffna Stallions', budget: 5100000, color: '#6D28D9' }
  ];

  const [selectedPlayer, setSelectedPlayer] = useState(players[0]);
  const [currentBid, setCurrentBid] = useState(players[0].basePrice);
  const [highestBidder, setHighestBidder] = useState(initialTeams[0]);
  const [teams, setTeams] = useState(initialTeams);
  const [hammerStatus, setHammerStatus] = useState('OPEN'); // 'OPEN', 'GOING_ONCE', 'GOING_TWICE', 'SOLD', 'UNSOLD'
  const [bidsLog, setBidsLog] = useState([
    { id: 'b0', team: 'Colombo Kings', amount: players[0].basePrice, time: 'Opening Base' }
  ]);

  const placeBid = (team, increment) => {
    if (hammerStatus === 'SOLD') return;
    const newAmount = currentBid + increment;
    setCurrentBid(newAmount);
    setHighestBidder(team);
    setHammerStatus('OPEN');

    setBidsLog(prev => [
      { id: `bid_${Date.now()}`, team: team.name, amount: newAmount, time: 'Just now' },
      ...prev.slice(0, 5)
    ]);
  };

  const finalizeSale = () => {
    setHammerStatus('SOLD');
    setTeams(prev =>
      prev.map(t =>
        t.id === highestBidder.id ? { ...t, budget: Math.max(0, t.budget - currentBid) } : t
      )
    );
  };

  const resetLot = (player) => {
    setSelectedPlayer(player);
    setCurrentBid(player.basePrice);
    setHighestBidder(initialTeams[0]);
    setHammerStatus('OPEN');
    setBidsLog([{ id: `b0`, team: initialTeams[0].name, amount: player.basePrice, time: 'Opening Base' }]);
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-crick-card border border-crick-border shadow-2xl relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-crick-border/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Interactive Bidding Sandbox
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Test the Auction Engine Live
          </h3>
          <p className="text-xs text-crick-textMuted mt-0.5">
            Demonstration mode: Tap bid buttons to test atomic purse validation and hammer calls.
          </p>
        </div>

        {/* Player Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-crick-surface border border-crick-border">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => resetLot(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPlayer.id === p.id
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lot #{p.lot}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Player Profile Left, Gavel Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Player Profile & Live Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-crick-surface border border-crick-border">
            <img
              src={selectedPlayer.photo}
              alt={selectedPlayer.name}
              className="w-20 h-24 rounded-xl object-cover object-top border border-crick-border shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Badge variant="amber" size="sm">
                LOT #{selectedPlayer.lot} • {selectedPlayer.category}
              </Badge>
              <h4 className="text-lg font-black text-white truncate mt-1">
                {selectedPlayer.name}
              </h4>
              <p className="text-xs text-emerald-400 font-semibold">
                {selectedPlayer.role}
              </p>
              <p className="text-[11px] font-mono text-slate-400 mt-1">
                {selectedPlayer.stats}
              </p>
              <div className="text-xs font-mono text-slate-300 mt-2">
                Base Price: <strong>LKR {selectedPlayer.basePrice.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Current Highest Bid Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-crick-navy to-crick-surface border border-emerald-500/30 text-center relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              CURRENT HIGHEST BID
            </span>

            <motion.div
              key={currentBid}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight my-1"
            >
              LKR {currentBid.toLocaleString()}
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crick-surface border border-crick-border text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: highestBidder.color }} />
              <span>Held by: <strong className="text-white">{highestBidder.name}</strong></span>
            </div>

            {/* Hammer Stage Banner */}
            <div className="mt-3">
              {hammerStatus === 'OPEN' && (
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  ● Bidding Open
                </span>
              )}
              {hammerStatus === 'GOING_ONCE' && (
                <span className="text-xs font-mono font-bold text-amber-400 animate-pulse">
                  🔨 Going Once at LKR {currentBid.toLocaleString()}!
                </span>
              )}
              {hammerStatus === 'GOING_TWICE' && (
                <span className="text-xs font-mono font-bold text-red-400 animate-pulse">
                  🔨 Going Twice... Any further bids?
                </span>
              )}
              {hammerStatus === 'SOLD' && (
                <motion.div
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-block py-1 px-4 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-sm tracking-wider uppercase shadow-glow-emerald"
                >
                  SOLD to {highestBidder.name}!
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Competing Bidders & Master Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Simulate Bids from Franchises:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teams.map((t) => (
              <div
                key={t.id}
                className="p-3.5 rounded-2xl bg-crick-surface border border-crick-border space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                    <strong className="text-white">{t.name}</strong>
                  </div>
                  <span className="font-mono text-slate-400 text-[11px]">
                    Rem: LKR {(t.budget / 1000000).toFixed(2)}M
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={hammerStatus === 'SOLD'}
                    onClick={() => placeBid(t, 25000)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-crick-navy hover:bg-crick-card disabled:opacity-40 text-[11px] font-bold text-slate-200 border border-crick-border flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                    +25K
                  </button>
                  <button
                    disabled={hammerStatus === 'SOLD'}
                    onClick={() => placeBid(t, 50000)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 disabled:opacity-40 text-[11px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                    +50K
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Gavel Hammer Control Strip */}
          <div className="p-4 rounded-2xl bg-crick-navy border border-crick-border flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <Gavel className="w-4 h-4 text-emerald-400" />
              <span>Auctioneer Podium Controls:</span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="xs"
                disabled={hammerStatus === 'SOLD'}
                onClick={() => setHammerStatus('GOING_ONCE')}
              >
                Going Once
              </Button>
              <Button
                variant="amber"
                size="xs"
                disabled={hammerStatus === 'SOLD'}
                onClick={() => setHammerStatus('GOING_TWICE')}
              >
                Going Twice
              </Button>
              <Button
                variant="primary"
                size="xs"
                icon={CheckCircle2}
                disabled={hammerStatus === 'SOLD'}
                onClick={finalizeSale}
              >
                Sell Player
              </Button>
              <Button
                variant="ghost"
                size="xs"
                icon={RefreshCw}
                onClick={() => resetLot(selectedPlayer)}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
