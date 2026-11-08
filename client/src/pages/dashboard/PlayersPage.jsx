import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List as ListIcon,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Flame,
  Zap,
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  Phone
} from 'lucide-react';
import { playerApi } from '../../services/api';
import { useAuth, ROLES } from '../../context/AuthContext';
import { useTournament } from '../../context/TournamentContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { SkeletonGrid } from '../../components/ui/LoadingState';
import EmptyState from '../../components/ui/EmptyState';
import PlayerRegistrationModal from '../../components/players/PlayerRegistrationModal';
import CinematicPlayerProfileModal from '../../components/players/CinematicPlayerProfileModal';

const FILTER_TABS = [
  { key: 'ALL', label: 'All Players' },
  { key: 'PENDING', label: 'Pending Review', highlight: true },
  { key: 'APPROVED', label: 'Approved Draft' },
  { key: 'SOLD', label: 'Sold Lots' },
  { key: 'REJECTED', label: 'Rejected' }
];

const ROLE_OPTIONS = [
  { key: 'ALL', label: 'All Cricket Roles' },
  { key: 'TOP_ORDER_BATSMAN', label: 'Top Order Batsman' },
  { key: 'MIDDLE_ORDER_BATSMAN', label: 'Middle Order Batsman' },
  { key: 'WICKET_KEEPER_BATSMAN', label: 'Wicket-Keeper' },
  { key: 'BATTING_ALL_ROUNDER', label: 'Batting All-Rounder' },
  { key: 'BOWLING_ALL_ROUNDER', label: 'Bowling All-Rounder' },
  { key: 'FAST_BOWLER', label: 'Fast Bowler' },
  { key: 'SPIN_BOWLER', label: 'Spin Bowler' }
];

export default function PlayersPage() {
  const { currentRole } = useAuth();
  const { format, currencyCode } = useTournament();
  const isOrganiser = [ROLES.PLATFORM_ADMIN, ROLES.ORGANISER].includes(currentRole);

  const [players, setPlayers] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modals
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [selectedProfilePlayer, setSelectedProfilePlayer] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  const fetchPlayers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await playerApi.getAll({
        status: activeTab !== 'ALL' ? activeTab : undefined,
        role: selectedRole !== 'ALL' ? selectedRole : undefined,
        search: searchQuery.trim() || undefined
      });

      if (res.success) {
        setPlayers(res.data);
        if (res.counts) setCounts(res.counts);
      }
    } catch (err) {
      console.error('Failed to load players:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedRole, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlayers();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchPlayers]);

  const handleStatusChange = async (playerId, newStatus) => {
    try {
      const res = await playerApi.updateStatus(playerId, newStatus, currentRole);
      if (res.success) {
        // Optimistically update list
        setPlayers(prev =>
          prev.map(p => (p._id === playerId ? { ...p, status: newStatus } : p))
        );
        if (selectedProfilePlayer?._id === playerId) {
          setSelectedProfilePlayer(prev => ({ ...prev, status: newStatus }));
        }
        setActionNotice({
          type: newStatus === 'APPROVED' ? 'success' : 'alert',
          text: `Player ${res.data.fullName} marked as ${newStatus}`
        });
        setTimeout(() => setActionNotice(null), 3500);
        fetchPlayers();
      }
    } catch (err) {
      alert(err.message || 'Could not update status');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      <AnimatePresence>
        {actionNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 backdrop-blur-md ${
              actionNotice.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-red-500/20 border-red-500/50 text-red-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Player Registry & Draft Pool
            </h1>
            <Badge variant="lime" size="md">
              {players.length} Active
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Review applicant profiles, verify cricket styles, and prepare catalog for live gavel auction
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setRegModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.35)]"
          >
            Register Player
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-crick-navy/90 border border-slate-200 dark:border-crick-border shadow-sm space-y-4">
        {/* Top bar: Tabs + View switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-crick-border/70 pb-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const badgeCount =
                tab.key === 'PENDING' ? counts.pending :
                tab.key === 'APPROVED' ? counts.approved :
                tab.key === 'REJECTED' ? counts.rejected : counts.total;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-crick-surface'
                  }`}
                >
                  <span>{tab.label}</span>
                  {badgeCount !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : tab.highlight && counts.pending > 0
                          ? 'bg-amber-500/20 text-amber-500 font-bold'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Grid vs List toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-crick-surface self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-crick-card text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-crick-card text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom bar: Search + Role Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by player name, ID (e.g. REG-2026), town or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-crick-surface border border-slate-200 dark:border-crick-border focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-crick-textMuted"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs pl-9 pr-8 py-2.5 rounded-2xl bg-slate-50 dark:bg-crick-surface border border-slate-200 dark:border-crick-border focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white cursor-pointer appearance-none"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Players Rendering: Grid vs List with Staggered Entrance */}
      {loading ? (
        <SkeletonGrid count={6} />
      ) : players.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Cricket Players Found"
          description="No registrations match the selected filters or search terms. Try resetting your query or registering a new player."
          action={
            <Button variant="primary" icon={Plus} onClick={() => setRegModalOpen(true)}>
              Register First Player
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        /* ==================== GRID VIEW ==================== */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {players.map((player) => {
            const isPending = player.status === 'PENDING';

            return (
              <motion.div
                key={player._id}
                variants={cardVariants}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative rounded-3xl bg-white dark:bg-crick-card border border-slate-200 dark:border-crick-border overflow-hidden shadow-sm hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                {/* Image Section with Scale on Hover */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                  <img
                    src={player.photoUrl}
                    alt={player.fullName}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Player Reg ID */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-400">
                    {player.registrationNumber}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={
                        player.status === 'SOLD'
                          ? 'success'
                          : player.status === 'UNDER_THE_HAMMER'
                          ? 'live'
                          : isPending
                          ? 'amber'
                          : player.status === 'REJECTED'
                          ? 'danger'
                          : 'lime'
                      }
                      size="sm"
                      dot={player.status === 'UNDER_THE_HAMMER'}
                    >
                      {player.status?.replace(/_/g, ' ')}
                    </Badge>
                  </div>

                  {/* Role & Base Price Overlay on Image bottom */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <Badge variant="lime" size="sm" className="font-bold">
                        {player.playingRole?.replace(/_/g, ' ')}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                        {player.status === 'SOLD' ? 'Sold' : 'Reserve'}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-emerald-400">
                        {player.status === 'SOLD'
                          ? format === 'POINTS'
                            ? `${(player.soldPrice || 120000).toLocaleString()} PTS`
                            : `LKR ${(player.soldPrice || 1200000).toLocaleString()}`
                          : format === 'POINTS'
                          ? `${(player.basePrice || 50000).toLocaleString()} PTS`
                          : `LKR ${(player.basePrice || 50000).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setSelectedProfilePlayer(player)}
                      className="font-black text-slate-900 dark:text-white text-base tracking-tight hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {player.fullName}
                    </h3>

                    {/* Styles breakdown */}
                    <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="text-slate-400">Bat:</span>
                        <span className="font-semibold">{player.battingStyle?.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-slate-400">Bowl:</span>
                        <span className="font-semibold truncate">{player.bowlingStyle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Area */}
                  <div className="pt-3 border-t border-slate-100 dark:border-crick-border/70 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedProfilePlayer(player)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Profile
                    </button>

                    {/* Organiser Quick Approval Buttons */}
                    {isOrganiser && isPending ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStatusChange(player._id, 'REJECTED')}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Reject Registration"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(player._id, 'APPROVED')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all shadow-sm flex items-center gap-1"
                          title="Approve Player"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* ==================== LIST VIEW ==================== */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-2.5"
        >
          {players.map((player) => {
            const isPending = player.status === 'PENDING';

            return (
              <motion.div
                key={player._id}
                variants={cardVariants}
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-crick-card border border-slate-200 dark:border-crick-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={player.photoUrl}
                    alt={player.fullName}
                    className="w-14 h-14 rounded-2xl object-cover object-top border border-emerald-500/40"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-emerald-500 font-bold">
                        {player.registrationNumber}
                      </span>
                      <h4
                        onClick={() => setSelectedProfilePlayer(player)}
                        className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-emerald-400 cursor-pointer"
                      >
                        {player.fullName}
                      </h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-crick-textMuted mt-1">
                      <Badge variant="lime" size="sm">
                        {player.playingRole?.replace(/_/g, ' ')}
                      </Badge>
                      <span>•</span>
                      <span>{player.battingStyle?.replace(/_/g, ' ')}</span>
                      <span>•</span>
                      <span className="truncate max-w-[150px]">{player.bowlingStyle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-crick-border">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                      Reserve
                    </span>
                    <span className="font-mono text-xs font-bold text-white">
                      {format === 'POINTS'
                        ? `${(player.basePrice || 50000).toLocaleString()} PTS`
                        : `LKR ${(player.basePrice || 50000).toLocaleString()}`}
                    </span>
                  </div>

                  <Badge
                    variant={
                      player.status === 'SOLD'
                        ? 'success'
                        : isPending
                        ? 'amber'
                        : 'lime'
                    }
                    size="sm"
                  >
                    {player.status}
                  </Badge>

                  {isOrganiser && isPending ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStatusChange(player._id, 'REJECTED')}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(player._id, 'APPROVED')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedProfilePlayer(player)}
                    >
                      Profile
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Player Registration Modal */}
      <PlayerRegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        onPlayerRegistered={() => {
          fetchPlayers();
        }}
      />

      {/* Cinematic Player Profile Modal (Feature 5) */}
      <CinematicPlayerProfileModal
        player={selectedProfilePlayer}
        isOpen={Boolean(selectedProfilePlayer)}
        onClose={() => setSelectedProfilePlayer(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
