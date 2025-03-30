import React from 'react';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Clipboard, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNotes } from '@/context/notes-context';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NoteCardProps {
  note: {
    id: number;
    title: string;
    content: string;
    createdAt: Date | string;
  };
  onShare: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onShare }) => {
  const { deleteNote, updateNote } = useNotes();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(note.title);
  const [editContent, setEditContent] = React.useState(note.content);

  const formattedDate = format(
    new Date(note.createdAt), 
    'MMM d, yyyy'
  );

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Note copied to clipboard.",
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

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateNote(note.id, editTitle, editContent);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate flex-1">
              {note.title}
            </h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 h-8 w-8" 
                onClick={() => setIsEditDialogOpen(true)}
                title="Edit note"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-gray-400 hover:text-red-500 h-8 w-8" 
                onClick={handleDelete}
                title="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
            {note.content}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-500">
            <span>{formattedDate}</span>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 h-7 w-7" 
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                <Clipboard className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 text-gray-400 hover:text-green-600 h-7 w-7" 
                onClick={onShare}
                title="Share note"
              >
                <Share2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
              <Input
                id="edit-title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Note title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-content" className="text-sm font-medium">Content</label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
                placeholder="Note content"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
