import React from 'react';
import { FileSpreadsheet, Download, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function ReportsPage() {
  const reports = [
    {
      title: 'Official Team Squad Sheets',
      description: 'Formatted tournament match sheets with player designations, acquired prices, and official signatures.',
      type: 'PDF Document',
      icon: FileText,
      badge: 'Official Match Document'
    },
    {
      title: 'Auction Transaction Audit Log',
      description: 'Immutable record of every single gavel strike, bid sequence, timestamps, and bidding team IDs.',
      type: 'CSV Spreadsheet',
      icon: FileSpreadsheet,
      badge: 'Financial Audit'
    },
    {
      title: 'Franchise Financial Balance Summary',
      description: 'Complete breakdown of purse allowances, total spent, penalty deductions, and remaining team balances.',
      type: 'PDF / CSV',
      icon: FileText,
      badge: 'Purse Reconciliation'
    },
    {
      title: 'Unsold & Passed Player Registry',
      description: 'Comprehensive roster of unsold players with base reserve prices for supplementary draft rounds.',
      type: 'CSV Spreadsheet',
      icon: FileSpreadsheet,
      badge: 'Re-Auction Roster'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Reports & Exports
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-crick-textMuted">
            Export broadcast-ready squad lists, financial audit trails, and match day sheets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rpt, idx) => {
          const Icon = rpt.icon;
          return (
            <Card key={idx} hover className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-crick-lime/10 text-crick-lime border border-crick-lime/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="lime" size="sm">
                    {rpt.badge}
                  </Badge>
                </div>
                <CardTitle className="pt-2">{rpt.title}</CardTitle>
                <CardDescription>{rpt.description}</CardDescription>
              </CardHeader>

              <CardFooter className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Format: {rpt.type}
                </span>
                <Button variant="primary" size="sm" icon={Download}>
                  Export File
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
