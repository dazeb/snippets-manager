import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpaceForm } from "./SpaceForm";
import { toast } from "sonner";

interface SpaceSelectorProps {
  onSelectSpace: (spaceId: Id<"spaces">) => void;
}

export function SpaceSelector({ onSelectSpace }: SpaceSelectorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const spaces = useQuery(api.spaces.list) || [];
  const removeSpace = useMutation(api.spaces.remove);
  const createDefaultSpace = useMutation(api.spaces.createDefaultSpace);
  const migrateOrphanedSnippets = useMutation(api.spaces.migrateOrphanedSnippets);

  // Auto-create default space if user has no spaces (only on first load)
  useEffect(() => {
    if (spaces.length === 0 && !hasAutoSelected) {
      createDefaultSpace().then((spaceId) => {
        // Migrate any orphaned snippets
        migrateOrphanedSnippets({ spaceId }).then(() => {
          // Don't auto-select the space - let user choose
          setHasAutoSelected(true);
        });
      }).catch(() => {
        // Ignore errors, user can create manually
      });
    }
  }, [spaces.length, createDefaultSpace, migrateOrphanedSnippets, hasAutoSelected]);

  const handleCreateNew = () => {
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
  };

  const handleSave = () => {
    setIsCreating(false);
  };

  const handleDelete = async (spaceId: Id<"spaces">, spaceName: string) => {
    if (!confirm(`Are you sure you want to delete the space "${spaceName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await removeSpace({ id: spaceId });
      toast.success("Space deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete space");
    }
  };

  if (isCreating) {
    return (
      <div className="min-h-[60vh] bg-background">
        <SpaceForm onSave={handleSave} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Spaces</h1>
          <p className="text-lg text-muted-foreground">
            Organize your code snippets into separate workspaces
          </p>
        </div>

        <div className="mb-8">
          <button
            onClick={handleCreateNew}
            className="group relative overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-card/50 hover:bg-card transition-all duration-300 p-6 w-full max-w-sm"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Create New Space
                </div>
                <div className="text-sm text-muted-foreground">
                  Organize your snippets and notes
                </div>
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {spaces.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              {/* Floating elements */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-y-4">
                <div className="w-3 h-3 rounded-full bg-blue-500/20 animate-pulse"></div>
              </div>
              <div className="absolute bottom-4 right-1/2 transform translate-x-8">
                <div className="w-2 h-2 rounded-full bg-green-500/20 animate-pulse delay-300"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Welcome to your workspace</h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
              Create your first space to start organizing your code snippets and notes into separate projects
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Code Snippets</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Notes & Ideas</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {spaces.map((space, index) => (
              <div
                key={space._id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <SpaceCard
                  space={space}
                  onSelect={() => onSelectSpace(space._id)}
                  onDelete={() => handleDelete(space._id, space.name)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SpaceCardProps {
  space: {
    _id: Id<"spaces">;
    name: string;
    description?: string;
    _creationTime: number;
  };
  onSelect: () => void;
  onDelete: () => void;
}

function SpaceCard({ space, onSelect, onDelete }: SpaceCardProps) {
  const contentCounts = useQuery(api.spaces.getContentCounts, { spaceId: space._id }) || { snippets: 0, notes: 0 };
  const totalItems = contentCounts.snippets + contentCounts.notes;

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      onClick={onSelect}
    >
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card hover:bg-accent/5 transition-all duration-300 p-6 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Space Icon */}
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent transition-colors flex-shrink-0">
              <svg className="w-6 h-6 text-muted-foreground group-hover:text-accent-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-card-foreground group-hover:text-foreground transition-colors truncate">
                {space.name}
              </h3>
              {space.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {space.description}
                </p>
              )}
            </div>
          </div>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex-shrink-0"
            title="Delete space"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Stats with Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {contentCounts.snippets > 0 && (
            <Badge variant="secondary" className="text-xs">
              {contentCounts.snippets} snippet{contentCounts.snippets !== 1 ? 's' : ''}
            </Badge>
          )}
          {contentCounts.notes > 0 && (
            <Badge variant="outline" className="text-xs">
              {contentCounts.notes} note{contentCounts.notes !== 1 ? 's' : ''}
            </Badge>
          )}
          {totalItems === 0 && (
            <Badge variant="secondary" className="text-xs text-muted-foreground">
              Empty space
            </Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
          <span>Created {new Date(space._creationTime).toLocaleDateString()}</span>
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Open</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Subtle border highlight on hover */}
        <div className="absolute inset-0 rounded-xl border border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </div>
  );
}
