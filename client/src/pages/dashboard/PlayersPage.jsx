import React, { useState } from 'react';
import {
  Users,
  Plus,
  Upload,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShieldCheck,
  Search
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function PlayersPage() {
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);

  const playersData = [
    {
      id: 'pl_01',
      lot: '18',
      name: 'Pathum Nissanka',
      regNo: 'REG-2026-001',
      phone: '+94 77 123 4567',
      role: 'TOP_ORDER_BATSMAN',
      roleDisplay: 'Top Order Batsman',
      batting: 'Right Hand',
      bowling: 'Right-Arm Off Spin',
      category: 'ICON',
      basePrice: 'LKR 100,000',
      status: 'UNDER_THE_HAMMER',
      consent: true,
      soldTo: null
    },
    {
      id: 'pl_02',
      lot: '17',
      name: 'Wanindu Hasaranga',
      regNo: 'REG-2026-002',
      phone: '+94 77 987 6543',
      role: 'BOWLING_ALL_ROUNDER',
      roleDisplay: 'Spin All-Rounder',
      batting: 'Right Hand',
      bowling: 'Right-Arm Leg Spin',
      category: 'ICON',
      basePrice: 'LKR 150,000',
      status: 'SOLD',
      consent: true,
      soldTo: 'Kandy Warriors (LKR 1.2M)'
    },
    {
      id: 'pl_03',
      lot: '16',
      name: 'Dushmantha Chameera',
      regNo: 'REG-2026-003',
      phone: '+94 71 456 7890',
      role: 'FAST_BOWLER',
      roleDisplay: 'Fast Bowler',
      batting: 'Right Hand',
      bowling: 'Right-Arm Fast (145kph)',
      category: 'PLATINUM',
      basePrice: 'LKR 80,000',
      status: 'SOLD',
      consent: true,
      soldTo: 'Galle Titans (LKR 650K)'
    },
    {
      id: 'pl_04',
      lot: '15',
      name: 'Charith Asalanka',
      regNo: 'REG-2026-004',
      phone: '+94 75 333 9999',
      role: 'MIDDLE_ORDER_BATSMAN',
      roleDisplay: 'Middle Order Batsman',
      batting: 'Left Hand',
      bowling: 'Right-Arm Off Break',
      category: 'PLATINUM',
      basePrice: 'LKR 80,000',
      status: 'SOLD',
      consent: true,
      soldTo: 'Jaffna Stallions (LKR 750K)'
    },
    {
      id: 'pl_05',
      lot: '19',
      name: 'Kusal Janith Perera',
      regNo: 'REG-2026-005',
      phone: '+94 72 111 2222',
      role: 'WICKET_KEEPER_BATSMAN',
      roleDisplay: 'Wicket-Keeper Batsman',
      batting: 'Left Hand',
      bowling: 'None',
      category: 'PLATINUM',
      basePrice: 'LKR 80,000',
      status: 'SHORTLISTED',
      consent: true,
      soldTo: null
    },
    {
      id: 'pl_06',
      lot: '20',
      name: 'Dunith Wellalage',
      regNo: 'REG-2026-006',
      phone: '+94 77 444 8888',
      role: 'BOWLING_ALL_ROUNDER',
      roleDisplay: 'Slow Left-Arm Orthodox',
      batting: 'Left Hand',
      bowling: 'Left-Arm Orthodox',
      category: 'GOLD',
      basePrice: 'LKR 50,000',
      status: 'SHORTLISTED',
      consent: true,
      soldTo: null
    },
    {
      id: 'pl_07',
      lot: '21',
      name: 'Nuwan Thushara',
      regNo: 'REG-2026-007',
      phone: '+94 76 888 7777',
      role: 'FAST_BOWLER',
      roleDisplay: 'Sling Fast Bowler',
      batting: 'Right Hand',
      bowling: 'Right-Arm Medium Fast',
      category: 'GOLD',
      basePrice: 'LKR 50,000',
      status: 'SHORTLISTED',
      consent: true,
      soldTo: null
    }
  ];

  const columns = [
    {
      header: 'Lot / Reg #',
      accessor: (row) => (
        <div>
          <span className="font-mono text-xs font-black text-crick-lime bg-crick-lime/10 px-2 py-0.5 rounded-lg border border-crick-lime/30">
            #{row.lot}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
            {row.regNo}
          </span>
        </div>
      )
    },
    {
      header: 'Player Name',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            {row.name}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-crick-textMuted">
            {row.batting} • {row.bowling}
          </span>
        </div>
      )
    },
    {
      header: 'Cricket Role',
      accessor: (row) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {row.roleDisplay}
        </span>
      )
    },
    {
      header: 'Category',
      accessor: (row) => (
        <Badge
          variant={
            row.category === 'ICON' ? 'amber' :
            row.category === 'PLATINUM' ? 'purple' : 'lime'
          }
          size="sm"
        >
          {row.category}
        </Badge>
      )
    },
    {
      header: 'Base Price',
      accessor: (row) => (
        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
          {row.basePrice}
        </span>
      )
    },
    {
      header: 'WhatsApp Consent',
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Opted In
          </span>
        </div>
      )
    },
    {
      header: 'Auction Status',
      accessor: (row) => (
        <div>
          <Badge
            variant={
              row.status === 'UNDER_THE_HAMMER' ? 'live' :
              row.status === 'SOLD' ? 'success' : 'neutral'
            }
            size="sm"
            dot={row.status === 'UNDER_THE_HAMMER'}
          >
            {row.status.replace(/_/g, ' ')}
          </Badge>
          {row.soldTo && (
            <span className="text-[10px] text-slate-400 block font-mono mt-0.5 truncate max-w-[140px]">
              {row.soldTo}
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Player Registry
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Verify cricket roles, set base reserves, and monitor WhatsApp opt-in status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            icon={Upload}
            onClick={() => setCsvModalOpen(true)}
          >
            Bulk CSV Upload
          </Button>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setAddPlayerOpen(true)}
          >
            Add Single Player
          </Button>
        </div>
      </div>

      {/* Players Table */}
      <Table
        columns={columns}
        data={playersData}
        searchField="name"
        searchPlaceholder="Search player by name or role..."
        pageSize={6}
      />

      {/* Bulk CSV Modal */}
      <Modal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        title="Bulk CSV Player Upload"
        description="Upload roster CSV with player names, cricket roles, phone numbers, and categories"
      >
        <div className="space-y-4">
          <div className="p-8 border-2 border-dashed border-slate-300 dark:border-crick-border rounded-2xl text-center space-y-3">
            <Upload className="w-10 h-10 text-crick-lime mx-auto" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Drop your CSV file here, or browse
            </div>
            <p className="text-xs text-slate-500 dark:text-crick-textMuted">
              Supports .csv formatted with firstName, lastName, phone, role, category, basePrice
            </p>
            <input type="file" accept=".csv" className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload">
              <Button variant="outline" size="sm" as="span">
                Choose CSV File
              </Button>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a href="#template" className="text-xs text-emerald-600 dark:text-crick-lime hover:underline font-semibold flex items-center gap-1">
              <Download className="w-3.5 h-3.5" /> Download Sample CSV Template
            </a>
            <Button variant="primary" onClick={() => setCsvModalOpen(false)}>
              Import & Validate
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Single Player Modal */}
      <Modal
        isOpen={addPlayerOpen}
        onClose={() => setAddPlayerOpen(false)}
        title="Register Player Profile"
        description="Add cricket player with stats and WhatsApp notification agreement"
      >
        <form onSubmit={(e) => { e.preventDefault(); setAddPlayerOpen(false); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" required placeholder="Pathum" />
            <Input label="Last Name" required placeholder="Nissanka" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone Number (+94)" required placeholder="+94 77 123 4567" helper="For WhatsApp notifications" />
            <Input label="Email Address" type="email" placeholder="player@email.com" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Primary Cricket Role"
              options={[
                { value: 'TOP_ORDER_BATSMAN', label: 'Top Order Batsman' },
                { value: 'MIDDLE_ORDER_BATSMAN', label: 'Middle Order Batsman' },
                { value: 'WICKET_KEEPER_BATSMAN', label: 'Wicket-Keeper Batsman' },
                { value: 'BATTING_ALL_ROUNDER', label: 'Batting All-Rounder' },
                { value: 'BOWLING_ALL_ROUNDER', label: 'Bowling All-Rounder' },
                { value: 'FAST_BOWLER', label: 'Fast Bowler' },
                { value: 'SPIN_BOWLER', label: 'Spin Bowler' }
              ]}
            />

            <Select
              label="Batting Style"
              options={[
                { value: 'RIGHT_HAND', label: 'Right Hand' },
                { value: 'LEFT_HAND', label: 'Left Hand' }
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Auction Category"
              options={[
                { value: 'ICON', label: 'Icon Player' },
                { value: 'PLATINUM', label: 'Platinum' },
                { value: 'GOLD', label: 'Gold' },
                { value: 'SILVER', label: 'Silver' },
                { value: 'EMERGING', label: 'Emerging / U19' }
              ]}
            />
            <Input label="Base Reserve Price" defaultValue="100,000" />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-crick-surface border border-slate-200 dark:border-crick-border text-xs">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="mt-0.5 rounded text-crick-lime focus:ring-crick-lime"
              />
              <span className="text-slate-700 dark:text-slate-200 font-medium">
                Player has given written/digital consent to receive WhatsApp notifications under Sri Lanka PDPA regulations.
              </span>
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAddPlayerOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Player Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
