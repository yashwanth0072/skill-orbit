import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Mail, Building2, Globe, Lock } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function RecruiterSettings() {
    const { settings, setSettings } = useApp();
    const [companyName, setCompanyName] = useState('Tech Corp Inc.');
    const [website, setWebsite] = useState('https://techcorp.inc');

    // We can add specific recruiter settings to AppContext later, 
    // for now we'll reuse the structure or just manage local state for demo
    const [notifications, setNotifications] = useState({
        newApplicants: true,
        interviewAcceptance: true,
        weeklyReport: false
    });

    const handleSaveProfile = () => {
        toast({
            title: "Profile Updated",
            description: "Company details have been saved successfully."
        });
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
                <h1 className="font-display text-3xl font-bold text-foreground">Company Settings</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your company profile and hiring preferences.
                </p>
            </motion.div>

            {/* Company Profile */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-display">
                            <Building2 className="w-5 h-5 text-primary" />
                            Company Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="company-name">Company Name</Label>
                            <Input
                                id="company-name"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="website"
                                    className="pl-9"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={handleSaveProfile}>Save Changes</Button>
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
                            Hiring Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="new-applicants" className="text-base font-medium">
                                    New Candidates
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when a candidate applies to your roles.
                                </p>
                            </div>
                            <Switch
                                id="new-applicants"
                                checked={notifications.newApplicants}
                                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, newApplicants: c }))}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Label htmlFor="interview-accepted" className="text-base font-medium">
                                    Interview Responses
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when candidates accept interview requests.
                                </p>
                            </div>
                            <Switch
                                id="interview-accepted"
                                checked={notifications.interviewAcceptance}
                                onCheckedChange={(c) => setNotifications(prev => ({ ...prev, interviewAcceptance: c }))}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security */}
            <motion.div variants={itemVariants}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-display">
                            <Lock className="w-5 h-5 text-primary" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                            Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-left font-normal text-destructive hover:text-destructive">
                            Deactivate Account
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>

        </motion.div>
    );
}
