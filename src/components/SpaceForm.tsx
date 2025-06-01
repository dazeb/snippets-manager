import { useState, useEffect, Suspense } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { LazyIconPicker as IconPicker, ComponentLoader } from "./LazyComponents";
import { toast } from "sonner";

interface SpaceFormProps {
  space?: Doc<"spaces">;
  onSave: () => void;
  onCancel: () => void;
}

export function SpaceForm({ space, onSave, onCancel }: SpaceFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const createSpace = useMutation(api.spaces.create);
  const updateSpace = useMutation(api.spaces.update);

  // Initialize form with existing space data
  useEffect(() => {
    if (space) {
      setName(space.name);
      setDescription(space.description || "");
      setIcon(space.icon || "");
    }
  }, [space]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Space name is required");
      return;
    }

    setIsSaving(true);
    try {
      const spaceData = {
        name: name.trim(),
        description: description.trim() || undefined,
        icon: icon || undefined,
      };

      if (space) {
        // Update existing space
        await updateSpace({
          id: space._id,
          ...spaceData,
        });
        toast.success("Space updated successfully");
      } else {
        // Create new space
        await createSpace(spaceData);
        toast.success("Space created successfully");
      }

      onSave();
    } catch (error) {
      toast.error(space ? "Failed to update space" : "Failed to create space");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-card-foreground mb-6">
          {space ? "Edit Space" : "Create New Space"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Space Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
              placeholder="Enter space name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none transition-colors"
              placeholder="Brief description of this space..."
            />
          </div>

          <Suspense fallback={<ComponentLoader message="Loading icon picker..." />}>
            <IconPicker
              selectedIcon={icon}
              onIconSelect={setIcon}
            />
          </Suspense>

          <div className="flex justify-end space-x-3">
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
              {isSaving
                ? (space ? "Updating..." : "Creating...")
                : (space ? "Update Space" : "Create Space")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
