import { useState } from "react";

interface IconPickerProps {
  selectedIcon?: string;
  onIconSelect: (icon: string) => void;
}

const ICON_CATEGORIES = {
  "Work & Projects": ["💼", "📊", "📈", "🎯", "⚡", "🔧", "⚙️", "🛠️", "📋", "📌"],
  "Code & Tech": ["💻", "⌨️", "🖥️", "📱", "🔌", "💾", "🖨️", "📡", "🔍", "🧪"],
  "Documents": ["📝", "📄", "📃", "📑", "📰", "📓", "📔", "📕", "📗", "📘"],
  "Creative": ["🎨", "🖌️", "✏️", "🖊️", "🖍️", "📐", "📏", "🎭", "🎪", "🎨"],
  "Learning": ["📚", "📖", "🎓", "🏫", "✏️", "📝", "🧠", "💡", "🔬", "🧮"],
  "Communication": ["💬", "📢", "📣", "📞", "📧", "✉️", "📮", "📬", "📭", "📫"],
  "Organization": ["📁", "🗂️", "🗃️", "📦", "📤", "📥", "🗄️", "📇", "🏷️", "📎"],
  "Time & Planning": ["⏰", "⏱️", "⏲️", "🕐", "📅", "📆", "🗓️", "⌛", "⏳", "🔔"],
  "Symbols": ["⭐", "🌟", "✨", "🔥", "💎", "🎉", "🎊", "🏆", "🥇", "🎖️"],
  "Nature": ["🌱", "🌿", "🍀", "🌳", "🌲", "🌴", "🌵", "🌾", "🌻", "🌺"],
};

export function IconPicker({ selectedIcon, onIconSelect }: IconPickerProps) {
  const [activeCategory, setActiveCategory] = useState<string>("Work & Projects");

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-foreground mb-2">
        Icon
      </label>
      
      {/* Selected Icon Display */}
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
            {selectedIcon || "📁"}
          </div>
          <div className="text-sm text-muted-foreground">
            {selectedIcon ? "Selected icon" : "Choose an icon for your space"}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {Object.keys(ICON_CATEGORIES).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Icon Grid */}
      <div className="border border-border rounded-lg p-4 bg-muted/30 max-h-48 overflow-y-auto">
        <div className="grid grid-cols-10 gap-2">
          {ICON_CATEGORIES[activeCategory as keyof typeof ICON_CATEGORIES].map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => onIconSelect(icon)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all hover:bg-accent hover:scale-110 ${
                selectedIcon === icon
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "hover:bg-accent"
              }`}
              title={`Select ${icon}`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Selection */}
      {selectedIcon && (
        <button
          type="button"
          onClick={() => onIconSelect("")}
          className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear selection
        </button>
      )}
    </div>
  );
}
