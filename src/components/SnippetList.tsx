import { Doc, Id } from "../../convex/_generated/dataModel";

interface SnippetListProps {
  snippets: Doc<"snippets">[];
  selectedId: Id<"snippets"> | null;
  onSelect: (id: Id<"snippets">) => void;
}

export function SnippetList({ snippets, selectedId, onSelect }: SnippetListProps) {
  if (snippets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
        <div className="text-center">
          <div className="text-4xl mb-2">🔍</div>
          <p>No snippets found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {snippets.map((snippet) => (
        <div
          key={snippet._id}
          onClick={() => onSelect(snippet._id)}
          className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
            selectedId === snippet._id ? "bg-accent border-l-4 border-l-primary" : ""
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-foreground truncate flex-1">{snippet.title}</h3>
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded ml-2 flex-shrink-0">
              {snippet.language}
            </span>
          </div>

          {snippet.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{snippet.description}</p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              {snippet.project && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {snippet.project}
                </span>
              )}
              {snippet.tags.length > 0 && (
                <span className="text-muted-foreground/70">
                  {snippet.tags.slice(0, 2).join(", ")}
                  {snippet.tags.length > 2 && "..."}
                </span>
              )}
            </div>
            <span>{new Date(snippet._creationTime).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
