import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Clock, ArrowUp, CheckCircle2, ShieldCheck, Flame, Radio } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import Badge from '../ui/Badge';

export default function HeroAuctionPreview() {
  const { format, currencyCode, isPoints, formatAmount, formatCompact } = useTournament();
  const [currentBid, setCurrentBid] = useState(850000);
  const [holdingTeam, setHoldingTeam] = useState('Colombo Kings');
  const [stage, setStage] = useState('GOING_TWICE'); // 'BIDDING', 'GOING_ONCE', 'GOING_TWICE', 'SOLD'
  const [timer, setTimer] = useState(6);
  const [soldAnimation, setSoldAnimation] = useState(false);

  // Teams in the demo auction
  const teams = [
    { name: 'Colombo Kings', short: 'CK', budget: formatCompact(3450000), color: '#1E40AF', active: holdingTeam === 'Colombo Kings' },
    { name: 'Kandy Warriors', short: 'KW', budget: formatCompact(2900000), color: '#B91C1C', active: holdingTeam === 'Kandy Warriors' },
    { name: 'Galle Titans', short: 'GT', budget: formatCompact(4200000), color: '#047857', active: holdingTeam === 'Galle Titans' }
  ];

  // Auto-cycle simulation to keep the hero preview dynamic and engaging
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) return prev - 1;

        // Transition stages
        if (stage === 'BIDDING') {
          setStage('GOING_ONCE');
          return 5;
        } else if (stage === 'GOING_ONCE') {
          setStage('GOING_TWICE');
          return 4;
        } else if (stage === 'GOING_TWICE') {
          setStage('SOLD');
          setSoldAnimation(true);
          return 0;
        } else {
          // Reset cycle after 4 seconds of showing SOLD
          setStage('BIDDING');
          setSoldAnimation(false);
          setCurrentBid(850000);
          setHoldingTeam('Colombo Kings');
          return 8;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  // Handle a manual user click on demo bid
  const triggerUserBid = (increment) => {
    setCurrentBid((prev) => prev + increment);
    setHoldingTeam('Kandy Warriors');
    setStage('BIDDING');
    setSoldAnimation(false);
    setTimer(10);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
      {/* Subtle ambient backdrop aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/10 to-emerald-500/10 rounded-3xl blur-xl opacity-70 pointer-events-none" />

      {/* Main Glassmorphic Auction Window */}
      <div className="relative rounded-2xl bg-crick-card/95 border border-crick-border shadow-hero-auction overflow-hidden backdrop-blur-xl">
        {/* Top Terminal Status Header */}
        <div className="px-5 py-3.5 bg-crick-navy/90 border-b border-crick-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-wider text-slate-200">
              LIVE AUCTION ROOM • LOT #18
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="live" size="sm" dot>
              {stage === 'SOLD' ? 'LOT CLOSED' : 'ACTIVE LOT'}
            </Badge>
          </div>
        </div>

        {/* Player & Bidding Showcase Area */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Top Row: Player Info & High-Impact Visual */}
          <div className="flex items-start gap-4">
            <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-slate-900 border border-crick-border shrink-0 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=300&auto=format&fit=crop&q=80"
                alt="Pathum Nissanka"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2 text-center">
                <span className="text-[10px] font-mono font-bold text-amber-400">
                  ICON PLAYER
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-emerald-400">
                  #18
                </span>
                <span className="text-xs text-crick-textMuted font-medium">
                  Top Order Batsman
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white truncate">
                Pathum Nissanka
              </h3>

              <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                <span>Right Hand Bat</span>
                <span>•</span>
                <span>Right-Arm Spin</span>
              </div>

              {/* Cricket Stats Pill */}
              <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-crick-border/80 text-center font-mono">
                <div className="p-1 rounded-lg bg-crick-surface border border-crick-border/60">
                  <span className="text-[9px] text-crick-textMuted block">MATCHES</span>
                  <span className="text-xs font-bold text-white">48</span>
                </div>
                <div className="p-1 rounded-lg bg-crick-surface border border-crick-border/60">
                  <span className="text-[9px] text-crick-textMuted block">RUNS</span>
                  <span className="text-xs font-bold text-white">1,540</span>
                </div>
                <div className="p-1 rounded-lg bg-crick-surface border border-crick-border/60">
                  <span className="text-[9px] text-crick-textMuted block">STRIKE RATE</span>
                  <span className="text-xs font-bold text-emerald-400">138.4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Callout: Live Highest Bid & Countdown Clock */}
          <div className="relative rounded-xl p-4 bg-gradient-to-b from-crick-surface to-crick-navy border border-crick-border/80 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                CURRENT HIGHEST BID
              </span>
              <motion.div
                key={currentBid}
                initial={{ scale: 0.95, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-mono text-3xl sm:text-4xl font-black text-white tracking-tight mt-0.5"
              >
                {formatAmount(currentBid)}
              </motion.div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-300">
                <span>Held by:</span>
                <strong className="text-emerald-400">{holdingTeam}</strong>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="text-center shrink-0">
              <div className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center transition-colors ${
                timer <= 3
                  ? 'border-red-500 bg-red-500/10 text-red-400 animate-pulse'
                  : 'border-emerald-500/60 bg-emerald-500/5 text-white'
              }`}>
                <Clock className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                <span className="font-mono text-xs font-black">
                  00:{timer < 10 ? `0${timer}` : timer}
                </span>
              </div>
              <span className="text-[9px] font-mono text-slate-500 mt-1 block">
                HAMMER CLOCK
              </span>
            </div>

            {/* Dramatic Animated SOLD Stamp Overlay */}
            <AnimatePresence>
              {soldAnimation && (
                <motion.div
                  initial={{ scale: 2.2, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: -8 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl"
                >
                  <div className="border-4 border-emerald-400 text-emerald-400 font-mono font-black text-2xl sm:text-3xl px-6 py-2 rounded-xl tracking-widest shadow-glow-emerald uppercase text-center">
                    SOLD!
                    <span className="block text-xs font-sans font-bold tracking-normal text-white mt-0.5">
                      To {holdingTeam} • {formatAmount(currentBid)}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Competing Teams & Remaining Purses */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                Franchise Purse Standing ({currencyCode})
              </span>
              <span className="text-[10px] font-mono">Min Increment: +{formatAmount(50000)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {teams.map((t) => (
                <div
                  key={t.name}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    t.active
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-sm ring-1 ring-emerald-500/20'
                      : 'bg-crick-surface/80 border-crick-border text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="font-bold truncate text-[11px]">{t.short}</span>
                  </div>
                  <div className="font-mono text-[11px] font-bold text-slate-200">
                    {t.budget}
                  </div>
                  <span className="text-[9px] text-slate-500 block truncate">
                    {t.active ? 'Highest Bidder' : 'In Pool'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Bidding Triggers (Allows visitor to experience live action) */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => triggerUserBid(50000)}
              className="flex-1 py-2 px-3 rounded-xl bg-crick-surface hover:bg-crick-border text-xs font-bold text-slate-200 border border-crick-border flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bid +{formatAmount(50000)}</span>
            </button>
            <button
              onClick={() => triggerUserBid(100000)}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-xs font-bold text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bid +{formatAmount(100000)}</span>
            </button>
          </div>
        </div>

        {/* Bottom Gavel Feed Footer */}
        <div className="px-5 py-3 bg-crick-navy/90 border-t border-crick-border flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Gavel className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auctioneer: Master Podium Gavel</span>
          </div>
          <span className="text-emerald-400 font-bold">
            {stage === 'GOING_TWICE' ? 'Going Twice...' : stage === 'GOING_ONCE' ? 'Going Once...' : stage === 'SOLD' ? 'Hammer Fall: Sold' : 'Open for Bids'}
          </span>
        </div>
      </div>
    </div>
  );
}
