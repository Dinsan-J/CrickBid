import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth, ROLES, ROLE_LABELS } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState(ROLES.ORGANISER);
  const [email, setEmail] = useState('kusal.admin@colombocricket.lk');
  const [password, setPassword] = useState('SecurePass123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === ROLES.PLATFORM_ADMIN) setEmail('superadmin@crickbid.com');
    else if (role === ROLES.ORGANISER) setEmail('kusal.admin@colombocricket.lk');
    else if (role === ROLES.AUCTIONEER) setEmail('charu.auctioneer@crickbid.com');
    else if (role === ROLES.TEAM_OWNER) setEmail('ranjan.owner@colombokings.lk');
    else if (role === ROLES.BROADCAST_OPERATOR) setEmail('thilina.stream@crickbid.com');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selectedRole);
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-crick-dark flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-crick-lime selection:text-crick-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-crick-surface border border-crick-border flex items-center justify-center shadow-glow-sm">
            <span className="font-extrabold text-emerald-400 text-2xl font-mono">CB</span>
          </div>
          <span className="font-black tracking-tight text-slate-900 dark:text-white text-2xl">
            Cricket<span className="text-emerald-400">Bid</span>
          </span>
        </Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-crick-textMuted">
          Cricket Auction Management Platform
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>Enter your tournament credentials</CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Role Quick-Select Pill bar for fast testing */}
          <div className="px-6 pt-4 pb-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-crick-textMuted mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Select test role persona:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {Object.keys(ROLES).map((roleKey) => (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleSelect(roleKey)}
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold truncate transition-all text-center ${
                    selectedRole === roleKey
                      ? 'bg-crick-lime text-crick-dark font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-crick-surface text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-crick-card'
                  }`}
                >
                  {ROLE_LABELS[roleKey]}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-4">
              <Input
                label="Email Address"
                type="email"
                required
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organisation.lk"
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-crick-lime focus:ring-crick-lime dark:bg-crick-surface border-slate-300 dark:border-crick-border"
                  />
                  <span className="text-slate-600 dark:text-slate-300">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="font-semibold text-emerald-600 dark:text-crick-lime hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  loading={loading}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Sign In as {ROLE_LABELS[selectedRole]}
                </Button>
              </div>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 dark:text-crick-textMuted">
              Don't have an organisation yet?{' '}
              <Link to="/register" className="font-bold text-emerald-600 dark:text-crick-lime ml-1 hover:underline">
                Register Organisation
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
