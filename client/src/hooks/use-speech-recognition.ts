import { useState, useEffect, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  isSupported: boolean;
  transcript: string;
  startRecording: () => void;
  stopRecording: () => void;
  resetTranscript: () => void;
  error: string | null;
}

// Define the SpeechRecognition type
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export function useSpeechRecognition({
  onResult,
  onError,
  language = 'en-US',
  continuous = true,
  interimResults = true,
  maxAlternatives = 1,
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  // Reference to the recognition instance
  const recognitionRef = useCallback(() => {
    if (!isSupported) return null;

    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.maxAlternatives = maxAlternatives;
    recognition.lang = language;
    
    // Set up event handlers
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          currentTranscript += result[0].transcript;
        }
      }
      
      if (currentTranscript) {
        setTranscript(prev => {
          const newTranscript = prev ? `${prev} ${currentTranscript}` : currentTranscript;
          if (onResult) onResult(newTranscript);
          return newTranscript;
        });
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = `Speech recognition error: ${event.error} - ${event.message}`;
      setError(errorMessage);
      if (onError) onError(errorMessage);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    return recognition;
  }, [isSupported, continuous, interimResults, maxAlternatives, language, onResult, onError]);

  // Start recording function
  const startRecording = useCallback(() => {
    if (!isSupported) {
      const errorMsg = "Speech recognition is not supported in this browser.";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return;
    }

    const recognition = recognitionRef();
    if (!recognition) return;

    try {
      recognition.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      const errorMsg = `Failed to start speech recognition: ${err instanceof Error ? err.message : String(err)}`;
      setError(errorMsg);
      if (onError) onError(errorMsg);
    }
  }, [isSupported, recognitionRef, onError]);

  // Stop recording function
  const stopRecording = useCallback(() => {
    if (!isSupported) return;

    const recognition = recognitionRef();
    if (!recognition) return;

    try {
      recognition.stop();
      setIsRecording(false);
    } catch (err) {
      console.error("Error stopping recognition:", err);
    }
  }, [isSupported, recognitionRef]);

  // Reset transcript function
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        const recognition = recognitionRef();
        if (recognition) {
          try {
            recognition.stop();
          } catch (err) {
            console.error("Error stopping recognition on cleanup:", err);
          }
        }
      }
    };
  }, [isRecording, recognitionRef]);

  return {
    isRecording,
    isSupported,
    transcript,
    startRecording,
    stopRecording,
    resetTranscript,
    error,
  };
}
