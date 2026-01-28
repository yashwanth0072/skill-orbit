import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Bell, Mail, Eye, EyeOff } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Settings() {
  const { settings, setSettings } = useApp();

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-2xl"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your privacy and notification preferences.
        </p>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Shield className="w-5 h-5 text-primary" />
              Privacy & Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="reverse-hiring" className="text-base font-medium">
                  Reverse Hiring
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow companies to find you based on your skill profile.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {settings.reverseHiringEnabled ? (
                  <Eye className="w-4 h-4 text-success" />
                ) : (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                )}
                <Switch
                  id="reverse-hiring"
                  checked={settings.reverseHiringEnabled}
                  onCheckedChange={(checked) => updateSetting('reverseHiringEnabled', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="bg-secondary/50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">What this means:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • When enabled, your anonymized skill profile is visible to recruiters.
                </li>
                <li>• You'll receive match notifications when eligible for roles.</li>
                <li>• Your identity is only shared when you accept an opportunity.</li>
                <li>• You can disable this at any time.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="opportunity-alerts" className="text-base font-medium">
                  Opportunity Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you're eligible for new roles.
                </p>
              </div>
              <Switch
                id="opportunity-alerts"
                checked={settings.opportunityAlerts}
                onCheckedChange={(checked) => updateSetting('opportunityAlerts', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications" className="text-base font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates and alerts via email.
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
