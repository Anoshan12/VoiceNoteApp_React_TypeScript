import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, Copy, Save, Share, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useNotes } from '@/context/simple-notes-context';

interface RecordingSectionProps {
  onShare: (content: string) => void;
}

export const RecordingSection: React.FC<RecordingSectionProps> = ({ onShare }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addNote } = useNotes();

  const {
    isRecording,
    isSupported,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    error
  } = useSpeechRecognition({
    onError: (error) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  });

  const handleToggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      setIsProcessing(true);
      
      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
    } else {
      if (!isSupported) {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        });
        return;
      }
      startRecording();
    }
  };

  const handleClearTranscription = () => {
    resetTranscript();
    toast({
      title: "Success",
      description: "Transcription cleared!",
      variant: "default",
    });
  };

  const handleCopyTranscription = () => {
    if (!transcript) {
      toast({
        title: "Nothing to copy",
        description: "Please record something first!",
        variant: "default",
      });
      return;
    }

    navigator.clipboard.writeText(transcript)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Transcription copied to clipboard.",
          variant: "success",
        });
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to copy text: " + err.message,
          variant: "destructive",
        });
      });
  };

  const handleSaveNote = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty Note",
        description: "Please record something first!",
        variant: "default",
      });
      return;
    }

    // Generate title from first few words
    const words = transcript.trim().split(' ');
    const title = words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');

    try {
      await addNote(title, transcript);
      resetTranscript();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleShareNote = () => {
    if (!transcript.trim()) {
      toast({
        title: "Empty Note",
        description: "Please record something first!",
        variant: "default",
      });
      return;
    }
    
    onShare(transcript);
  };

  return (
    <Card className="mb-8 shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Record Your Note</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Press the button below to start recording your voice note
            </p>
          </div>

          {/* Recording Button Container */}
          <div className="relative mb-8">
            {/* Recording Animation Waves (Only visible when recording) */}
            {isRecording && (
              <>
                <div className="absolute w-20 h-20 rounded-full bg-red-500 bg-opacity-30 animate-ping" style={{ animationDuration: '2s' }}></div>
                <div className="absolute w-24 h-24 rounded-full bg-red-500 bg-opacity-30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
              </>
            )}

            {/* Recording Button */}
            <Button
              onClick={handleToggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-primary hover:bg-primary/90'
              }`}
            >
              <Mic className={`h-6 w-6 text-white ${isRecording ? 'animate-pulse' : ''}`} />
            </Button>
          </div>

          {/* Status Text */}
          <div className="text-center mb-6 h-6">
            {!isRecording && !isProcessing && (
              <p className="text-gray-600 dark:text-gray-400">Click to start recording</p>
            )}
            {isRecording && (
              <p className="text-red-500 font-medium flex items-center justify-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Recording
                <span className="ml-1 animate-pulse">...</span>
              </p>
            )}
            {isProcessing && (
              <p className="text-primary font-medium flex items-center justify-center">
                <svg className="animate-spin h-4 w-4 mr-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing transcript
                <span className="ml-1 animate-pulse">...</span>
              </p>
            )}
          </div>

          {/* Transcription Area */}
          <div className="w-full">
            <label htmlFor="transcription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transcription
            </label>
            <div className="relative">
              <Textarea
                id="transcription"
                ref={textareaRef}
                value={transcript}
                onChange={(e) => {}}
                rows={5}
                className="w-full resize-none focus:ring-primary focus:border-primary"
                placeholder="Your transcribed text will appear here..."
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 p-1 h-8 w-8"
                onClick={handleCopyTranscription}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={handleClearTranscription}
                className="flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button 
                onClick={handleSaveNote}
                className="flex items-center"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </Button>
              <Button 
                variant="default" 
                onClick={handleShareNote}
                className="flex items-center bg-green-600 hover:bg-green-700"
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
