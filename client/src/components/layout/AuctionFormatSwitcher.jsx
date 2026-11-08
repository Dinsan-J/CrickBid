import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Sparkles, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function AuctionFormatSwitcher() {
  const {
    format,
    currencyCode,
    hasStartedBidding,
    isUpdating,
    resetPrompt,
    switchFormat,
    confirmResetAndSwitch,
    cancelResetPrompt
  } = useTournament();

  const { currentRole } = useAuth();
  const isAuthorized = [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER].includes(currentRole);

  const [permissionNotice, setPermissionNotice] = useState(null);

  const handleSelect = async (targetFormat) => {
    if (format === targetFormat) return;

    if (!isAuthorized) {
      setPermissionNotice(
        `Read-only: Tournament auction format is locked to ${format} (${currencyCode}). Only Tournament Organisers or Platform Admins can modify the financial model.`
      );
      setTimeout(() => setPermissionNotice(null), 4000);
      return;
    }

    try {
      await switchFormat(targetFormat);
    } catch (err) {
      console.warn('Format switch handled:', err.message);
    }
  };

  const isPoints = format === 'POINTS';
  const isMoney = format === 'MONEY';

  return (
    <div className="relative flex items-center">
      {/* Segmented Control Container */}
      <div
        className={`relative flex items-center p-1 rounded-xl transition-all duration-300 ${
          isPoints
            ? 'bg-slate-900/90 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
            : 'bg-slate-900/90 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
        }`}
        title={
          hasStartedBidding
            ? 'Bidding has started — format is locked to protect live ledger integrity'
            : !isAuthorized
            ? 'Viewing format (Locked for current role)'
            : 'Click to configure tournament auction format'
        }
      >
        {/* POINTS Button */}
        <button
          type="button"
          onClick={() => handleSelect('POINTS')}
          disabled={isUpdating}
          className={`relative z-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-colors duration-200 ${
            isPoints
              ? 'text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isPoints && (
            <motion.div
              layoutId="auctionFormatPill"
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md border border-purple-400/30"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <Sparkles className={`w-3.5 h-3.5 ${isPoints ? 'text-amber-300 animate-spin-slow' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">POINTS</span>
            <span className="sm:hidden">PTS</span>
          </span>
        </button>

        {/* LKR (MONEY) Button */}
        <button
          type="button"
          onClick={() => handleSelect('MONEY')}
          disabled={isUpdating}
          className={`relative z-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 text-xs font-bold rounded-lg transition-colors duration-200 ${
            isMoney
              ? 'text-slate-950 font-extrabold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {isMoney && (
            <motion.div
              layoutId="auctionFormatPill"
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-300/60"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1">
            <Coins className={`w-3.5 h-3.5 ${isMoney ? 'text-slate-950' : 'text-slate-400'}`} />
            <span>LKR</span>
          </span>
        </button>

        {/* Status Lock Indicator if Bidding has started or user unauthorized */}
        {hasStartedBidding && (
          <span
            className="ml-1 text-amber-400/90 pl-1 pr-1.5 flex items-center gap-1 text-[10px] font-mono border-l border-slate-700/80"
            title="Format locked: Live auction bids exist"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline text-[9px] uppercase tracking-wider text-amber-400 font-bold">LOCKED</span>
          </span>
        )}
      </div>

      {/* Permission Notice Tooltip Toast */}
      <AnimatePresence>
        {permissionNotice && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 z-50 w-72 p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs shadow-2xl backdrop-blur-md flex items-start gap-2"
          >
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Format Configuration Restricted</p>
              <p className="text-[11px] text-slate-300 mt-0.5">{permissionNotice}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authorised Reset Modal (Bidding Locked Workflow) */}
      <Modal
        isOpen={Boolean(resetPrompt)}
        onClose={cancelResetPrompt}
        title="Authorised Auction Reset Required"
        description="Live bidding has already commenced on this tournament's ledger."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 space-y-1">
              <p className="font-bold text-white text-sm">
                Switching format to {resetPrompt?.targetFormat} will reset current bids.
              </p>
              <p>
                To maintain competitive sports integrity, monetary and points valuations cannot be mixed mid-auction.
                Proceeding will clear active lot bids and update the tournament purse architecture to{' '}
                <span className="font-mono text-emerald-400 font-bold">
                  {resetPrompt?.targetFormat === 'POINTS' ? 'Points Model (100,000 PTS)' : 'Currency (LKR 10,000,000)'}
                </span>.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Authorised Actor:
            </span>
            <span className="font-mono text-white font-bold">{currentRole}</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={cancelResetPrompt}>
              Keep Existing Format
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={confirmResetAndSwitch}
              loading={isUpdating}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold"
            >
              Reset Bids & Switch to {resetPrompt?.targetFormat}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
