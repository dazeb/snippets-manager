import { Doc, Id } from "../../convex/_generated/dataModel";

interface NoteListProps {
  notes: Doc<"notes">[];
  selectedId: Id<"notes"> | null;
  onSelect: (id: Id<"notes">) => void;
}

export function NoteList({ notes, selectedId, onSelect }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-4">
        <div className="text-center">
          <div className="text-4xl mb-2">📝</div>
          <p>No notes found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {notes.map((note) => (
        <div
          key={note._id}
          onClick={() => onSelect(note._id)}
          className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors ${
            selectedId === note._id ? "bg-accent border-l-4 border-l-primary" : ""
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-foreground truncate flex-1">{note.title}</h3>
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded ml-2 flex-shrink-0">
              📝 Note
            </span>
          </div>

          {note.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.description}</p>
          )}

          {/* Content preview */}
          <p className="text-sm text-muted-foreground/70 mb-2 line-clamp-2">
            {note.content.substring(0, 100)}
            {note.content.length > 100 && "..."}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              {note.project && (
                <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {note.project}
                </span>
              )}
              {note.tags.length > 0 && (
                <span className="text-muted-foreground/70">
                  {note.tags.slice(0, 2).join(", ")}
                  {note.tags.length > 2 && "..."}
                </span>
              )}
            </div>
            <span>{new Date(note._creationTime).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
