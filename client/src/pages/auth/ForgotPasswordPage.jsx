import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
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
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your registered official email and we'll send you recovery instructions.
            </CardDescription>
          </CardHeader>

          {submitted ? (
            <CardContent className="space-y-4 text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-crick-lime border border-crick-lime/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Recovery link sent
              </h4>
              <p className="text-xs text-slate-500 dark:text-crick-textMuted max-w-xs mx-auto">
                We've sent a password reset link to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. Check your inbox and spam folder.
              </p>
              <div className="pt-4">
                <Link to="/login">
                  <Button variant="primary" className="w-full" icon={ArrowLeft}>
                    Return to sign in
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  required
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@organisation.lk"
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    loading={loading}
                    icon={Send}
                    iconPosition="right"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="justify-center text-xs text-slate-500 dark:text-crick-textMuted">
                Remember your credentials?{' '}
                <Link to="/login" className="font-bold text-emerald-600 dark:text-crick-lime ml-1 hover:underline">
                  Back to login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
