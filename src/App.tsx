import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { ThemeToggle } from "./components/ThemeToggle";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useState, useEffect, lazy, Suspense } from "react";
import { Id } from "../convex/_generated/dataModel";
import { useTheme } from "./hooks/useTheme";
import { ComponentPreloader } from "./utils/preloader";

// Import lazy components
import {
  LazyContentManager as ContentManager,
  LazySpaceSelector as SpaceSelector,
  ComponentLoader
} from "./components/LazyComponents";

export default function App() {
  // Initialize theme
  useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-10 bg-card/80 backdrop-blur-sm h-16 flex justify-between items-center border-b border-border shadow-sm px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Code Snippets</h2>
        </div>
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>
      <main className="flex-1">
        <Content />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© 2025 </span>
            <a
              href="https://github.com/dazeb"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              dazeb
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <a
              href="https://convex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Convex
            </a>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

function Content() {
  const [selectedSpaceId, setSelectedSpaceId] = useState<Id<"spaces"> | null>(null);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  // Preload essential components when user is authenticated
  useEffect(() => {
    if (loggedInUser) {
      ComponentPreloader.preloadEssentialComponents();
    }
  }, [loggedInUser]);

  // Reset navigation state when user changes
  useEffect(() => {
    if (loggedInUser === null) {
      setSelectedSpaceId(null);
      setIsNavigatingBack(false);
    }
  }, [loggedInUser]);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSelectSpace = (spaceId: Id<"spaces">) => {
    setIsNavigatingBack(false);
    setSelectedSpaceId(spaceId);
  };

  const handleBackToSpaces = () => {
    setIsNavigatingBack(true);
    setSelectedSpaceId(null);
  };

  return (
    <div className="flex flex-col">
      <Authenticated>
        <ErrorBoundary>
          <Suspense fallback={<ComponentLoader message="Loading content..." />}>
            {selectedSpaceId && !isNavigatingBack ? (
              <ContentManager
                spaceId={selectedSpaceId}
                onBackToSpaces={handleBackToSpaces}
              />
            ) : (
              <SpaceSelector onSelectSpace={handleSelectSpace} />
            )}
          </Suspense>
        </ErrorBoundary>
      </Authenticated>
      <Unauthenticated>
        <div className="flex items-center justify-center py-8 px-4">
          <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Code Snippet Manager</h1>
              <p className="text-lg text-muted-foreground">Organize and manage your code snippets with ease</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
