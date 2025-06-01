import { useState, Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SnippetList } from "./SnippetList";
import { SnippetDetail } from "./SnippetDetail";
import { PromptList } from "./PromptList";
import { PromptDetail } from "./PromptDetail";
import {
  LazySnippetForm as SnippetForm,
  LazyPromptForm as PromptForm,
  ComponentLoader
} from "./LazyComponents";
import { SearchAndFilters } from "./SearchAndFilters";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

interface ContentManagerProps {
  spaceId: Id<"spaces">;
  onBackToSpaces: () => void;
}

type ContentType = "snippets" | "prompts";

export function ContentManager({ spaceId, onBackToSpaces }: ContentManagerProps) {
  const [activeTab, setActiveTab] = useState<ContentType>("snippets");
  const [selectedSnippetId, setSelectedSnippetId] = useState<Id<"snippets"> | null>(null);
  const [selectedPromptId, setSelectedPromptId] = useState<Id<"prompts"> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  const space = useQuery(api.spaces.get, { id: spaceId });
  const contentCounts = useQuery(api.spaces.getContentCounts, { spaceId });
  
  const snippets = useQuery(api.snippets.list, {
    spaceId: spaceId,
    search: searchQuery || undefined,
    language: selectedLanguage || undefined,
    project: selectedProject || undefined,
  });

  const prompts = useQuery(api.prompts.list, {
    spaceId: spaceId,
    search: searchQuery || undefined,
    project: selectedProject || undefined,
  });

  const selectedSnippet = useQuery(
    api.snippets.get,
    selectedSnippetId ? { id: selectedSnippetId } : "skip"
  );

  const selectedPrompt = useQuery(
    api.prompts.get,
    selectedPromptId ? { id: selectedPromptId } : "skip"
  );

  const handleCreateNew = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedSnippetId(null);
    setSelectedPromptId(null);
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

  const handleSelectSnippet = (id: Id<"snippets">) => {
    setSelectedSnippetId(id);
    setSelectedPromptId(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleSelectPrompt = (id: Id<"prompts">) => {
    setSelectedPromptId(id);
    setSelectedSnippetId(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setSelectedSnippetId(null);
    setSelectedPromptId(null);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleTabChange = (tab: ContentType) => {
    setActiveTab(tab);
    setSelectedSnippetId(null);
    setSelectedPromptId(null);
    setIsCreating(false);
    setIsEditing(false);
    setSearchQuery("");
    setSelectedLanguage("");
    setSelectedProject("");
  };

  const isShowingForm = isCreating || isEditing;
  const hasSelection = selectedSnippetId || selectedPromptId;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBackToSpaces}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Spaces
            </Button>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold text-card-foreground truncate">{space?.name}</h2>
            {space?.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{space.description}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex mb-4 bg-muted rounded-lg p-1">
            <button
              onClick={() => handleTabChange("snippets")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "snippets"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Snippets ({contentCounts?.snippets || 0})
            </button>
            <button
              onClick={() => handleTabChange("prompts")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "prompts"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Prompts ({contentCounts?.prompts || 0})
            </button>
          </div>

          <Button onClick={handleCreateNew} className="w-full">
            + New {activeTab === "snippets" ? "Snippet" : "Prompt"}
          </Button>
        </div>
        
        <SearchAndFilters
          spaceId={spaceId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          showLanguageFilter={activeTab === "snippets"}
        />

        {activeTab === "snippets" ? (
          <SnippetList
            snippets={snippets || []}
            selectedId={selectedSnippetId}
            onSelect={handleSelectSnippet}
          />
        ) : (
          <PromptList
            spaceId={spaceId}
            selectedPrompt={selectedPrompt || undefined}
            onSelectPrompt={(prompt) => handleSelectPrompt(prompt._id)}
            onNewPrompt={handleCreateNew}
            searchQuery={searchQuery}
            selectedProject={selectedProject}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-muted/30">
        {isShowingForm ? (
          <Suspense fallback={<ComponentLoader message="Loading form..." />}>
            {activeTab === "snippets" ? (
              <SnippetForm
                spaceId={spaceId}
                snippet={isEditing ? selectedSnippet || undefined : undefined}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            ) : (
              <PromptForm
                spaceId={spaceId}
                prompt={isEditing ? selectedPrompt || undefined : undefined}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            )}
          </Suspense>
        ) : hasSelection ? (
          activeTab === "snippets" && selectedSnippet ? (
            <SnippetDetail
              snippet={selectedSnippet}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : activeTab === "prompts" && selectedPrompt ? (
            <PromptDetail
              prompt={selectedPrompt}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : null
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {activeTab === "snippets" ? "📝" : "🤖"}
              </div>
              <p className="text-xl">
                Select a {activeTab === "snippets" ? "snippet" : "prompt"} or create a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
