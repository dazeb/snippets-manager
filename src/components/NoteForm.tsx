import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface NoteFormProps {
  spaceId: Id<"spaces">;
  note?: Doc<"notes">;
  onSave: () => void;
  onCancel: () => void;
}

export function NoteForm({ spaceId, note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [project, setProject] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setDescription(note.description || "");
      setTags(note.tags.join(", "));
      setProject(note.project || "");
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsSaving(true);
    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const noteData = {
        title: title.trim(),
        content: content.trim(),
        description: description.trim() || undefined,
        tags: tagArray,
        project: project.trim() || undefined,
      };

      if (note) {
        await updateNote({ id: note._id, ...noteData });
        toast.success("Note updated successfully");
      } else {
        await createNote({ spaceId, ...noteData });
        toast.success("Note created successfully");
      }

      onSave();
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full bg-background">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold text-foreground">
            {note ? "Edit Note" : "Create New Note"}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                placeholder="Enter note title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                placeholder="Brief description of the note..."
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-foreground mb-2">
                Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 min-h-[300px] px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none transition-colors"
                placeholder="Write your note content here..."
                required
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project
              </label>
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                placeholder="Project name (optional)"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                placeholder="Enter tags separated by commas"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple tags with commas (e.g., "idea, todo, important")
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 shadow-xs"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : note ? "Update Note" : "Create Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
