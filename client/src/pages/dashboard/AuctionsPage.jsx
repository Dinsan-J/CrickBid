import React from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Radio, Calendar, Clock, ListOrdered, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AuctionsPage() {
  const { format, currencyCode, isPoints, formatAmount } = useTournament();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Auction Sessions & Schedule
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Configure lot sequencing, auctioneer assignments, and gavel timers
          </p>
        </div>

        <Link to="/dashboard/live-auction">
          <Button variant="primary" icon={Radio} className="shadow-glow-sm">
            Launch Live Gavel Room
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Auction Card */}
        <Card glow className="border-crick-lime/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="live" size="sm" dot>Live Now</Badge>
              <Badge variant={isPoints ? 'purple' : 'amber'} size="sm">
                {isPoints ? 'Points Model (PTS)' : 'Money (LKR)'}
              </Badge>
            </div>
            <CardTitle className="pt-2">MCA Premier League 2026 — Main Auction</CardTitle>
            <CardDescription>Conducted by: Charu Sharma (Platform Managed)</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-crick-surface border border-slate-200 dark:border-crick-border text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block">CURRENT LOT</span>
                <span className="text-sm font-bold text-crick-lime">Lot #18</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">COMPLETED</span>
                <span className="text-sm font-bold text-white">17 Lots</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">REMAINING</span>
                <span className="text-sm font-bold text-white">77 Lots</span>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300">
              Active player on podium: <strong>Pathum Nissanka</strong>. Current highest bid {formatAmount(850000)} by Colombo Kings.
            </p>
          </CardContent>

          <CardFooter>
            <Link to="/dashboard/live-auction" className="w-full">
              <Button variant="primary" className="w-full" icon={Radio}>
                Enter Gavel Room
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Scheduled Upcoming Auction */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="neutral" size="sm">Scheduled</Badge>
              <Badge variant="purple" size="sm">Points Model</Badge>
            </div>
            <CardTitle className="pt-2">Colombo Invitational T20 — Season 4</CardTitle>
            <CardDescription>Scheduled for May 14, 2026 • 10:00 AM IST</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-crick-surface border border-slate-200 dark:border-crick-border space-y-1.5">
              <div className="flex justify-between">
                <span>Lot Ordering:</span>
                <strong className="text-slate-800 dark:text-white">Icon & Platinum first</strong>
              </div>
              <div className="flex justify-between">
                <span>Timer Duration:</span>
                <strong className="text-slate-800 dark:text-white">20 Seconds per Bid</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Registered:</span>
                <strong className="text-slate-800 dark:text-white">128 Players</strong>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button variant="outline" className="w-full">
              Configure Lots & Timer Rules
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
