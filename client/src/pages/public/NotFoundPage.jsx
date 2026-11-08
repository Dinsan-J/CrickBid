import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-crick-dark text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-crick-surface border border-crick-border flex items-center justify-center shadow-glow-sm mb-6">
        <span className="font-mono text-3xl font-extrabold text-crick-lime">404</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
        Out for a Duck! Page Not Found
      </h1>

      <p className="mt-3 text-sm text-crick-textMuted max-w-md">
        The auction lot or tournament page you are looking for does not exist or has been moved to a different pavilion.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" icon={Home}>
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" icon={ArrowLeft}>
            Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
