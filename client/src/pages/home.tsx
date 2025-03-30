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
    <div className={`min-h-screen font-sans text-gray-800 ${theme === 'dark' ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`shadow ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Mic className="h-6 w-6 text-blue-600" />
            <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Voice Notes</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-gray-100" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
