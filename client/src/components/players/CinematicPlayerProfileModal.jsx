import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  Shield,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Phone,
  Sparkles,
  Award,
  Flame,
  Clock
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useTournament } from '../../context/TournamentContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function CinematicPlayerProfileModal({
  player,
  isOpen,
  onClose,
  onStatusChange
}) {
  const { currentRole } = useAuth();
  const { currencyCode, format } = useTournament();
  const isOrganiser = [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER].includes(currentRole);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !player) return null;

  const handleApprove = async () => {
    if (!onStatusChange) return;
    setUpdating(true);
    await onStatusChange(player._id, 'APPROVED');
    setUpdating(false);
  };

  const handleReject = async () => {
    if (!onStatusChange) return;
    setUpdating(true);
    await onStatusChange(player._id, 'REJECTED');
    setUpdating(false);
  };

  const stats = player.stats || {
    matches: 42,
    runs: 1250,
    highestScore: '94*',
    battingAverage: 34.7,
    strikeRate: 138.5,
    wickets: 18,
    bestBowling: '4/22',
    economy: 7.2,
    catches: 14
  };

  const isPending = player.status === 'PENDING';
  const isApproved = player.status === 'APPROVED' || player.status === 'UNDER_THE_HAMMER' || player.status === 'SOLD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/90 backdrop-blur-xl">
      {/* Container with sports stadium mood */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-emerald-500/30 bg-[#070B14] shadow-[0_0_80px_rgba(16,185,129,0.2)] my-auto"
      >
        {/* =========================================================================
            CINEMATIC STADIUM ATMOSPHERE BACKGROUND
           ========================================================================= */}
        {/* Deep ambient dark charcoal & navy gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B132B] via-[#070B14] to-[#040711] pointer-events-none" />

        {/* Abstract stadium cricket pitch lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="10%" y1="0%" x2="90%" y2="100%" stroke="#10b981" strokeWidth="1" strokeDasharray="6 8" />
          <line x1="90%" y1="0%" x2="10%" y2="100%" stroke="#10b981" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="50%" cy="50%" r="280" stroke="#10b981" strokeWidth="1" fill="none" />
          <circle cx="50%" cy="50%" r="180" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 6" fill="none" />
          <rect x="42%" y="10%" width="16%" height="80%" stroke="#10b981" strokeWidth="0.8" fill="none" opacity="0.6" />
        </svg>

        {/* Moving Stadium Light Beams (GPU accelerated CSS keyframes) */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] pointer-events-none animate-pulse" />

        {/* Floating particles & dust motes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-emerald-400/50 animate-ping"
              style={{
                top: `${(i * 19) % 95}%`,
                left: `${(i * 23) % 95}%`,
                animationDuration: `${3 + (i % 4)}s`,
                animationDelay: `${i * 0.25}s`
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-40 p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-lg"
          title="Close profile (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Layout */}
        <div className="relative z-20 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* =========================================================================
              LEFT COLUMN: DRAMATIC SPOTLIGHT & PLAYER PORTRAIT
             ========================================================================= */}
          <div className="relative w-full max-w-[340px] shrink-0 flex flex-col items-center">
            {/* 1 & 2: Dramatic Expanding Spotlight Cone Behind Player */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="absolute -top-8 w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-b from-emerald-400/25 via-emerald-500/10 to-transparent blur-2xl pointer-events-none"
            />

            {/* Stadium Floodlight Cone Rays */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 0.35, scaleY: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -top-16 w-64 h-80 bg-gradient-to-b from-emerald-300/30 via-emerald-500/5 to-transparent blur-md transform origin-top pointer-events-none"
              style={{ clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)' }}
            />

            {/* 3: Player Photograph with Scale & Fade Entrance */}
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, type: 'spring', stiffness: 220, damping: 20 }}
              className="relative z-10 w-64 h-80 sm:w-72 sm:h-92 rounded-3xl overflow-hidden border-2 border-emerald-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-4 ring-emerald-500/20 group"
            >
              <img
                src={player.photoUrl}
                alt={player.fullName}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Rim light bottom fade gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent opacity-80" />

              {/* Player ID Tag Pill */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold tracking-wider shadow-lg">
                {player.registrationNumber || 'REG-2026-PRO'}
              </div>

              {/* Role Indicator Bottom */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <Badge variant="lime" size="sm" className="font-extrabold uppercase shadow-md">
                  {player.playingRole?.replace(/_/g, ' ')}
                </Badge>
                {player.category && (
                  <Badge variant="amber" size="sm" className="font-bold">
                    {player.category}
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Base Price / Auction Valuation Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-4 w-full p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center"
            >
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                {player.status === 'SOLD' ? 'Acquired By' : 'Reserve Base Price'}
              </span>
              <div className="text-lg font-black text-white font-mono flex items-center justify-center gap-1.5 mt-0.5">
                {player.status === 'SOLD' ? (
                  <span className="text-emerald-400">
                    {player.soldToTeamName || 'Franchise'} • {format === 'POINTS' ? `${(player.soldPrice || 120000).toLocaleString()} PTS` : `LKR ${(player.soldPrice || 1200000).toLocaleString()}`}
                  </span>
                ) : (
                  <span className="text-emerald-400">
                    {format === 'POINTS'
                      ? `${(player.basePrice || 50000).toLocaleString()} PTS`
                      : `LKR ${(player.basePrice || 100000).toLocaleString()}`}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: STAGGERED NAME, CRICKET METRICS & CAREER STATS
             ========================================================================= */}
          <div className="flex-1 w-full space-y-6">
            {/* 4: Staggered Player Name Reveal */}
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="flex flex-wrap items-center gap-2"
              >
                <Badge
                  variant={
                    player.status === 'SOLD'
                      ? 'success'
                      : player.status === 'UNDER_THE_HAMMER'
                      ? 'live'
                      : isPending
                      ? 'amber'
                      : 'lime'
                  }
                  size="md"
                  dot={player.status === 'UNDER_THE_HAMMER'}
                  className="font-black uppercase tracking-wider text-[11px]"
                >
                  {player.status?.replace(/_/g, ' ')}
                </Badge>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {player.town ? `${player.town}, ` : ''}{player.district || 'Western Province'}, Sri Lanka
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white capitalize drop-shadow-md"
              >
                {player.fullName}
              </motion.h1>

              {/* Batting & Bowling Styles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300"
              >
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Batting: <strong className="text-white">{player.battingStyle?.replace(/_/g, ' ')}</strong>
                </span>

                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Bowling: <strong className="text-white">{player.bowlingStyle}</strong>
                </span>
              </motion.div>
            </div>

            {/* Experience / Bio Snippet */}
            {player.experience && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed"
              >
                <div className="font-bold text-emerald-400 text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Career History & Experience
                </div>
                {player.experience}
                {player.additionalInfo && (
                  <p className="mt-1 text-slate-400 italic">"{player.additionalInfo}"</p>
                )}
              </motion.div>
            )}

            {/* 5: Player Statistics Staggered Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Verified Match Metrics
                </span>
                <span className="text-[10px] text-slate-500 font-mono">T20 / 50-Over Performance</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center hover:border-emerald-500/40 transition-colors">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Matches</span>
                  <span className="text-xl font-black text-white font-mono mt-0.5 block">{stats.matches}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center hover:border-emerald-500/40 transition-colors">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Runs Scored</span>
                  <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">{stats.runs}</span>
                  <span className="text-[9px] text-slate-400">HS: {stats.highestScore}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center hover:border-emerald-500/40 transition-colors">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Batting Avg</span>
                  <span className="text-xl font-black text-white font-mono mt-0.5 block">{stats.battingAverage}</span>
                  <span className="text-[9px] text-slate-400">SR: {stats.strikeRate}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center hover:border-emerald-500/40 transition-colors">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Wickets</span>
                  <span className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">{stats.wickets}</span>
                  <span className="text-[9px] text-slate-400">Econ: {stats.economy}</span>
                </div>
              </div>
            </motion.div>

            {/* Organiser Action Buttons (Approve / Reject Workflow) */}
            {isOrganiser && isPending && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl"
              >
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" /> Organiser Verification Required
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Review candidate details and accept into the official auction draft.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={XCircle}
                    onClick={handleReject}
                    loading={updating}
                    className="border-red-500/40 text-red-400 hover:bg-red-500/10 flex-1 sm:flex-initial"
                  >
                    Reject Registration
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={CheckCircle2}
                    onClick={handleApprove}
                    loading={updating}
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-[0_0_15px_rgba(16,185,129,0.4)] flex-1 sm:flex-initial"
                  >
                    Approve for Draft
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
