import React, { useState } from 'react';
import { ShieldAlert, Plus, Users, Coins, UserCheck, Shield, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

export default function TeamsPage() {
  const [addTeamOpen, setAddTeamOpen] = useState(false);

  const teams = [
    {
      id: 'tm_01',
      name: 'Colombo Kings',
      shortCode: 'CK',
      primaryColor: '#1e40af',
      secondaryColor: '#fbbf24',
      totalPurse: 'LKR 10,000,000',
      spentPurse: 'LKR 6,550,000',
      remainingPurse: 'LKR 3,450,000',
      percentSpent: 65.5,
      slotsFilled: 11,
      maxSlots: 15,
      manager: 'Ranjan Madugalle',
      managerEmail: 'ranjan.owner@colombokings.lk',
      players: ['Pathum Nissanka (Current)', 'Wanindu Hasaranga', 'Lahiru Kumara']
    },
    {
      id: 'tm_02',
      name: 'Kandy Warriors',
      shortCode: 'KW',
      primaryColor: '#b91c1c',
      secondaryColor: '#f97316',
      totalPurse: 'LKR 10,000,000',
      spentPurse: 'LKR 7,100,000',
      remainingPurse: 'LKR 2,900,000',
      percentSpent: 71,
      slotsFilled: 10,
      maxSlots: 15,
      manager: 'Aravinda de Silva',
      managerEmail: 'aravinda@kandywarriors.lk',
      players: ['Kusal Mendis', 'Maheesh Theekshana', 'Avishka Fernando']
    },
    {
      id: 'tm_03',
      name: 'Galle Titans',
      shortCode: 'GT',
      primaryColor: '#047857',
      secondaryColor: '#10b981',
      totalPurse: 'LKR 10,000,000',
      spentPurse: 'LKR 5,800,000',
      remainingPurse: 'LKR 4,200,000',
      percentSpent: 58,
      slotsFilled: 9,
      maxSlots: 15,
      manager: 'Upul Tharanga',
      managerEmail: 'upul@galletitans.lk',
      players: ['Dushmantha Chameera', 'Dasun Shanaka', 'Sadeera Samarawickrama']
    },
    {
      id: 'tm_04',
      name: 'Jaffna Stallions',
      shortCode: 'JS',
      primaryColor: '#6d28d9',
      secondaryColor: '#c084fc',
      totalPurse: 'LKR 10,000,000',
      spentPurse: 'LKR 4,500,000',
      remainingPurse: 'LKR 5,500,000',
      percentSpent: 45,
      slotsFilled: 8,
      maxSlots: 15,
      manager: 'Thilina Kandamby',
      managerEmail: 'thilina@jaffnastallions.lk',
      players: ['Charith Asalanka', 'Matheesha Pathirana', 'Janith Liyanage']
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Franchise Teams
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Track purse depletion, squad roster caps, and designated team bidders
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setAddTeamOpen(true)}
        >
          Add Franchise Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <Card key={team.id} hover className="flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono text-lg text-white shadow-md"
                    style={{ backgroundColor: team.primaryColor }}
                  >
                    {team.shortCode}
                  </div>
                  <div>
                    <CardTitle>{team.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-crick-textMuted">
                        Bidder: <strong className="text-slate-800 dark:text-slate-200">{team.manager}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <Badge variant="lime" size="sm">
                  Active
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Financial Stats */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-crick-surface/80 border border-slate-200 dark:border-crick-border space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Purse Remaining:</span>
                  <span className="font-mono text-base font-black text-emerald-600 dark:text-crick-lime">
                    {team.remainingPurse}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-crick-navy overflow-hidden">
                  <div
                    className="h-full bg-crick-lime rounded-full transition-all duration-300"
                    style={{ width: `${team.percentSpent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-crick-textMuted">
                  <span>Spent: {team.spentPurse} ({team.percentSpent}%)</span>
                  <span>Total: {team.totalPurse}</span>
                </div>
              </div>

              {/* Squad Slots Fill Meter */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-crick-textMuted">Squad Composition:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {team.slotsFilled} / {team.maxSlots} Players Acquired
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-crick-textMuted truncate max-w-[200px]">
                {team.managerEmail}
              </span>
              <Button variant="outline" size="sm">
                View Squad Sheet
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Add Team Modal */}
      <Modal
        isOpen={addTeamOpen}
        onClose={() => setAddTeamOpen(false)}
        title="Add Franchise Team"
        description="Provision team purse and assign designated bidder credentials"
      >
        <form onSubmit={(e) => { e.preventDefault(); setAddTeamOpen(false); }} className="space-y-4">
          <Input label="Team Full Name" required placeholder="e.g. Dambulla Giants" />
          
          <div className="grid grid-cols-2 gap-3">
            <Input label="Short Code" required placeholder="DG" maxLength={4} />
            <Input label="Allocated Purse" required defaultValue="10,000,000" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Designated Bidder Name" required placeholder="Owner or Manager" />
            <Input label="Bidder Email" type="email" required placeholder="manager@team.lk" />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAddTeamOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
