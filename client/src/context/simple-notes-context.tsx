import React, { createContext, useContext, useState, useCallback } from 'react';

// Define our own simplified Note type to match the schema
interface SimpleNote {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
}

interface NotesContextType {
  notes: SimpleNote[];
  addNote: (title: string, content: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
}

const initialContext: NotesContextType = {
  notes: [],
  addNote: async () => {},
  deleteNote: async () => {},
};

const NotesContext = createContext<NotesContextType>(initialContext);

export const SimpleNotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<SimpleNote[]>([]);

  // Add a new note
  const addNote = useCallback(async (title: string, content: string) => {
    const newNote: SimpleNote = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date(),
    };
    setNotes(prevNotes => [...prevNotes, newNote]);
  }, []);

  // Delete a note
  const deleteNote = useCallback(async (id: number) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
  }, []);

  const contextValue = {
    notes,
    addNote,
    deleteNote,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);