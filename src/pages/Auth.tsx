import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Orbit, User, Building2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const navigate = useNavigate();
  const { userRole, setUserRole, setIsAuthenticated } = useApp();
  // Pre-select based on context (which might come from Landing or localStorage)
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | null>(userRole);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const handleEmailSignIn = async () => {
    if (!selectedRole) {
      toast({ title: 'Please select a role first', variant: 'destructive' });
      return;
    }

    setIsEmailLoading(true);
    setUserRole(selectedRole);
    localStorage.setItem('userRole', selectedRole);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // onAuthStateChange handles the rest
    } catch (err) {
      toast({
        title: 'Login failed',
        description: err instanceof Error ? err.message : 'Invalid credentials',
        variant: 'destructive',
      });
      setIsEmailLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (!selectedRole) {
      toast({ title: 'Please select a role first', variant: 'destructive' });
      return;
    }

    setIsEmailLoading(true);
    setUserRole(selectedRole);
    localStorage.setItem('userRole', selectedRole);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
          }
        }
      });
      if (error) throw error;

      toast({
        title: 'Account created!',
        description: 'Check your email to confirm, or check logs if in test mode.',
      });
    } catch (err) {
      toast({
        title: 'Sign up failed',
        description: err instanceof Error ? err.message : 'Error creating account',
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleContinue = async () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      // Persist role preference before redirecting
      localStorage.setItem('userRole', selectedRole);
      await handleGoogleSignIn();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Note: User will be redirected to Google, so execution might pause/end here.
    } catch (err) {
      console.error('Auth Error:', err);
      toast({
        title: 'Sign in failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 gradient-glow opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="w-full h-full border border-primary/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-12 border border-primary/30 rounded-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Orbit className="w-7 h-7 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl text-foreground">Skill Orbit</span>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-2xl">Welcome!</CardTitle>
            <CardDescription className="text-base">
              Choose how you'd like to use Skill Orbit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('candidate')}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left ${selectedRole === 'candidate'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40 bg-card'
                }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedRole === 'candidate' ? 'gradient-primary' : 'bg-secondary'
                    }`}
                >
                  <User
                    className={`w-6 h-6 ${selectedRole === 'candidate' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">I'm a Candidate</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload your resume, assess your skills, and get matched with opportunities
                  </p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('recruiter')}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left ${selectedRole === 'recruiter'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/40 bg-card'
                }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedRole === 'recruiter' ? 'gradient-primary' : 'bg-secondary'
                    }`}
                >
                  <Building2
                    className={`w-6 h-6 ${selectedRole === 'recruiter' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">I'm a Recruiter</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Post job roles and find candidates that match your skill requirements
                  </p>
                </div>
              </div>
            </motion.button>

            {/* Email Form */}
            <div className="space-y-3 pt-4 border-t border-border">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleEmailSignIn}
                  disabled={!selectedRole || isEmailLoading || isGoogleLoading || !email || !password}
                  className="flex-1"
                  variant="default"
                >
                  {isEmailLoading ? '...' : 'Login'}
                </Button>
                <Button
                  onClick={handleEmailSignUp}
                  disabled={!selectedRole || isEmailLoading || isGoogleLoading || !email || !password}
                  className="flex-1"
                  variant="secondary"
                >
                  Sign Up
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!selectedRole || isGoogleLoading}
              className="w-full mt-6 gap-3 h-12"
              size="lg"
            >
              {isGoogleLoading ? (
                'Signing in...'
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Your skills, your terms. Full control over your profile.
        </p>
      </motion.div>
    </div>
  );
}
