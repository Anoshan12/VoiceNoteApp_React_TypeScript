import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { NoteCard } from '@/components/note-card';
import { useNotes } from '@/context/simple-notes-context';
import { FileText, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavedNotesSectionProps {
  onShare: (content: string) => void;
}

export const SavedNotesSection: React.FC<SavedNotesSectionProps> = ({ onShare }) => {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simple filtering function
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const scrollToRecording = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-white/50 dark:bg-gray-900/50 rounded-lg shadow-md p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Saved Notes</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search notes..."
              className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="card rounded-lg shadow-md p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100/80 dark:bg-gray-700/80 rounded-full p-4 mb-4 backdrop-blur-sm">
              <FileText className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No notes yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Your saved notes will appear here</p>
            <Button onClick={scrollToRecording} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Plus className="mr-2 h-4 w-4" />
              Create your first note
            </Button>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              onShare={() => onShare(note.content)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
