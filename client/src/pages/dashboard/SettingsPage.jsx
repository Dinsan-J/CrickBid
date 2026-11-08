import React, { useState } from 'react';
import { Settings, Building2, Shield, Palette, Save, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Switch from '../../components/ui/Switch';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [obsTicker, setObsTicker] = useState(true);
  const [autoSmsOptIn, setAutoSmsOptIn] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Settings & Configurations
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Manage your organization profile, broadcast themes, and auction compliance rules
          </p>
        </div>

        <Button
          variant="primary"
          icon={saved ? Check : Save}
          onClick={handleSave}
        >
          {saved ? 'Saved Changes!' : 'Save Settings'}
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organisation Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Organisation Profile & Branding</CardTitle>
            <CardDescription>Customized branding across client screens and OBS live overlays</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Organisation Full Name" defaultValue="Mercantile Cricket Association" />
              <Input label="Subdomain Slug" defaultValue="mca-srilanka" disabled helper="Locked for tenant safety" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Primary Brand Color" defaultValue="#0B1323" />
              <Input label="Accent Electric Color" defaultValue="#10EF81" />
            </div>
          </CardContent>
        </Card>

        {/* Cricket Auction Defaults */}
        <Card>
          <CardHeader>
            <CardTitle>Default Cricket Valuation Rules</CardTitle>
            <CardDescription>Standard presets for new tournaments created in this workspace</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Primary Auction Currency"
                options={[
                  { value: 'LKR', label: 'Sri Lankan Rupee (LKR)' },
                  { value: 'PTS', label: 'Points Purse (Equal Points)' },
                  { value: 'USD', label: 'US Dollars (USD)' }
                ]}
                defaultValue="LKR"
              />

              <Input label="Default Starting Purse" defaultValue="10,000,000" />
            </div>

            <div className="pt-2 space-y-3">
              <Switch
                label="Enable Auctioneer Audio Gavel Sounds"
                description="Plays hammer strikes, outbid alerts, and ticking sounds on connected devices"
                checked={soundAlerts}
                onChange={setSoundAlerts}
              />

              <Switch
                label="Enable Real-Time News Ticker on Overlays"
                description="Automatically scrolls recent bids and player records along the bottom of the OBS stream"
                checked={obsTicker}
                onChange={setObsTicker}
              />

              <Switch
                label="Require Explicit PDPA Digital Consent"
                description="Mandatory opt-in checkbox on player registration before sending WhatsApp notifications"
                checked={autoSmsOptIn}
                onChange={setAutoSmsOptIn}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
