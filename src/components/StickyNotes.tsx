import { useState, useEffect } from 'react';
import { Plus, X, Pencil, Check, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  title: string | null;
  content: string;
  color: string;
  created_at: string;
  updated_at: string;
}

const noteColors = [
  { name: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-300 dark:border-yellow-700' },
  { name: 'pink', bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-300 dark:border-pink-700' },
  { name: 'blue', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-300 dark:border-blue-700' },
  { name: 'green', bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-300 dark:border-green-700' },
  { name: 'purple', bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-300 dark:border-purple-700' },
  { name: 'orange', bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-300 dark:border-orange-700' },
];

const getColorClasses = (colorName: string) => {
  return noteColors.find(c => c.name === colorName) || noteColors[0];
};

export const StickyNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: 'yellow' });
  const [editNote, setEditNote] = useState({ title: '', content: '', color: 'yellow' });

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('sticky_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.content.trim()) {
      toast.error('Please write something');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('sticky_notes')
        .insert({
          user_id: user?.id,
          title: newNote.title.trim() || null,
          content: newNote.content.trim(),
          color: newNote.color,
        })
        .select()
        .single();

      if (error) throw error;
      setNotes([data, ...notes]);
      setNewNote({ title: '', content: '', color: 'yellow' });
      setIsAdding(false);
      toast.success('Note added!');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const updateNote = async (id: string) => {
    if (!editNote.content.trim()) {
      toast.error('Note cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('sticky_notes')
        .update({
          title: editNote.title.trim() || null,
          content: editNote.content.trim(),
          color: editNote.color,
        })
        .eq('id', id);

      if (error) throw error;
      setNotes(notes.map(n => n.id === id ? { ...n, ...editNote, title: editNote.title.trim() || null, content: editNote.content.trim() } : n));
      setEditingId(null);
      toast.success('Note updated!');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sticky_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNotes(notes.filter(n => n.id !== id));
      toast.success('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditNote({ title: note.title || '', content: note.content, color: note.color });
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <StickyNote className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Quick Notes</h2>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-24 bg-muted rounded-lg" />
          <div className="h-24 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Quick Notes</h2>
        </div>
        {!isAdding && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="hover:bg-primary/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        )}
      </div>

      {/* Add New Note Form */}
      {isAdding && (
        <div className={cn(
          "rounded-lg border-2 p-4 mb-4 transition-all",
          getColorClasses(newNote.color).bg,
          getColorClasses(newNote.color).border
        )}>
          <Input
            placeholder="Title (optional)"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="mb-2 bg-transparent border-0 border-b border-current/20 rounded-none px-0 focus-visible:ring-0 font-medium"
          />
          <Textarea
            placeholder="Write your thoughts here..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="min-h-[100px] bg-transparent border-0 resize-none focus-visible:ring-0 px-0"
            autoFocus
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              {noteColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setNewNote({ ...newNote, color: color.name })}
                  className={cn(
                    "w-6 h-6 rounded-full transition-transform hover:scale-110",
                    color.bg,
                    "border-2",
                    newNote.color === color.name ? "ring-2 ring-primary ring-offset-2" : ""
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setNewNote({ title: '', content: '', color: 'yellow' }); }}>
                Cancel
              </Button>
              <Button size="sm" onClick={addNote}>
                <Check className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      {notes.length === 0 && !isAdding ? (
        <div className="text-center py-8 text-muted-foreground">
          <StickyNote className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No notes yet. Add your first thought!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {notes.map((note) => {
            const colorClasses = getColorClasses(note.color);
            const isEditing = editingId === note.id;

            return (
              <div
                key={note.id}
                className={cn(
                  "rounded-lg border-2 p-4 transition-all hover:shadow-md group relative",
                  colorClasses.bg,
                  colorClasses.border
                )}
              >
                {isEditing ? (
                  <>
                    <Input
                      placeholder="Title (optional)"
                      value={editNote.title}
                      onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                      className="mb-2 bg-transparent border-0 border-b border-current/20 rounded-none px-0 focus-visible:ring-0 font-medium"
                    />
                    <Textarea
                      value={editNote.content}
                      onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                      className="min-h-[80px] bg-transparent border-0 resize-none focus-visible:ring-0 px-0"
                      autoFocus
                    />
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1">
                        {noteColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => setEditNote({ ...editNote, color: color.name })}
                            className={cn(
                              "w-5 h-5 rounded-full transition-transform hover:scale-110",
                              color.bg,
                              "border-2",
                              editNote.color === color.name ? "ring-2 ring-primary ring-offset-1" : ""
                            )}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => updateNote(note.id)}>
                          <Check className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {note.title && (
                      <h3 className="font-semibold mb-1 pr-16">{note.title}</h3>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words pr-8">{note.content}</p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 hover:bg-black/10"
                        onClick={() => startEdit(note)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 hover:bg-destructive/20 hover:text-destructive"
                        onClick={() => deleteNote(note.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
