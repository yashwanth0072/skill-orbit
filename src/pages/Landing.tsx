import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import {
  Orbit,
  ArrowRight,
  Shield,
  Target,
  Bell,
  CheckCircle,
  Users,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Skill-First Matching',
    description: 'Get matched based on your actual abilities, not just keywords on a resume.',
  },
  {
    icon: Shield,
    title: 'Consent-Driven',
    description: 'You decide when and with whom to share your profile. Full control, always.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: "Get notified only when you're eligible for roles that match your skills.",
  },
  {
    icon: Sparkles,
    title: 'Gap Analysis',
    description: 'Understand exactly what skills you need to develop for your dream role.',
  },
];

const steps = [
  { number: '01', title: 'Assess Your Skills', description: 'Take short, role-specific assessments' },
  { number: '02', title: 'Build Your Profile', description: 'Your skills create your unique profile' },
  { number: '03', title: 'Get Matched', description: 'Receive notifications for eligible roles' },
  { number: '04', title: 'Accept & Connect', description: 'Choose to share your profile with companies' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { setUserRole, setIsAuthenticated } = useApp();

  const handleGetStarted = (role: 'candidate' | 'recruiter') => {
    setUserRole(role);
    setIsAuthenticated(true);
    navigate(role === 'candidate' ? '/dashboard' : '/recruiter');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <Orbit className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">Skill Orbit</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => handleGetStarted('candidate')}>
                For Candidates
              </Button>
              <Button variant="ghost" onClick={() => handleGetStarted('recruiter')}>
                For Recruiters
              </Button>
              <Button onClick={() => handleGetStarted('candidate')} className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 gradient-glow opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full border border-primary/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-8 border border-primary/30 rounded-full"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-20 border border-primary/40 rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              Reverse Recruitment, Reimagined
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6"
            >
              Your Skills,{' '}
              <span className="text-gradient-primary">Your Terms</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              A consent-driven platform where your skills come first. Get assessed, understand your gaps, 
              and get notified when you're eligible for roles—all on your terms.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => handleGetStarted('candidate')}
                className="px-8 py-6 text-lg gap-2"
              >
                Start as Candidate <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleGetStarted('recruiter')}
                className="px-8 py-6 text-lg gap-2"
              >
                <Users className="w-5 h-5" /> I'm a Recruiter
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              Why Choose Skill Orbit?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We flip the traditional hiring model. No more endless applications—let your skills do the talking.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Four simple steps to your next opportunity
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border -z-10">
                    <ChevronRight className="absolute -right-2 -top-2 w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="text-5xl font-display font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-hero rounded-3xl p-12 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of professionals who let their skills speak for themselves.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => handleGetStarted('candidate')}
                className="px-8 py-6 text-lg gap-2 bg-background hover:bg-background/90"
              >
                <CheckCircle className="w-5 h-5" /> Get Started Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Orbit className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">Skill Orbit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Skill Orbit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
