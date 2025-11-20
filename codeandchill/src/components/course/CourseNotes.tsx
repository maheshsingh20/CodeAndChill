import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface CourseNotesProps {
  courseId: string;
  currentTime: number;
  onSeekTo: (time: number) => void;
}

export const CourseNotes: React.FC<CourseNotesProps> = ({
  courseId,
  currentTime,
  onSeekTo
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    // Load notes from localStorage or API
    const savedNotes = localStorage.getItem(`notes_${courseId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [courseId]);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${courseId}`, JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (newNoteContent.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        timestamp: currentTime,
        content: newNoteContent.trim(),
        createdAt: new Date()
      };
      const updatedNotes = [...notes, newNote].sort((a, b) => a.timestamp - b.timestamp);
      saveNotes(updatedNotes);
      setNewNoteContent('');
      setIsAdding(false);
    }
  };

  const editNote = (id: string, content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, content } : note
    );
    saveNotes(updatedNotes);
    setEditingId(null);
    setEditContent('');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4 bg-gray-900/50 backdrop-blur-sm border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Course Notes</h3>
        <Button
          onClick={() => setIsAdding(true)}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus size={16} className="mr-1" />
          Add Note
        </Button>
      </div>

      {/* Add New Note */}
      {isAdding && (
        <Card className="p-3 mb-4 bg-gray-800 border-gray-600">
          <div className="flex items-center mb-2">
            <Clock size={14} className="text-purple-400 mr-1" />
            <Badge variant="secondary" className="text-xs">
              {formatTime(currentTime)}
            </Badge>
          </div>
          <Textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Add your note here..."
            className="mb-2 bg-gray-700 border-gray-600 text-white"
            rows={3}
          />
          <div className="flex space-x-2">
            <Button onClick={addNote} size="sm" className="bg-green-600 hover:bg-green-700">
              <Save size={14} className="mr-1" />
              Save
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewNoteContent('');
              }}
              variant="outline"
              size="sm"
            >
              <X size={14} className="mr-1" />
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No notes yet. Add your first note while watching the video!
          </p>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="p-3 bg-gray-800 border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSeekTo(note.timestamp)}
                  className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                >
                  <Clock size={14} className="mr-1" />
                  {formatTime(note.timestamp)}
                </Button>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingId(note.id);
                      setEditContent(note.content);
                    }}
                    className="text-gray-400 hover:text-white p-1 h-auto"
                  >
                    <Edit size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                    className="text-red-400 hover:text-red-300 p-1 h-auto"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>
              
              {editingId === note.id ? (
                <div>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mb-2 bg-gray-700 border-gray-600 text-white"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => editNote(note.id, editContent)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={12} className="mr-1" />
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <X size={12} className="mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {note.content}
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))
        )}
      </div>
    </Card>
  );
};