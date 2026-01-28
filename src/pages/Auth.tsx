import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Orbit, User, Building2, ArrowRight } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { setUserRole, setIsAuthenticated } = useApp();
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      setIsAuthenticated(true);
      navigate(selectedRole === 'candidate' ? '/dashboard' : '/recruiter');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Background elements */}
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
        {/* Logo */}
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
            {/* Candidate Option */}
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
                    selectedRole === 'candidate'
                      ? 'gradient-primary'
                      : 'bg-secondary'
                  }`}
                >
                  <User
                    className={`w-6 h-6 ${
                      selectedRole === 'candidate'
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
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

            {/* Recruiter Option */}
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
                    selectedRole === 'recruiter'
                      ? 'gradient-primary'
                      : 'bg-secondary'
                  }`}
                >
                  <Building2
                    className={`w-6 h-6 ${
                      selectedRole === 'recruiter'
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground'
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

            {/* Continue Button */}
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
