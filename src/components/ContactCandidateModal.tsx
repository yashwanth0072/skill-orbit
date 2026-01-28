
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Candidate } from '@/lib/mockData';

interface ContactCandidateModalProps {
    candidate: Candidate | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ContactCandidateModal({ candidate, isOpen, onClose }: ContactCandidateModalProps) {
    const [subject, setSubject] = useState('Interview Invitation');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = () => {
        setIsSending(true);
        // Simulate email sending
        setTimeout(() => {
            setIsSending(false);
            toast({
                title: 'Email Sent',
                description: `Invitation sent to ${candidate?.email}`,
            });
            onClose();
            setMessage('');
        }, 1500);
    };

    if (!candidate) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Contact {candidate.name}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>To</Label>
                        <Input value={candidate.email} disabled />
                    </div>

                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject line..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            className="h-32"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSend} disabled={isSending} className="gap-2">
                        <Send className="w-4 h-4" />
                        {isSending ? 'Sending...' : 'Send Email'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
