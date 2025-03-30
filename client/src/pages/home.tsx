import React, { useState } from 'react';
import { Mic, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/simple-theme-context';
import { RecordingSection } from '@/components/recording-section';
import { SavedNotesSection } from '@/components/saved-notes-section';
import { ShareModal } from '@/components/share-modal';

const Home: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState('');

  const handleShare = (content: string) => {
    setCurrentContent(content);
    setIsShareModalOpen(true);
  };

  return (
    <div className={`min-h-screen font-sans text-gray-800 ${theme === 'dark' ? 'dark text-gray-100' : ''}`}>
      {/* Header */}
      <header className={`shadow backdrop-blur-md ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-white/90'} sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Mic className="h-6 w-6 text-blue-600" />
            <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Voice Notes
              </span>
            </h1>
          </div>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/70'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 inline-block">
            Voice Notes App
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Record your thoughts, ideas, and reminders with ease using speech-to-text technology
          </p>
        </div>
        <RecordingSection onShare={handleShare} />
        <SavedNotesSection onShare={handleShare} />
      </main>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        content={currentContent}
      />
    </div>
  );
};

export default Home;
