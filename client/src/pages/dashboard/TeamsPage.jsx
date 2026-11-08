import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Plus,
  Users,
  Coins,
  UserCheck,
  Shield,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  Wallet,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { teamApi } from '../../services/api';
import { useTournament } from '../../context/TournamentContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { SkeletonGrid } from '../../components/ui/LoadingState';

export default function TeamsPage() {
  const { format, currencyCode } = useTournament();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [addTeamOpen, setAddTeamOpen] = useState(false);

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        const res = await teamApi.getAll();
        if (res.success) {
          setTeams(res.data);
        }
      } catch (err) {
        console.error('Failed to load teams:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  const toggleExpand = (teamId) => {
    setExpandedTeamId(prev => (prev === teamId ? null : teamId));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  const formatAmount = (num) => {
    if (format === 'POINTS') {
      const pts = Math.round(num / 100);
      return `${pts.toLocaleString()} PTS`;
    }
    return `LKR ${num.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Franchise Teams
            </h1>
            <Badge variant="lime" size="md">
              {teams.length} Franchises
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Track purse depletion, squad roster caps, and team color identities in {format === 'POINTS' ? 'Points Format' : 'LKR Currency'}
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setAddTeamOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.35)]"
        >
          Add Franchise Team
        </Button>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {teams.map((team) => {
            const isExpanded = expandedTeamId === team._id;
            const spent = team.spentPurse || 0;
            const total = team.totalPurse || 10000000;
            const remaining = team.remainingPurse !== undefined ? team.remainingPurse : total - spent;
            const percentSpent = Math.min(100, Math.round((spent / total) * 100));
            const squadCount = team.squadCount || team.squadSize || 0;
            const maxSlots = team.maxSquadLimit || 15;

            return (
              <motion.div
                key={team._id}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-3xl bg-white dark:bg-crick-card border border-slate-200 dark:border-crick-border overflow-hidden shadow-sm hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)] transition-all flex flex-col justify-between"
              >
                {/* Team Card Header: Logo, Name, Owner, Color Identity */}
                <div className="p-6 border-b border-slate-100 dark:border-crick-border/70 relative">
                  {/* Subtle color identity accent top bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5"
                    style={{
                      background: `linear-gradient(90deg, ${team.primaryColorHex || '#10b981'}, ${team.secondaryColorHex || '#047857'})`
                    }}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Animated Team Logo Presentation */}
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 2 }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg border border-white/20 text-white relative overflow-hidden"
                        style={{
                          backgroundColor: team.primaryColorHex || '#10b981',
                          boxShadow: `0 8px 20px -4px ${team.primaryColorHex || '#10b981'}80`
                        }}
                      >
                        {team.logoUrl ? (
                          <img
                            src={team.logoUrl}
                            alt={team.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{team.shortCode}</span>
                        )}
                      </motion.div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {team.name}
                          </h3>
                          <span
                            className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold text-white uppercase shadow-xs"
                            style={{ backgroundColor: team.primaryColorHex || '#10b981' }}
                          >
                            {team.shortCode}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-crick-textMuted mt-1 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                          Owner: <strong className="text-slate-800 dark:text-slate-200">{team.owner}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Squad Slot Count Badge */}
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Squad Filled
                      </span>
                      <span className="font-mono text-sm font-black text-slate-900 dark:text-white">
                        {squadCount} / {maxSlots}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Financial Purse & Progress Bar */}
                <div className="p-6 space-y-4">
                  {/* Purse Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-crick-surface border border-slate-100 dark:border-crick-border">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                        Remaining Purse
                      </span>
                      <span className="text-base font-black text-emerald-500 font-mono mt-0.5 block">
                        {formatAmount(remaining)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                        Spent ({percentSpent}%)
                      </span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
                        {formatAmount(spent)}
                      </span>
                    </div>
                  </div>

                  {/* Animated Budget Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-crick-textMuted">
                      <span>Purse Utilization</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        Total Cap: {formatAmount(total)}
                      </span>
                    </div>

                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentSpent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                        className="h-full rounded-full shadow-sm"
                        style={{
                          background: `linear-gradient(90deg, ${team.primaryColorHex || '#10b981'}, ${team.secondaryColorHex || '#047857'})`
                        }}
                      />
                    </div>
                  </div>

                  {/* Expandable Squad Detail Drawer */}
                  <div className="pt-2">
                    <button
                      onClick={() => toggleExpand(team._id)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-crick-surface hover:bg-slate-200 dark:hover:bg-crick-card text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Roster ({team.playersList?.length || squadCount} Acquired)</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-crick-surface/80 border border-slate-200 dark:border-crick-border space-y-2 overflow-hidden"
                        >
                          {team.playersList && team.playersList.length > 0 ? (
                            team.playersList.map((p, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1.5 border-b last:border-b-0 border-slate-200 dark:border-crick-border/60"
                              >
                                <div className="flex items-center gap-2">
                                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                  <span className="font-bold text-slate-900 dark:text-white">
                                    {p.fullName}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    ({p.playingRole?.replace(/_/g, ' ')})
                                  </span>
                                </div>
                                <span className="font-mono text-emerald-500 font-bold">
                                  {formatAmount(p.soldPrice || 800000)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-xs text-slate-400 text-center py-2 italic">
                              Initial draft roster: 3 icon players retained. Remaining squad will be acquired in live gavel bidding.
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Add Team Modal */}
      <Modal
        isOpen={addTeamOpen}
        onClose={() => setAddTeamOpen(false)}
        title="Add New Franchise Team"
        description="Register franchise team, set total purse budget, and define team color identity"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAddTeamOpen(false);
          }}
          className="space-y-4"
        >
          <Input label="Franchise Team Name" required placeholder="e.g. Ruhuna Royals" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Short Code (2-3 chars)" required placeholder="RR" uppercase maxLength={4} />
            <Input label="Franchise Owner Name" required placeholder="Kumar Sangakkara" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Primary Brand Color (Hex)" placeholder="#10b981" defaultValue="#10b981" />
            <Input label="Secondary Accent Color (Hex)" placeholder="#047857" defaultValue="#047857" />
          </div>

          <Input
            label="Total Purse Cap"
            defaultValue={format === 'POINTS' ? '100,000 Points' : 'LKR 10,000,000'}
            helper="Configured according to active tournament financial format"
          />

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="outline" onClick={() => setAddTeamOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Franchise Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
