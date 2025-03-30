import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Note } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface NotesContextType {
  notes: Note[];
  isLoading: boolean;
  error: Error | null;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: number, title: string, content: string) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  searchNotes: (query: string) => void;
  filteredNotes: Note[];
  sortOrder: 'desc' | 'asc';
  toggleSortOrder: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const { toast } = useToast();

  // Fetch all notes
  const { data: notes = [], isLoading, error } = useQuery<Note[]>({
    queryKey: ['/api/notes'],
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string }) => {
      const response = await apiRequest('POST', '/api/notes', noteData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      toast({
        title: "Success",
        description: "Note saved successfully!",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save note: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { title: string; content: string } }) => {
      const response = await apiRequest('PATCH', `/api/notes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      toast({
        title: "Success",
        description: "Note updated successfully!",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update note: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      toast({
        title: "Success",
        description: "Note deleted successfully!",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete note: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Filter and sort notes when notes, searchQuery, or sortOrder changes
  useEffect(() => {
    if (!notes) return;

    let filtered = [...notes];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        note => 
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotes(filtered);
  }, [notes, searchQuery, sortOrder]);

  // Add a new note
  const addNote = async (title: string, content: string) => {
    await addNoteMutation.mutateAsync({ title, content });
  };

  // Update an existing note
  const updateNote = async (id: number, title: string, content: string) => {
    await updateNoteMutation.mutateAsync({ id, data: { title, content } });
  };

  // Delete a note
  const deleteNote = async (id: number) => {
    await deleteNoteMutation.mutateAsync(id);
  };

  // Search notes
  const searchNotes = (query: string) => {
    setSearchQuery(query);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <NotesContext.Provider value={{
      notes,
      isLoading,
      error: error as Error | null,
      addNote,
      updateNote,
      deleteNote,
      searchNotes,
      filteredNotes,
      sortOrder,
      toggleSortOrder,
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
