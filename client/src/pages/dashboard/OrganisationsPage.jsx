import React, { useState } from 'react';
import { Building2, Plus, ExternalLink, ShieldCheck, Mail, Phone, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

export default function OrganisationsPage() {
  const [createOrgOpen, setCreateOrgOpen] = useState(false);

  const orgs = [
    {
      id: 'org_01',
      name: 'Mercantile Cricket Association',
      slug: 'mca-srilanka',
      plan: 'MANAGED_ENTERPRISE',
      admin: 'Kusal Mendis',
      email: 'kusal.admin@mca.lk',
      phone: '+94 77 123 4567',
      tournamentsCount: 4,
      status: 'ACTIVE',
      waCredits: 'Unlimited (Managed)'
    },
    {
      id: 'org_02',
      name: 'Colombo Cricket Club',
      slug: 'colombo-cricket-club',
      plan: 'PREMIUM_SAAS',
      admin: 'Mahela Jayawardene',
      email: 'admin@ccc.lk',
      phone: '+94 77 555 1234',
      tournamentsCount: 2,
      status: 'ACTIVE',
      waCredits: '450 remaining'
    },
    {
      id: 'org_03',
      name: 'Ananda College Old Boys Cricket Club',
      slug: 'ananda-oba-cricket',
      plan: 'STANDARD_SAAS',
      admin: 'Arjuna Ranatunga',
      email: 'oba@anandacricket.lk',
      phone: '+94 71 888 9999',
      tournamentsCount: 1,
      status: 'ACTIVE',
      waCredits: '220 remaining'
    },
    {
      id: 'org_04',
      name: 'Kandy District Cricket Association',
      slug: 'kdca-kandy',
      plan: 'FREE_TRIAL',
      admin: 'Kumar Sangakkara',
      email: 'admin@kdca.lk',
      phone: '+94 81 222 3333',
      tournamentsCount: 1,
      status: 'ACTIVE',
      waCredits: '50 remaining'
    }
  ];

  const columns = [
    {
      header: 'Organisation & Subdomain',
      accessor: (row) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">
            {row.name}
          </span>
          <span className="text-[10px] text-crick-lime font-mono">
            {row.slug}.crickbid.lk
          </span>
        </div>
      )
    },
    {
      header: 'SaaS Plan Tier',
      accessor: (row) => (
        <Badge
          variant={
            row.plan === 'MANAGED_ENTERPRISE' ? 'purple' :
            row.plan === 'PREMIUM_SAAS' ? 'lime' : 'neutral'
          }
          size="sm"
        >
          {row.plan.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      header: 'Tournament Admin',
      accessor: (row) => (
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
            {row.admin}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {row.email}
          </span>
        </div>
      )
    },
    {
      header: 'Tournaments',
      accessor: (row) => (
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
          {row.tournamentsCount} Seasons
        </span>
      )
    },
    {
      header: 'WhatsApp Quota',
      accessor: (row) => (
        <span className="text-xs font-semibold text-emerald-600 dark:text-crick-lime">
          {row.waCredits}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge variant="success" size="sm">
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Organisations (Tenants)
            </h1>
            <Badge variant="purple" size="sm">
              Super Admin Only
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Provision, manage, and audit multi-tenant sports clubs and cricket associations
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setCreateOrgOpen(true)}
        >
          Provision New Tenant
        </Button>
      </div>

      <Table
        columns={columns}
        data={orgs}
        searchField="name"
        searchPlaceholder="Search organisation or admin..."
        pageSize={5}
      />

      <Modal
        isOpen={createOrgOpen}
        onClose={() => setCreateOrgOpen(false)}
        title="Provision Organisation Tenant"
        description="Establish an independent multi-tenant cricket organisation workspace"
      >
        <form onSubmit={(e) => { e.preventDefault(); setCreateOrgOpen(false); }} className="space-y-4">
          <Input label="Organisation Name" required placeholder="e.g. Galle Cricket Club" />
          <Input label="Subdomain Slug" required placeholder="galle-cc" helper="Will create galle-cc.crickbid.lk" />
          
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="SaaS Plan Tier"
              options={[
                { value: 'MANAGED_ENTERPRISE', label: 'Managed Enterprise (VIP Event)' },
                { value: 'PREMIUM_SAAS', label: 'Premium SaaS (Self-Service Pro)' },
                { value: 'STANDARD_SAAS', label: 'Standard SaaS' },
                { value: 'FREE_TRIAL', label: 'Free Trial' }
              ]}
            />
            <Input label="Initial WA Credits" type="number" defaultValue="200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Director Full Name" required placeholder="Contact Person" />
            <Input label="Admin Email" type="email" required placeholder="director@club.lk" />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setCreateOrgOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Provision Tenant
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
