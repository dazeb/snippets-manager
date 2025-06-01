import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { toast } from "sonner";

interface PromptDetailProps {
  prompt: Doc<"prompts">;
  onEdit: () => void;
  onDelete: () => void;
}

export function PromptDetail({ prompt, onEdit, onDelete }: PromptDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const removePrompt = useMutation(api.prompts.remove);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success("Prompt content copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy content");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this prompt?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await removePrompt({ id: prompt._id });
      toast.success("Prompt deleted successfully");
      onDelete();
    } catch (error) {
      toast.error("Failed to delete prompt");
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
            <h1 className="text-2xl font-bold text-foreground mb-2">{prompt.title}</h1>
            {prompt.description && (
              <p className="text-muted-foreground">{prompt.description}</p>
            )}
          </div>
          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 disabled:opacity-50 transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
            🤖 Prompt
          </span>
          {prompt.project && (
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              📁 {prompt.project}
            </span>
          )}
          <span>Created {new Date(prompt._creationTime).toLocaleDateString()}</span>
        </div>

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <div className="flex items-center space-x-2 mt-3">
            <span className="text-sm text-muted-foreground">Tags:</span>
            {prompt.tags.map((tag) => (
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
              <div className="whitespace-pre-wrap text-card-foreground leading-relaxed font-mono text-sm">
                {prompt.content}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
