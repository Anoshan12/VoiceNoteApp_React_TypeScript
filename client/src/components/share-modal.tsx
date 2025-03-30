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
      <DialogContent className="sm:max-w-md container-blur">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Share Note</DialogTitle>
          <DialogDescription>
            Send this note as a voice or text message
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-gray-700 dark:text-gray-300">Recipient Phone Number</Label>
            <Input
              id="recipient"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-gray-300">Send as</Label>
            <RadioGroup 
              value={messageType} 
              onValueChange={(value) => setMessageType(value as 'text' | 'voice')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-md backdrop-blur-sm">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="cursor-pointer">Text message</Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-md backdrop-blur-sm">
                <RadioGroupItem value="voice" id="voice" />
                <Label htmlFor="voice" className="cursor-pointer">Voice message</Label>
              </div>
            </RadioGroup>
          </div>
          
          {messageType === 'voice' && (
            <div className="space-y-2">
              <Label htmlFor="voiceType" className="text-gray-700 dark:text-gray-300">Voice Type</Label>
              <Select 
                value={voiceType} 
                onValueChange={setVoiceType}
              >
                <SelectTrigger id="voiceType" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <SelectValue placeholder="Select a voice type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
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
            className="border-gray-300 dark:border-gray-600"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={sendMessageMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {sendMessageMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : 'Send'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
