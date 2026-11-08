import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Gavel,
  Radio,
  Tv2,
  MessageSquare,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Coins,
  Flame,
  Users,
  Clock,
  Layers,
  FileSpreadsheet,
  Check,
  ChevronRight,
  Sliders,
  Globe2,
  Play
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import HeroAuctionPreview from '../../components/landing/HeroAuctionPreview';
import InteractiveAuctionDemo from '../../components/landing/InteractiveAuctionDemo';

export default function LandingPage() {
  const [activeTabEconomy, setActiveTabEconomy] = useState('MONEY');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-crick-dark text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* ──────────────────────────────────────────────────────────
          NAVIGATION BAR
      ────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-crick-dark/90 backdrop-blur-md border-b border-crick-border px-4 sm:px-8 py-4 flex items-center justify-between transition-colors">
        {/* Clean Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-crick-surface border border-crick-border flex items-center justify-center shadow-glow-sm group-hover:border-emerald-500/50 transition-colors">
            <span className="font-extrabold text-emerald-400 text-lg font-mono tracking-tight">CB</span>
          </div>
          <span className="font-black tracking-tight text-white text-xl">
            Cricket<span className="text-emerald-400">Bid</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-300">
          <a href="#live-demo" className="hover:text-emerald-400 transition-colors">Live Demo</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">Workflow</a>
          <a href="#dual-economy" className="hover:text-emerald-400 transition-colors">Points & Currency</a>
          <a href="#broadcast" className="hover:text-emerald-400 transition-colors">OBS Broadcast</a>
          <a href="#whatsapp" className="hover:text-emerald-400 transition-colors">WhatsApp Centre</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              Sign In
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" icon={ArrowRight} iconPosition="right">
              Create Tournament
            </Button>
          </Link>
        </div>
      </nav>

      {/* ──────────────────────────────────────────────────────────
          SECTION 1: TWO-COLUMN HERO WITH LARGE LIVE AUCTION PREVIEW
      ────────────────────────────────────────────────────────── */}
      <section className="relative pt-10 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Strategic Headline & CTAs */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-6 text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crick-surface border border-crick-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold tracking-wider text-slate-200">
                CRICKET AUCTION TECHNOLOGY
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]"
            >
              The Professional Cricket Auction Platform
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-crick-textMuted leading-relaxed max-w-xl"
            >
              Engineered exclusively for cricket tournaments. Run high-stakes player auctions with atomic sub-second bidding, transparent OBS broadcast overlays, and centralized player WhatsApp alerts.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={Trophy} className="w-full sm:w-auto">
                  Create Tournament
                </Button>
              </Link>
              <Link to="/dashboard/live-auction">
                <Button variant="outline" size="lg" icon={Radio} className="w-full sm:w-auto">
                  Explore Live Auction
                </Button>
              </Link>
            </motion.div>

            {/* Trust feature bullet strip */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-3 pt-6 border-t border-crick-border/80 text-xs text-slate-300 font-medium"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Race Conditions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1080p OBS Overlays</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Points & Currency</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: The Large, Visually Impressive Live Auction Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-6 w-full"
          >
            <HeroAuctionPreview />
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2: INTERACTIVE AUCTION DEMONSTRATION
      ────────────────────────────────────────────────────────── */}
      <section id="live-demo" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-crick-border">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="lime" size="md">Hands-On Demonstration</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Experience the Bidding Engine in Action
          </h2>
          <p className="text-sm sm:text-base text-crick-textMuted mt-2">
            Try placing bids from competing franchise owners, experience countdown clock resets, and trigger the auctioneer gavel hammer.
          </p>
        </div>

        <InteractiveAuctionDemo />
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 3: HOW THE PLATFORM WORKS
      ────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8 bg-crick-navy/60 border-t border-crick-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="neutral" size="md">Step-by-Step Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
              How CricketBid Powers Your Auction Day
            </h2>
            <p className="text-sm sm:text-base text-crick-textMuted mt-2">
              From player registrations and category reserve prices to live streaming and official squad sheet exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Configure Tournament',
                desc: 'Set starting team purse quotas, select points or currency (LKR), and enforce squad limits such as overseas caps and minimum bowling roles.',
                icon: Sliders
              },
              {
                step: '02',
                title: 'Register Players',
                desc: 'Collect player stats, photos, and WhatsApp opt-in consent via public forms or bulk upload entire rosters via CSV in seconds.',
                icon: Users
              },
              {
                step: '03',
                title: 'Run Live Auction',
                desc: 'Auctioneers command the gavel podium while franchise owners tap real-time bids on mobile devices with atomic distributed lock protection.',
                icon: Gavel
              },
              {
                step: '04',
                title: 'Instant Delivery',
                desc: 'Download match-ready PDF squad sheets immediately. Acquired players receive automated WhatsApp confirmations with team allocations.',
                icon: ShieldCheck
              }
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="p-6 rounded-2xl bg-crick-card border border-crick-border space-y-3 relative group hover:border-emerald-500/40 transition-colors">
                  <div className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg inline-block">
                    STEP {st.step}
                  </div>
                  <h3 className="text-lg font-bold text-white pt-1">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-crick-textMuted leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 4: POINTS-BASED AND MONEY-BASED AUCTIONS
      ────────────────────────────────────────────────────────── */}
      <section id="dual-economy" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-crick-border">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="amber" size="md">Flexible Valuation Models</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Points-Based or Money-Based Auctions
          </h2>
          <p className="text-sm sm:text-base text-crick-textMuted mt-2">
            Every cricket tournament has unique commercial dynamics. CricketBid natively supports both models with automated squad reservation math.
          </p>

          {/* Toggle pill */}
          <div className="inline-flex p-1 rounded-xl bg-crick-surface border border-crick-border mt-6">
            <button
              onClick={() => setActiveTabEconomy('MONEY')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTabEconomy === 'MONEY'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Money-Based (LKR / Currency)
            </button>
            <button
              onClick={() => setActiveTabEconomy('POINTS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTabEconomy === 'POINTS'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Points-Based (Fixed Purse Quota)
            </button>
          </div>
        </div>

        {/* Comparative Architecture Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left: Overview of Selected Model */}
          <div className="p-6 sm:p-8 rounded-2xl bg-crick-card border border-crick-border space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <Badge variant={activeTabEconomy === 'MONEY' ? 'amber' : 'purple'} size="sm">
                {activeTabEconomy === 'MONEY' ? 'Real-Currency Valuation' : 'Equal Quota Points Model'}
              </Badge>

              <h3 className="text-2xl font-black text-white">
                {activeTabEconomy === 'MONEY'
                  ? 'Sri Lankan Rupees (LKR) or Custom Currency'
                  : '100,000 Starting Points Per Franchise'}
              </h3>

              <p className="text-sm text-crick-textMuted leading-relaxed">
                {activeTabEconomy === 'MONEY'
                  ? 'Tailored for professional and corporate leagues with real player financial valuations. Supports realistic increment ladders, base reserve categories, and bank-verified financial settlements.'
                  : 'Ideal for school alumni leagues, community clubs, and friendly invitationals where fairness is paramount. Every team receives an identical point budget, and bidding scales in proportional point increments.'}
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-crick-border/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configurable bid increment rules (e.g. +LKR 25K below 500K, +LKR 50K above)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Category-based base prices (Icon, Platinum, Gold, Silver, Emerging)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Immutable financial transaction audit trail exported to CSV</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <Link to="/register">
                <Button variant="outline" size="sm" className="w-full">
                  Create {activeTabEconomy === 'MONEY' ? 'Money' : 'Points'} Tournament
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Automated Max Safe Bid Constraint Math */}
          <div className="p-6 sm:p-8 rounded-2xl bg-crick-navy border border-emerald-500/30 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Squad Protection Constraint</span>
              </div>

              <h4 className="text-xl font-bold text-white">
                Automated Overdraft Prevention
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                The engine continuously evaluates franchise purse balances against minimum required squad sizes to guarantee that no team overspends on a star player and ends up with an incomplete squad:
              </p>

              {/* Mathematical formula box */}
              <div className="p-4 rounded-xl bg-crick-dark border border-crick-border font-mono text-xs text-emerald-400 text-center space-y-1">
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  SERVER-ENFORCED FORMULA
                </div>
                <div className="text-sm font-bold text-white">
                  MaxSafeBid = PurseRemaining - ((RequiredSlots - CurrentCount - 1) × MinBasePrice)
                </div>
              </div>

              <p className="text-[11px] text-crick-textMuted leading-relaxed">
                If a bid would leave the franchise unable to afford the base price of their remaining mandatory roster spots, the engine blocks the bid instantly with a descriptive message.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-crick-surface border border-crick-border flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Sample Safe Bid Limit:</span>
              <strong className="text-emerald-400">LKR 2,850,000 Safe Cap</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 5: TEAM AND PLAYER MANAGEMENT
      ────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-crick-navy/60 border-t border-crick-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="lime" size="md">Complete Squad Operations</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
              Roster Constraints & Player Lifecycle
            </h2>
            <p className="text-sm sm:text-base text-crick-textMuted mt-2">
              Maintain regulatory balance with cricket-specific role restrictions, overseas player quotas, and rapid CSV onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card hover>
              <div className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Squad Composition Rules</h3>
                <p className="text-xs sm:text-sm text-crick-textMuted leading-relaxed">
                  Enforce minimum roster sizes (e.g. 11-16 players), maximum overseas player caps, and compulsory balance (e.g. minimum 1 wicketkeeper and 4 bowlers).
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Coins className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Tiered Category Reserves</h3>
                <p className="text-xs sm:text-sm text-crick-textMuted leading-relaxed">
                  Group players into Icon, Platinum, Gold, Silver, and Emerging categories. Set base prices by tier and establish the order lots walk up to the podium.
                </p>
              </div>
            </Card>

            <Card hover>
              <div className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Bulk CSV Roster Import</h3>
                <p className="text-xs sm:text-sm text-crick-textMuted leading-relaxed">
                  Upload hundreds of players with photos, career stats, batting style, and phone numbers in a single spreadsheet. System validates formatting automatically.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 6: OBS BROADCAST INTEGRATION
      ────────────────────────────────────────────────────────── */}
      <section id="broadcast" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-crick-border">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5 text-left">
            <Badge variant="live" size="sm" dot>Broadcast Ready</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Direct OBS Studio & vMix Graphics Overlays
            </h2>
            <p className="text-sm text-crick-textMuted leading-relaxed">
              Broadcast your auction live on YouTube, Facebook Live, or television with zero video capture hardware. CricketBid delivers dynamic, transparent web pages that render natively inside OBS Studio at 60 FPS.
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% Transparent Alpha Channel</strong>: Lower-thirds layer seamlessly over commentator camera feeds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant Sub-Second Animation</strong>: Bid updates, gavel strikes, and team leaderboards react instantaneously.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Scrolling News Ticker</strong>: Displays real-time recent buys, unsold lots, and tournament records.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link to="/dashboard/broadcast-studio">
                <Button variant="primary" icon={Tv2}>
                  Launch Broadcast Studio
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Broadcast Overlay Screen Mockup */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-crick-border bg-slate-950 p-6 flex flex-col justify-between shadow-2xl">
              {/* Top Sponsor Insignia */}
              <div className="flex items-center justify-between text-xs">
                <div className="p-2 px-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <strong>MCA PREMIER LEAGUE AUCTION</strong>
                </div>
                <div className="p-1.5 px-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 font-mono">
                  1080p OVERLAY STREAM
                </div>
              </div>

              {/* Center Transparent Grid Hint */}
              <div className="text-center text-xs text-slate-500 font-mono">
                [ CAMERA FEED TRANSPARENT CANVAS ]
              </div>

              {/* Lower-Third Overlay Graphic */}
              <div className="rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 p-4 text-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=80&auto=format&fit=crop&q=80"
                    alt="Player"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-400"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[9px] font-mono">
                        LOT #18
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold">Pathum Nissanka</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Runs: 1,540 • SR: 138.4 • Base: LKR 100K
                    </span>
                  </div>
                </div>

                <div className="text-right border-l border-white/10 pl-4">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 tracking-wider block">
                    CURRENT BID
                  </span>
                  <div className="font-mono text-xl font-black text-white">
                    LKR 850,000
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold">Colombo Kings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 7: WHATSAPP PLAYER NOTIFICATIONS
      ────────────────────────────────────────────────────────── */}
      <section id="whatsapp" className="py-16 sm:py-24 px-4 sm:px-8 bg-crick-navy/60 border-t border-crick-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Mobile Screen Mockup */}
            <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center">
              <div className="w-full max-w-sm rounded-3xl bg-[#0b141a] border border-[#222d34] p-4 text-slate-100 shadow-2xl space-y-3 font-sans">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#222d34]">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs">
                    CB
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">CricketBid Official</span>
                    <span className="text-[10px] text-slate-400">Meta Verified WhatsApp Business</span>
                  </div>
                </div>

                <div className="bg-[#1f2c34] p-3.5 rounded-2xl rounded-tl-none space-y-2 text-xs text-slate-200 leading-relaxed shadow-sm">
                  <p className="font-bold text-emerald-400">🏏 OFFICIAL DRAFT RESULT</p>
                  <p>Congratulations <strong>Wanindu Hasaranga</strong>!</p>
                  <p>You have been successfully acquired by <strong>Kandy Warriors</strong> in the Premier League Auction for <strong>LKR 1,200,000</strong>.</p>
                  <div className="text-[10px] text-slate-400 pt-1.5 border-t border-[#2a3942]">
                    Delivered via Platform WhatsApp Engine • Reply STOP to unsubscribe.
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Explanatory Content */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-5 text-left">
              <Badge variant="lime" size="sm">Central WhatsApp Engine</Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Instant WhatsApp Alerts at Zero Messaging Cost
              </h2>
              <p className="text-sm text-crick-textMuted leading-relaxed">
                CricketBid operates a central, verified Meta WhatsApp Business Account for the platform. Tournaments do not need to configure API accounts or buy SIM cards.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-crick-card border border-crick-border space-y-1.5">
                  <div className="font-bold text-white text-sm">Platform-Borne Costs</div>
                  <p className="text-xs text-crick-textMuted">
                    The platform absorbs 100% of Meta conversation fees. No surprise per-message charges for organizers.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-crick-card border border-crick-border space-y-1.5">
                  <div className="font-bold text-white text-sm">Strict PDPA Compliance</div>
                  <p className="text-xs text-crick-textMuted">
                    Digital opt-in consent recorded during player sign-up. Inbound "STOP" replies instantly revoke notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 8: PRICING PLANS
      ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-crick-border">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="amber" size="md">Transparent Commercial Model</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Self-Service SaaS & Managed Events
          </h2>
          <p className="text-sm sm:text-base text-crick-textMuted mt-2">
            Host your own club auction independently or engage our professional platform auctioneers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Self-Service SaaS */}
          <div className="p-8 rounded-3xl bg-crick-card border border-emerald-500/40 relative shadow-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Badge variant="lime" size="sm">SELF-SERVICE TOURNAMENT SAAS</Badge>
              <h3 className="text-2xl font-black text-white">Tournament Pass</h3>
              <div className="font-mono text-3xl sm:text-4xl font-black text-emerald-400">
                LKR 35,000 <span className="text-xs text-slate-400 font-sans">/ Tournament Season</span>
              </div>
              <p className="text-xs text-crick-textMuted leading-relaxed">
                Complete access to the platform for club and mercantile organizers running their own auction event.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-crick-border/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlimited Franchise Teams & Squads
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Points-based or Money-based Auction Engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1080p Transparent OBS Studio Overlays
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 500 WhatsApp Player Notification Credits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Official PDF Squad Match Sheets & CSV Audit Logs
                </li>
              </ul>
            </div>

            <Link to="/register" className="w-full">
              <Button variant="primary" size="lg" className="w-full">
                Create Tournament Now
              </Button>
            </Link>
          </div>

          {/* Managed Professional Event */}
          <div className="p-8 rounded-3xl bg-crick-navy border border-crick-border relative flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Badge variant="purple" size="sm">MANAGED PROFESSIONAL EVENT</Badge>
              <h3 className="text-2xl font-black text-white">Full Event Management</h3>
              <div className="font-mono text-3xl sm:text-4xl font-black text-white">
                Custom Quotation
              </div>
              <p className="text-xs text-crick-textMuted leading-relaxed">
                For premier corporate tournaments and leagues requiring professional on-site auctioneers and technical streaming operators.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-crick-border/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Professional Platform-Dispatched Auctioneer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Dedicated Technical Broadcast Stream Engineer
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Custom Sponsor Branding Graphics for Overlays
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" /> Unlimited WhatsApp Notifications & On-Site Support
                </li>
              </ul>
            </div>

            <Link to="/register" className="w-full">
              <Button variant="outline" size="lg" className="w-full">
                Inquire Managed Event
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 9: FINAL CALL TO ACTION
      ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 border-t border-crick-border bg-gradient-to-b from-crick-dark to-crick-navy text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge variant="lime" size="md">Get Started Today</Badge>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Elevate Your Cricket Auction?
          </h2>

          <p className="text-base text-crick-textMuted leading-relaxed max-w-xl mx-auto">
            Experience true real-time bidding, zero calculation errors, and broadcast-ready graphics for your tournament.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={Trophy}>
                Create Your Tournament
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                Sign In to Console
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 10: PROFESSIONAL FOOTER
      ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-crick-border py-12 px-4 sm:px-8 bg-crick-dark text-xs text-crick-textMuted">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Brand Tagline */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-crick-surface border border-crick-border flex items-center justify-center font-mono font-bold text-emerald-400 text-sm">
              CB
            </div>
            <div>
              <span className="font-bold text-white text-sm">CricketBid</span>
              <p className="text-[11px] text-slate-500">Commercial Cricket Auction Management Platform</p>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Create Tournament</Link>
            <Link to="/dashboard/live-auction" className="hover:text-white transition-colors">Live Room Demo</Link>
            <Link to="/dashboard/broadcast-studio" className="hover:text-white transition-colors">OBS Overlays</Link>
          </div>

          {/* Copyright Notice */}
          <div className="text-right text-[11px] text-slate-500">
            © 2026 CricketBid. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
