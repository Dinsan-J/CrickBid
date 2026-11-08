import React, { useState, useEffect } from 'react';
import {
  Gavel,
  Radio,
  Clock,
  Coins,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  SkipForward,
  Volume2,
  VolumeX,
  Flame,
  ArrowUp,
  AlertTriangle,
  History
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function LiveAuctionPage() {
  const { currentRole, user } = useAuth();

  // Simulated Auction State
  const [activePlayer, setActivePlayer] = useState({
    lotNumber: 18,
    name: 'Pathum Nissanka',
    photo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80',
    role: 'Top Order Batsman',
    batting: 'Right Hand Bat',
    bowling: 'Right-Arm Off Break',
    category: 'ICON',
    basePrice: 100000,
    stats: {
      matches: 48,
      runs: 1540,
      average: 38.5,
      strikeRate: 138.4,
      fifties: 11,
      hundreds: 2
    }
  });

  const [currentBid, setCurrentBid] = useState(850000);
  const [holdingTeam, setHoldingTeam] = useState({
    name: 'Colombo Kings',
    shortCode: 'CK',
    color: '#1e40af'
  });

  const [hammerStage, setHammerStage] = useState('GOING_TWICE'); // 'NONE', 'GOING_ONCE', 'GOING_TWICE', 'SOLD', 'UNSOLD'
  const [timerSeconds, setTimerSeconds] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [confirmSoldOpen, setConfirmSoldOpen] = useState(false);
  const [confirmUnsoldOpen, setConfirmUnsoldOpen] = useState(false);

  // Live Bid History Feed
  const [bidHistory, setBidHistory] = useState([
    { id: 'b1', team: 'Colombo Kings', amount: 850000, time: 'Just now' },
    { id: 'b2', team: 'Kandy Warriors', amount: 800000, time: '14s ago' },
    { id: 'b3', team: 'Colombo Kings', amount: 750000, time: '28s ago' },
    { id: 'b4', team: 'Galle Titans', amount: 700000, time: '41s ago' },
    { id: 'b5', team: 'Colombo Kings', amount: 650000, time: '55s ago' }
  ]);

  // Countdown timer simulation
  useEffect(() => {
    if (isPaused || hammerStage === 'SOLD' || hammerStage === 'UNSOLD') return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, hammerStage]);

  // Team Bidder Action
  const handlePlaceBid = (increment) => {
    const newAmount = currentBid + increment;
    setCurrentBid(newAmount);
    setTimerSeconds(15);
    setHammerStage('NONE');
    setHoldingTeam({
      name: user?.assignedTeam?.name || 'Colombo Kings',
      shortCode: user?.assignedTeam?.shortCode || 'CK',
      color: '#1e40af'
    });
    setBidHistory(prev => [
      {
        id: `bid_${Date.now()}`,
        team: user?.assignedTeam?.name || 'Colombo Kings',
        amount: newAmount,
        time: 'Just now'
      },
      ...prev
    ]);
  };

  const handleHammerCall = (stage) => {
    setHammerStage(stage);
    if (stage === 'GOING_ONCE') setTimerSeconds(10);
    if (stage === 'GOING_TWICE') setTimerSeconds(5);
  };

  const isAuctioneer = currentRole === ROLES.PLATFORM_ADMIN || currentRole === ROLES.AUCTIONEER || currentRole === ROLES.ORGANISER;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-crick-card border border-crick-border shadow-card-dark">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-500">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-crick-lime uppercase">
                PODIUM ROOM ACTIVE
              </span>
              <Badge variant="live" size="sm" dot>
                {hammerStage.replace('_', ' ')}
              </Badge>
            </div>
            <h2 className="text-base sm:text-lg font-extrabold text-white">
              MCA Premier League 2026 — Live Auction Lot #{activePlayer.lotNumber}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-crick-surface border border-crick-border text-slate-300 hover:text-white"
            title={soundEnabled ? 'Mute Auction Sounds' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-crick-lime" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {isAuctioneer && (
            <Button
              variant={isPaused ? 'primary' : 'outline'}
              size="sm"
              icon={isPaused ? Play : Pause}
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? 'Resume Clock' : 'Pause Clock'}
            </Button>
          )}
        </div>
      </div>

      {/* Main 3-Column Auction Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Player Profile Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Card glow className="overflow-hidden">
            <div className="relative h-64 bg-slate-900 overflow-hidden">
              <img
                src={activePlayer.photo}
                alt={activePlayer.name}
                className="w-full h-full object-cover object-top opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-crick-card via-transparent to-black/40" />
              
              <div className="absolute top-4 left-4">
                <Badge variant="amber" size="md">
                  LOT #{activePlayer.lotNumber} • {activePlayer.category}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-black text-white">
                  {activePlayer.name}
                </h3>
                <p className="text-xs text-crick-lime font-semibold">
                  {activePlayer.role}
                </p>
              </div>
            </div>

            <CardContent className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-crick-surface/80 border border-crick-border">
                  <span className="text-[10px] uppercase font-bold text-crick-textMuted block">BATTING</span>
                  <span className="font-bold text-white mt-0.5 block">{activePlayer.batting}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-crick-surface/80 border border-crick-border">
                  <span className="text-[10px] uppercase font-bold text-crick-textMuted block">BOWLING</span>
                  <span className="font-bold text-white mt-0.5 block">{activePlayer.bowling}</span>
                </div>
              </div>

              {/* Cricket Stats Matrix */}
              <div className="border border-crick-border rounded-xl p-3 bg-crick-surface/40">
                <div className="text-[10px] uppercase font-bold text-crick-textMuted tracking-wider mb-2">
                  T20 Career Statistics
                </div>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div>
                    <span className="text-[9px] text-crick-textMuted block">MAT</span>
                    <span className="text-sm font-bold text-white">{activePlayer.stats.matches}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-crick-textMuted block">RUNS</span>
                    <span className="text-sm font-bold text-white">{activePlayer.stats.runs}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-crick-textMuted block">AVG</span>
                    <span className="text-sm font-bold text-white">{activePlayer.stats.average}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-crick-textMuted block">SR</span>
                    <span className="text-sm font-bold text-crick-lime">{activePlayer.stats.strikeRate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-crick-border">
                <span className="text-crick-textMuted">Base Reserve Price:</span>
                <span className="font-mono font-bold text-slate-200">
                  LKR {activePlayer.basePrice.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Column: Live Bidding Stage & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="text-center p-6 border-crick-lime/30 bg-gradient-to-b from-crick-card to-crick-surface space-y-5">
            {/* Countdown Timer Ring */}
            <div className="flex items-center justify-center">
              <div className={`relative w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                timerSeconds <= 5
                  ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse'
                  : 'border-crick-lime shadow-glow-lime'
              }`}>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  CLOCK
                </span>
                <span className={`text-3xl font-black font-mono ${timerSeconds <= 5 ? 'text-red-400' : 'text-white'}`}>
                  00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                </span>
              </div>
            </div>

            {/* Current Highest Bid Display */}
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-crick-lime">
                CURRENT HIGHEST BID
              </span>
              <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tight">
                LKR {currentBid.toLocaleString()}
              </div>

              {/* Holding Team Banner */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-crick-navy border border-crick-border text-xs mt-2">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] text-white"
                  style={{ backgroundColor: holdingTeam.color }}
                >
                  {holdingTeam.shortCode}
                </div>
                <span className="text-slate-300 font-semibold">
                  Held by: <strong className="text-white">{holdingTeam.name}</strong>
                </span>
              </div>
            </div>

            {/* Hammer Stage Callout */}
            <div className="py-2">
              {hammerStage === 'GOING_ONCE' && (
                <div className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-sm uppercase tracking-wider border border-amber-500/40 animate-pulse">
                  🔨 GOING ONCE AT LKR {currentBid.toLocaleString()}!
                </div>
              )}
              {hammerStage === 'GOING_TWICE' && (
                <div className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 font-extrabold text-sm uppercase tracking-wider border border-red-500/40 animate-pulse">
                  🔨 GOING TWICE... ANY HIGHER BIDS?
                </div>
              )}
              {hammerStage === 'SOLD' && (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-crick-lime font-black text-base uppercase tracking-wider border border-emerald-500/40">
                  🎉 SOLD TO {holdingTeam.name.toUpperCase()}!
                </div>
              )}
              {hammerStage === 'NONE' && (
                <div className="text-xs text-crick-textMuted font-mono">
                  Bidding open • Minimum next increment: +LKR 50,000
                </div>
              )}
            </div>

            {/* Interactive Bidder Buttons (For Franchise Owners / Demo) */}
            <div className="p-4 rounded-2xl bg-crick-navy/90 border border-crick-border space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Quick Bid Increment</span>
                <span className="text-crick-textMuted font-mono">
                  Your Remaining Purse: <strong className="text-crick-lime">LKR 3,450,000</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={ArrowUp}
                  onClick={() => handlePlaceBid(25000)}
                >
                  +25K
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={ArrowUp}
                  onClick={() => handlePlaceBid(50000)}
                >
                  +50K
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={ArrowUp}
                  onClick={() => handlePlaceBid(100000)}
                >
                  +100K
                </Button>
              </div>
            </div>

            {/* Auctioneer Master Gavel Controls */}
            {isAuctioneer && (
              <div className="p-4 rounded-2xl bg-crick-surface/80 border border-crick-border space-y-3 text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Gavel className="w-4 h-4 text-crick-lime" />
                  <span>Auctioneer Gavel Actions</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHammerCall('GOING_ONCE')}
                  >
                    Going Once
                  </Button>
                  <Button
                    variant="amber"
                    size="sm"
                    onClick={() => handleHammerCall('GOING_TWICE')}
                  >
                    Going Twice
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    variant="primary"
                    size="md"
                    icon={CheckCircle2}
                    onClick={() => setConfirmSoldOpen(true)}
                  >
                    Sell Player
                  </Button>

                  <Button
                    variant="danger"
                    size="md"
                    icon={XCircle}
                    onClick={() => setConfirmUnsoldOpen(true)}
                  >
                    Mark Unsold
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Live Bid Stream & Franchise Purse (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="py-3 px-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-crick-lime" />
                  <span>Bid Stream</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {bidHistory.length} bids
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2 max-h-[380px] overflow-y-auto">
              {bidHistory.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-2.5 rounded-xl border transition-all text-xs ${
                    index === 0
                      ? 'bg-crick-surface border-crick-lime/40 text-white font-bold ring-1 ring-crick-lime/20'
                      : 'bg-crick-navy/60 border-crick-border text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[120px]">{item.team}</span>
                    <span className="font-mono text-crick-lime">
                      LKR {item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {item.time}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Squad & Purse Status */}
          <Card className="p-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Table Purse Standing
            </span>
            {[
              { name: 'Colombo Kings', rem: 'LKR 3.45M', slots: '11/15' },
              { name: 'Kandy Warriors', rem: 'LKR 2.90M', slots: '10/15' },
              { name: 'Galle Titans', rem: 'LKR 4.20M', slots: '9/15' },
              { name: 'Jaffna Stallions', rem: 'LKR 5.50M', slots: '8/15' }
            ].map((t, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-crick-border/50 last:border-0">
                <span className="font-semibold text-slate-300">{t.name}</span>
                <div className="text-right">
                  <span className="font-mono font-bold text-crick-lime block">{t.rem}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{t.slots}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={confirmSoldOpen}
        onClose={() => setConfirmSoldOpen(false)}
        onConfirm={() => {
          setHammerStage('SOLD');
          setConfirmSoldOpen(false);
        }}
        title="Hammer Strike: Sell Player"
        message={`Confirm sale of ${activePlayer.name} to ${holdingTeam.name} for LKR ${currentBid.toLocaleString()}? This will deduct the team purse and send instant WhatsApp alerts.`}
        confirmText="Confirm Sale (Sold)"
        variant="primary"
      />

      <ConfirmDialog
        isOpen={confirmUnsoldOpen}
        onClose={() => setConfirmUnsoldOpen(false)}
        onConfirm={() => {
          setHammerStage('UNSOLD');
          setConfirmUnsoldOpen(false);
        }}
        title="Pass Lot: Mark Player Unsold"
        message={`No bids placed or reserve not met. Mark ${activePlayer.name} as UNSOLD and move to the re-auction pool?`}
        confirmText="Mark Unsold"
        variant="danger"
      />
    </div>
  );
}
