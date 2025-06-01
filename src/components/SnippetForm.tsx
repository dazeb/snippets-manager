import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface SnippetFormProps {
  spaceId: Id<"spaces">;
  snippet?: Doc<"snippets">;
  onSave: () => void;
  onCancel: () => void;
}

const LANGUAGES = [
  "javascript", "typescript", "python", "java", "cpp", "c", "csharp", "php",
  "ruby", "go", "rust", "swift", "kotlin", "scala", "html", "css", "sql",
  "bash", "powershell", "yaml", "json", "xml", "markdown", "other"
];

export function SnippetForm({ spaceId, snippet, onSave, onCancel }: SnippetFormProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [project, setProject] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const createSnippet = useMutation(api.snippets.create);
  const updateSnippet = useMutation(api.snippets.update);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setCode(snippet.code);
      setLanguage(snippet.language);
      setDescription(snippet.description || "");
      setTags(snippet.tags.join(", "));
      setProject(snippet.project || "");
    }
  }, [snippet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !code.trim()) {
      toast.error("Title and code are required");
      return;
    }

    setIsSaving(true);
    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const snippetData = {
        title: title.trim(),
        code: code.trim(),
        language,
        description: description.trim() || undefined,
        tags: tagArray,
        project: project.trim() || undefined,
      };

      if (snippet) {
        await updateSnippet({ id: snippet._id, ...snippetData });
        toast.success("Snippet updated successfully");
      } else {
        await createSnippet({ spaceId, ...snippetData });
        toast.success("Snippet created successfully");
      }

      onSave();
    } catch (error) {
      toast.error("Failed to save snippet");
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
            {snippet ? "Edit Snippet" : "Create New Snippet"}
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
                placeholder="Enter snippet title..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none transition-colors"
                placeholder="Brief description of the snippet..."
              />
            </div>

            {/* Language and Project */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Language *
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  required
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project
                </label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  placeholder="Project name..."
                />
              </div>
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
                placeholder="Enter tags separated by commas..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Code */}
            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-foreground mb-2">
                Code *
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 min-h-[300px] px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring font-mono text-sm resize-none transition-colors"
                placeholder="Paste your code here..."
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-border p-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-secondary-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 shadow-xs"
            >
              {isSaving ? "Saving..." : snippet ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
