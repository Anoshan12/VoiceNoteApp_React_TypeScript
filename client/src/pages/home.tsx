import React from 'react';
import { Mic } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Mic className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Voice Notes</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold mb-4">Welcome to Voice Notes App</h2>
          <p className="text-xl text-gray-600 mb-8">
            Record, transcribe, and save your voice notes with ease.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
