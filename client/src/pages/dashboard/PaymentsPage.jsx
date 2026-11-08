import React from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Zap, Download } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function PaymentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Billing & Platform Credits
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Manage your tournament SaaS subscription tier and platform WhatsApp credits
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Plan */}
        <Card glow className="md:col-span-2 border-crick-lime/40 bg-gradient-to-r from-crick-card to-crick-navy">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="lime" size="sm">ACTIVE SUBSCRIPTION</Badge>
              <span className="font-mono text-xs text-crick-textMuted">Auto-Renews May 2027</span>
            </div>
            <CardTitle className="pt-2 text-2xl font-black">Tournament Pro SaaS</CardTitle>
            <CardDescription>Mercantile Cricket Association Tenant Plan</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="font-mono text-3xl font-black text-crick-lime">
              LKR 35,000 <span className="text-xs text-slate-400 font-sans">/ Tournament Season</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-crick-border">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tournaments</span>
                <strong className="text-white">Unlimited</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">OBS Studio Overlays</span>
                <strong className="text-crick-lime">Included (1080p)</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Engine</span>
                <strong className="text-emerald-400">Platform Borne</strong>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Payment Method: Bank Transfer / Card ending in 4242</span>
            <Button variant="outline" size="sm">
              Upgrade to Managed Event
            </Button>
          </CardFooter>
        </Card>

        {/* WhatsApp Credit Wallet */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <Badge variant="purple" size="sm">WHATSAPP NOTIFICATIONS</Badge>
            <CardTitle className="pt-1">Notification Credits</CardTitle>
            <CardDescription>Player SMS & WhatsApp alerts</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="font-mono text-3xl font-black text-white">
              450 <span className="text-xs text-crick-textMuted font-sans">Credits Left</span>
            </div>
            <p className="text-xs text-slate-400">
              Covers all upcoming player opt-ins, hammer calls, and final squad declarations.
            </p>
          </CardContent>

          <CardFooter>
            <Button variant="primary" size="sm" className="w-full">
              Add Notification Credits
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
