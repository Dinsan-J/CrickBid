import React, { useState } from 'react';
import {
  Tv2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  ShieldAlert,
  Play
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Switch from '../../components/ui/Switch';
import Input from '../../components/ui/Input';

export default function BroadcastStudioPage() {
  const [streamKey, setStreamKey] = useState('obs_live_mca2026_9f81a7b2c4e5');
  const [copied, setCopied] = useState(false);

  // Overlay settings
  const [showLowerThird, setShowLowerThird] = useState(true);
  const [showTicker, setShowTicker] = useState(true);
  const [showPurseSidebar, setShowPurseSidebar] = useState(true);
  const [showSponsors, setShowSponsors] = useState(true);

  const overlayUrl = `https://app.crickbid.com/overlay/live/mca-2026?key=${streamKey}&alpha=true`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateKey = () => {
    const randomHex = Math.random().toString(36).substring(2, 12);
    setStreamKey(`obs_live_mca2026_${randomHex}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Broadcast Studio
            </h1>
            <Badge variant="live" size="sm" dot>
              OBS 1080p
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Manage transparent browser source overlays for OBS Studio, vMix, and Streamlabs
          </p>
        </div>

        <Button
          variant="outline"
          icon={RefreshCw}
          onClick={regenerateKey}
        >
          Regenerate Stream Key
        </Button>
      </div>

      {/* Stream URL Quick Copy Bar */}
      <Card className="border-crick-lime/30 bg-gradient-to-r from-crick-card to-crick-navy">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2.5 rounded-xl bg-crick-lime/10 text-crick-lime border border-crick-lime/20 shrink-0">
              <Tv2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                OBS Browser Source URL (1920x1080 Transparent)
              </span>
              <span className="font-mono text-xs text-white truncate block max-w-lg">
                {overlayUrl}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button
              variant="primary"
              size="sm"
              icon={copied ? Check : Copy}
              onClick={copyToClipboard}
            >
              {copied ? 'Copied URL!' : 'Copy Overlay URL'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Stream Simulation Preview Window */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Eye className="w-4 h-4 text-crick-lime" />
            <span>Simulated 1080p OBS Broadcast Canvas (16:9)</span>
          </h3>
          <Badge variant="lime" size="sm">
            Alpha Channel: 100% Transparent
          </Badge>
        </div>

        {/* 16:9 Canvas Simulator */}
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-crick-border bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 flex flex-col justify-between p-6 sm:p-8 shadow-2xl">
          {/* Top Bar: Tournament & Sponsor Branding */}
          {showSponsors && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 p-2.5 px-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg">
                <div className="w-6 h-6 rounded bg-crick-lime flex items-center justify-center font-mono font-bold text-crick-dark text-xs">
                  CB
                </div>
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider block leading-tight">
                    MCA PREMIER LEAGUE 2026
                  </span>
                  <span className="text-[9px] text-crick-lime font-mono">
                    OFFICIAL LIVE DRAFT AUCTION
                  </span>
                </div>
              </div>

              <div className="p-2 px-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-mono text-slate-300">
                <span>POWERED BY</span>
                <span className="font-bold text-white tracking-widest text-[11px]">CEYLON TEA & BANK OF CEYLON</span>
              </div>
            </div>
          )}

          {/* Center Space: Free Video Feed Area (Chroma/Transparent in real OBS) */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-4 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/5 text-slate-400 text-xs">
              <span className="font-mono text-crick-lime font-bold block mb-1">
                TRANSPARENT BACKGROUND LAYER
              </span>
              In OBS Studio, your camera feed, commentator video, or stage view shows through here.
            </div>
          </div>

          {/* Bottom Area: Dynamic Broadcast Graphics */}
          <div className="space-y-3">
            {/* Lower-Third Card */}
            {showLowerThird && (
              <div className="max-w-2xl rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 p-4 text-white shadow-2xl flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=100&auto=format&fit=crop&q=80"
                    alt="Pathum Nissanka"
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-crick-lime"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[10px] uppercase font-mono">
                        LOT #18 • ICON
                      </span>
                      <span className="text-xs text-crick-lime font-bold">
                        RIGHT-HAND TOP ORDER BAT
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mt-0.5">
                      Pathum Nissanka
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                      <span>Runs: <strong>1,540</strong></span>
                      <span>SR: <strong>138.4</strong></span>
                      <span>Base: <strong>LKR 100,000</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right border-l border-white/10 pl-5">
                  <span className="text-[10px] uppercase font-bold text-crick-lime tracking-widest block">
                    CURRENT BID
                  </span>
                  <div className="font-mono text-2xl font-black text-white">
                    LKR 850,000
                  </div>
                  <span className="text-xs text-amber-400 font-bold">
                    Held by: Colombo Kings
                  </span>
                </div>
              </div>
            )}

            {/* Live Ticker Bar */}
            {showTicker && (
              <div className="rounded-xl bg-crick-navy/95 backdrop-blur-md border border-crick-lime/30 py-1.5 px-4 flex items-center justify-between text-xs font-mono text-slate-200 overflow-hidden shadow-lg">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold text-crick-lime uppercase">LATEST DEALS:</span>
                </div>
                <div className="truncate ml-4 text-[11px] text-slate-300">
                  Lot #17 Wanindu Hasaranga sold to Kandy Warriors for LKR 1,200,000 • Lot #16 Dushmantha Chameera sold to Galle Titans for LKR 650,000 • Lot #15 Charith Asalanka sold to Jaffna Stallions for LKR 750,000
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Display Widgets & Elements</CardTitle>
            <CardDescription>Toggle specific layers rendered in the OBS source</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Switch
              label="Active Lot Lower-Third Banner"
              description="Displays player photo, cricket stats, current high bid, and holding team"
              checked={showLowerThird}
              onChange={setShowLowerThird}
            />

            <Switch
              label="Scrolling News Ticker"
              description="Bottom ticker with recent acquisitions, upcoming lots, and records"
              checked={showTicker}
              onChange={setShowTicker}
            />

            <Switch
              label="Tournament & Sponsor Top Bar"
              description="Includes official league insignia and commercial title sponsor logos"
              checked={showSponsors}
              onChange={setShowSponsors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>OBS Studio Setup Guide</CardTitle>
            <CardDescription>Step-by-step instructions for broadcast engineers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <ol className="list-decimal list-inside space-y-2 leading-relaxed">
              <li>In OBS Studio, add a new source: <strong>Browser</strong>.</li>
              <li>Paste the <strong>Overlay URL</strong> from above.</li>
              <li>Set Width to <code className="bg-slate-100 dark:bg-crick-surface px-1.5 py-0.5 rounded text-crick-lime font-mono">1920</code> and Height to <code className="bg-slate-100 dark:bg-crick-surface px-1.5 py-0.5 rounded text-crick-lime font-mono">1080</code>.</li>
              <li>Check <strong>"Shutdown source when not visible"</strong> to save GPU RAM.</li>
              <li>Layer the Browser Source above your video camera feed. The graphics render with pure CSS alpha transparency.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
