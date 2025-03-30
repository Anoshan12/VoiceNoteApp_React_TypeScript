import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Info, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationProps {}

export const Notification: React.FC<NotificationProps> = () => {
  const { toast } = useToast();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'warning' | 'error' | 'loading';
    visible: boolean;
  } | null>(null);

  // Listen for Fetch API errors and other unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      toast({
        title: "Error",
        description: event.message || "An unexpected error occurred",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [toast]);

  // This component uses toast hooks so doesn't need internal notification state
  // We'll return an empty div as the toasts are rendered via the Toaster component

  return <div id="notification-listener"></div>;
};

export const showNotification = (
  message: string, 
  type: 'success' | 'info' | 'warning' | 'error' | 'loading' = 'info'
) => {
  const notification = document.createElement('div');
  notification.className = `fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 
    flex items-center max-w-xs transition-all duration-300 transform`;
  
  const getClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800';
      case 'info':
        return 'bg-blue-50 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800';
      case 'error':
        return 'bg-red-50 text-red-800';
      case 'loading':
        return 'bg-blue-50 text-blue-800';
    }
  };
  
  notification.className += ` ${getClasses()}`;
  
  // Icon
  const iconContainer = document.createElement('div');
  iconContainer.className = 'mr-3';
  
  let iconSvg = '';
  switch (type) {
    case 'success':
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>`;
      break;
    case 'info':
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>`;
      break;
    case 'warning':
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>`;
      break;
    case 'error':
      iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>`;
      break;
    case 'loading':
      iconSvg = `<svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>`;
      break;
  }
  
  iconContainer.innerHTML = iconSvg;
  notification.appendChild(iconContainer);
  
  // Message
  const messageContainer = document.createElement('div');
  const messageText = document.createElement('p');
  messageText.className = 'text-sm font-medium';
  messageText.textContent = message;
  messageContainer.appendChild(messageText);
  notification.appendChild(messageContainer);
  
  // Show the notification
  document.body.appendChild(notification);
  
  // Animate it in
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateY(100%)';
    notification.style.opacity = '0';
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};
