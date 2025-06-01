import { lazy } from 'react';

// Lazy load heavy components for better code splitting
export const LazyContentManager = lazy(() => 
  import("./ContentManager").then(module => ({ default: module.ContentManager }))
);

export const LazySpaceSelector = lazy(() => 
  import("./SpaceSelector").then(module => ({ default: module.SpaceSelector }))
);

export const LazySnippetForm = lazy(() => 
  import("./SnippetForm").then(module => ({ default: module.SnippetForm }))
);

export const LazyPromptForm = lazy(() => 
  import("./PromptForm").then(module => ({ default: module.PromptForm }))
);

export const LazySnippetDetail = lazy(() => 
  import("./SnippetDetail").then(module => ({ default: module.SnippetDetail }))
);

export const LazyPromptDetail = lazy(() => 
  import("./PromptDetail").then(module => ({ default: module.PromptDetail }))
);

export const LazyIconPicker = lazy(() => 
  import("./IconPicker").then(module => ({ default: module.IconPicker }))
);

export const LazySpaceForm = lazy(() => 
  import("./SpaceForm").then(module => ({ default: module.SpaceForm }))
);

// Loading component for better UX
export const ComponentLoader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-[200px] p-8">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  </div>
);

// Error boundary for lazy components
export const LazyErrorBoundary = ({ children, fallback }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) => (
  <div className="min-h-[200px]">
    {children}
  </div>
);
