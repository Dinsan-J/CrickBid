import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    orgName: 'Colombo Cricket Club',
    slug: 'colombo-cricket-club',
    adminName: 'Mahela Jayawardene',
    email: 'admin@ccc.lk',
    phone: '+94 77 555 1234',
    auctionType: 'MONEY',
    password: '',
    confirmPassword: '',
    whatsappConsentAgreed: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'orgName') {
      const generatedSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(ROLES.ORGANISER);
      setLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-crick-dark flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-crick-lime selection:text-crick-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-crick-surface border border-crick-border flex items-center justify-center shadow-glow-sm">
            <span className="font-extrabold text-emerald-400 text-2xl font-mono">CB</span>
          </div>
          <span className="font-black tracking-tight text-slate-900 dark:text-white text-2xl">
            Cricket<span className="text-emerald-400">Bid</span>
          </span>
        </Link>
        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-crick-textMuted">
          Create Tournament Organisation
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Organisation Onboarding</CardTitle>
                <CardDescription>Launch your independent cricket auction portal</CardDescription>
              </div>
              <Badge variant="lime" size="sm">Self-Service SaaS</Badge>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Org Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Organisation Name"
                  required
                  icon={Building2}
                  value={formData.orgName}
                  onChange={(e) => handleChange('orgName', e.target.value)}
                  placeholder="e.g. Mercantile Cricket Association"
                />

                <Input
                  label="Portal Subdomain"
                  required
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  helper={formData.slug ? `${formData.slug}.crickbid.lk` : ''}
                  placeholder="org-slug"
                />
              </div>

              {/* Admin Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Tournament Director Name"
                  required
                  icon={User}
                  value={formData.adminName}
                  onChange={(e) => handleChange('adminName', e.target.value)}
                  placeholder="Full Name"
                />

                <Input
                  label="Official Email"
                  type="email"
                  required
                  icon={Mail}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="admin@organisation.lk"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Sri Lanka Phone (WhatsApp Verified)"
                  type="tel"
                  required
                  icon={Phone}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+94 7X XXX XXXX"
                />

                <Select
                  label="Auction Valuation Model"
                  value={formData.auctionType}
                  onChange={(e) => handleChange('auctionType', e.target.value)}
                  options={[
                    { value: 'MONEY', label: 'Money-Based (Sri Lankan Rupees - LKR)' },
                    { value: 'POINTS', label: 'Points-Based (Fixed Point Purses)' }
                  ]}
                  helper="Can be configured per tournament later"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min 8 characters"
                />

                <Input
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                />
              </div>

              {/* Central WhatsApp Notice & PDPA Consent */}
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>Platform Central WhatsApp Integration</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  CrickBid operates a central verified WhatsApp Business Account for all player notifications. The platform covers delivery costs. Registered players must give explicit digital opt-in consent during registration, and can opt out anytime by replying STOP.
                </p>
                <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={formData.whatsappConsentAgreed}
                    onChange={(e) => handleChange('whatsappConsentAgreed', e.target.checked)}
                    className="mt-0.5 rounded text-crick-lime focus:ring-crick-lime dark:bg-crick-surface border-slate-300 dark:border-crick-border"
                  />
                  <span className="text-[11px] text-slate-700 dark:text-slate-200">
                    I agree to the platform Terms of Service and confirm adherence to Sri Lanka Personal Data Protection Act (PDPA No. 9 of 2022).
                  </span>
                </label>
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
                  Create Organisation & Launch Dashboard
                </Button>
              </div>
            </CardContent>

            <CardFooter className="justify-center text-xs text-slate-500 dark:text-crick-textMuted">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-emerald-600 dark:text-crick-lime ml-1 hover:underline">
                Sign in here
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
