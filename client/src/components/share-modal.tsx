import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose,
  content
}) => {
  const [recipient, setRecipient] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'voice'>('text');
  const [voiceType, setVoiceType] = useState('woman');
  const { toast } = useToast();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { 
      recipient: string; 
      content: string;
      messageType: 'text' | 'voice';
      voiceType?: string;
    }) => {
      const response = await apiRequest('POST', '/api/send-message', data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent",
        description: data.message,
        variant: "success",
      });
      onClose();
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = () => {
    // Validate phone number
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(recipient.replace(/\s+/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number in international format (e.g., +1234567890)",
        variant: "destructive",
      });
      return;
    }

    // Prepare data
    const data = {
      recipient: recipient.trim(),
      content,
      messageType,
      ...(messageType === 'voice' && { voiceType }),
    };

    // Send the message
    sendMessageMutation.mutate(data);
  };

  const resetForm = () => {
    setRecipient('');
    setMessageType('text');
    setVoiceType('woman');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Send this note as a voice or text message
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Phone Number</Label>
            <Input
              id="recipient"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Send as</Label>
            <RadioGroup 
              value={messageType} 
              onValueChange={(value) => setMessageType(value as 'text' | 'voice')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text">Text message</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="voice" id="voice" />
                <Label htmlFor="voice">Voice message</Label>
              </div>
            </RadioGroup>
          </div>
          
          {messageType === 'voice' && (
            <div className="space-y-2">
              <Label htmlFor="voiceType">Voice Type</Label>
              <Select 
                value={voiceType} 
                onValueChange={setVoiceType}
              >
                <SelectTrigger id="voiceType">
                  <SelectValue placeholder="Select a voice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woman">Woman</SelectItem>
                  <SelectItem value="man">Man</SelectItem>
                  <SelectItem value="neural">Neural TTS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={sendMessageMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
