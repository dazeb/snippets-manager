// Preloader utility for lazy components
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>();

  // Preload components that are likely to be used
  static preloadEssentialComponents() {
    // Preload form components when user is authenticated
    this.preload('SnippetForm', () => import('../components/SnippetForm'));
    this.preload('PromptForm', () => import('../components/PromptForm'));
  }

  static preloadSpaceComponents() {
    // Preload space-related components
    this.preload('SpaceForm', () => import('../components/SpaceForm'));
    this.preload('IconPicker', () => import('../components/IconPicker'));
  }

  static preloadDetailComponents() {
    // Preload detail components when user selects items
    this.preload('SnippetDetail', () => import('../components/SnippetDetail'));
    this.preload('PromptDetail', () => import('../components/PromptDetail'));
  }

  private static preload(name: string, importFn: () => Promise<any>) {
    if (this.preloadedComponents.has(name)) {
      return; // Already preloaded
    }

    // Use requestIdleCallback for non-blocking preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFn().then(() => {
          this.preloadedComponents.add(name);
          console.log(`✅ Preloaded component: ${name}`);
        }).catch((error) => {
          console.warn(`❌ Failed to preload component ${name}:`, error);
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        importFn().then(() => {
          this.preloadedComponents.add(name);
          console.log(`✅ Preloaded component: ${name}`);
        }).catch((error) => {
          console.warn(`❌ Failed to preload component ${name}:`, error);
        });
      }, 100);
    }
  }

  // Preload on user interaction hints
  static preloadOnHover(componentName: string, importFn: () => Promise<any>) {
    return () => {
      if (!this.preloadedComponents.has(componentName)) {
        this.preload(componentName, importFn);
      }
    };
  }

  // Get preload status for debugging
  static getPreloadedComponents() {
    return Array.from(this.preloadedComponents);
  }
}
