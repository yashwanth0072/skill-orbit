import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { lovable } from '@/integrations/lovable';
import { Orbit, User, Building2, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Auth() {
  const navigate = useNavigate();
  const { setUserRole, setIsAuthenticated } = useApp();
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleContinue = () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      setIsAuthenticated(true);
      navigate(selectedRole === 'candidate' ? '/dashboard' : '/recruiter');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error, redirected } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });

      if (redirected) {
        return;
      }

      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Signed in successfully',
        description: 'Welcome to Skill Orbit!',
      });
    } catch (err) {
      toast({
        title: 'Sign in failed',
        description: err instanceof Error ? err.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
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
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full gap-3 h-12"
            >
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
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or select your role</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('candidate')}
              className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                selectedRole === 'candidate'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40 bg-card'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedRole === 'candidate' ? 'gradient-primary' : 'bg-secondary'
                  }`}
                >
                  <User
                    className={`w-6 h-6 ${
                      selectedRole === 'candidate' ? 'text-primary-foreground' : 'text-muted-foreground'
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
              className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                selectedRole === 'recruiter'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40 bg-card'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedRole === 'recruiter' ? 'gradient-primary' : 'bg-secondary'
                  }`}
                >
                  <Building2
                    className={`w-6 h-6 ${
                      selectedRole === 'recruiter' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg">I'm a Company</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Post job roles and find candidates that match your skill requirements
                  </p>
                </div>
              </div>
            </motion.button>

            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              className="w-full mt-6 gap-2"
              size="lg"
            >
              Continue <ArrowRight className="w-4 h-4" />
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
