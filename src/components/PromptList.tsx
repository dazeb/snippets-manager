import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";

interface PromptListProps {
  spaceId: Id<"spaces">;
  selectedPrompt?: Doc<"prompts">;
  onSelectPrompt: (prompt: Doc<"prompts">) => void;
  onNewPrompt: () => void;
  searchQuery: string;
  selectedProject: string;
}

export function PromptList({
  spaceId,
  selectedPrompt,
  onSelectPrompt,
  onNewPrompt,
  searchQuery,
  selectedProject,
}: PromptListProps) {
  const prompts = useQuery(api.prompts.list, {
    spaceId,
    search: searchQuery || undefined,
    project: selectedProject || undefined,
  });

  if (!prompts) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading prompts...</p>
        </div>
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-background border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Prompts</h2>
            <button
              onClick={onNewPrompt}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Prompt</span>
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No prompts yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first prompt to get started. Store AI prompts, templates, and reusable content.
            </p>
            <button
              onClick={onNewPrompt}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create First Prompt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Prompts ({prompts.length})
          </h2>
          <button
            onClick={onNewPrompt}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New</span>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {prompts.map((prompt) => (
            <div
              key={prompt._id}
              onClick={() => onSelectPrompt(prompt)}
              className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                selectedPrompt?._id === prompt._id
                  ? "bg-primary/10 border-primary shadow-sm"
                  : "bg-card border-border hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground truncate flex-1 mr-2">
                  {prompt.title}
                </h3>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full flex-shrink-0">
                  🤖
                </span>
              </div>

              {prompt.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {prompt.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  {prompt.project && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                      📁 {prompt.project}
                    </span>
                  )}
                  {prompt.tags.length > 0 && (
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded">
                      #{prompt.tags[0]}{prompt.tags.length > 1 && ` +${prompt.tags.length - 1}`}
                    </span>
                  )}
                </div>
                <span>
                  {new Date(prompt._creationTime).toLocaleDateString()}
                </span>
              </div>

              {/* Content Preview */}
              <div className="mt-2 text-xs text-muted-foreground bg-muted/50 rounded p-2 font-mono">
                <div className="line-clamp-2">
                  {prompt.content.substring(0, 100)}
                  {prompt.content.length > 100 && "..."}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
