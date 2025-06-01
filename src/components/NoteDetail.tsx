import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface NoteDetailProps {
  note: Doc<"notes">;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteDetail({ note, onEdit, onDelete }: NoteDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const removeNote = useMutation(api.notes.remove);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      toast.success("Note content copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await removeNote({ id: note._id });
      toast.success("Note deleted successfully");
      onDelete();
    } catch (error) {
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">{note.title}</h1>
            {note.description && (
              <p className="text-muted-foreground">{note.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={handleCopy}
              className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              title="Copy content"
            >
              📋 Copy
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-xs"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-3 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 shadow-xs"
            >
              {isDeleting ? "Deleting..." : "🗑️ Delete"}
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
            📝 Note
          </span>
          {note.project && (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              📁 {note.project}
            </span>
          )}
          <span>Created {new Date(note._creationTime).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        {note.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-muted-foreground">Tags:</span>
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-muted/30">
        <div className="p-6">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-card-foreground leading-relaxed">
                {note.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
