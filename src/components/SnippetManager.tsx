import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SnippetList } from "./SnippetList";
import { SnippetDetail } from "./SnippetDetail";
import { SnippetForm } from "./SnippetForm";
import { SearchAndFilters } from "./SearchAndFilters";
import { Id } from "../../convex/_generated/dataModel";

interface SnippetManagerProps {
  spaceId: Id<"spaces">;
  onBackToSpaces: () => void;
}

export function SnippetManager({ spaceId, onBackToSpaces }: SnippetManagerProps) {
  const [selectedSnippetId, setSelectedSnippetId] = useState<Id<"snippets"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const space = useQuery(api.spaces.get, { id: spaceId });
  const snippets = useQuery(api.snippets.list, {
    spaceId: spaceId,
    search: searchQuery || undefined,
    language: selectedLanguage || undefined,
    project: selectedProject || undefined,
  });

  const selectedSnippet = useQuery(
    api.snippets.get,
    selectedSnippetId ? { id: selectedSnippetId } : "skip"
  );

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedSnippetId(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleSelect = (id: Id<"snippets">) => {
    setSelectedSnippetId(id);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setSelectedSnippetId(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBackToSpaces}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Spaces
            </button>
          </div>
          
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900 truncate">{space?.name}</h2>
            {space?.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{space.description}</p>
            )}
          </div>

          <button
            onClick={handleCreateNew}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            + New Snippet
          </button>
        </div>
        
        <SearchAndFilters
          spaceId={spaceId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
        />

        <SnippetList
          snippets={snippets || []}
          selectedId={selectedSnippetId}
          onSelect={handleSelect}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {isCreating || isEditing ? (
          <SnippetForm
            spaceId={spaceId}
            snippet={isEditing ? selectedSnippet || undefined : undefined}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : selectedSnippet ? (
          <SnippetDetail
            snippet={selectedSnippet}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl">Select a snippet or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
