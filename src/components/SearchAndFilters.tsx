import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface SearchAndFiltersProps {
  spaceId: Id<"spaces">;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  selectedProject: string;
  onProjectChange: (project: string) => void;
  showLanguageFilter?: boolean;
}

export function SearchAndFilters({
  spaceId,
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  selectedProject,
  onProjectChange,
  showLanguageFilter = true,
}: SearchAndFiltersProps) {
  const languages = useQuery(api.snippets.getLanguages, { spaceId }) || [];
  const snippetProjects = useQuery(api.snippets.getProjects, { spaceId }) || [];
  const noteProjects = useQuery(api.notes.getProjects, { spaceId }) || [];

  // Combine projects from both snippets and notes
  const allProjects = [...new Set([
    ...snippetProjects,
    ...noteProjects
  ])].sort();

  return (
    <div className="p-4 border-b border-border space-y-3">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder={`Search ${showLanguageFilter ? 'snippets' : 'notes'}...`}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
        />
      </div>

      {/* Language Filter - Only show for snippets */}
      {showLanguageFilter && (
        <div>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-sm transition-colors"
          >
            <option value="">All Languages</option>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Project Filter */}
      <div>
        <select
          value={selectedProject}
          onChange={(e) => onProjectChange(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-sm transition-colors"
        >
          <option value="">All Projects</option>
          {allProjects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {(searchQuery || selectedLanguage || selectedProject) && (
        <button
          onClick={() => {
            onSearchChange("");
            onLanguageChange("");
            onProjectChange("");
          }}
          className="w-full text-sm text-muted-foreground hover:text-foreground py-1 transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
