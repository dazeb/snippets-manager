import { lazy, Suspense } from 'react';

// Lazy load the syntax highlighter
const SyntaxHighlighter = lazy(() => 
  import('react-syntax-highlighter').then(module => ({
    default: module.Prism
  }))
);

// Lazy load common language styles
const loadLanguageStyle = (language: string) => {
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
    case 'jsx':
      return import('react-syntax-highlighter/dist/esm/languages/prism/javascript');
    case 'typescript':
    case 'ts':
    case 'tsx':
      return import('react-syntax-highlighter/dist/esm/languages/prism/typescript');
    case 'python':
    case 'py':
      return import('react-syntax-highlighter/dist/esm/languages/prism/python');
    case 'java':
      return import('react-syntax-highlighter/dist/esm/languages/prism/java');
    case 'css':
      return import('react-syntax-highlighter/dist/esm/languages/prism/css');
    case 'html':
      return import('react-syntax-highlighter/dist/esm/languages/prism/markup');
    case 'json':
      return import('react-syntax-highlighter/dist/esm/languages/prism/json');
    case 'bash':
    case 'shell':
      return import('react-syntax-highlighter/dist/esm/languages/prism/bash');
    case 'sql':
      return import('react-syntax-highlighter/dist/esm/languages/prism/sql');
    case 'go':
      return import('react-syntax-highlighter/dist/esm/languages/prism/go');
    case 'rust':
      return import('react-syntax-highlighter/dist/esm/languages/prism/rust');
    case 'php':
      return import('react-syntax-highlighter/dist/esm/languages/prism/php');
    case 'ruby':
      return import('react-syntax-highlighter/dist/esm/languages/prism/ruby');
    case 'c':
      return import('react-syntax-highlighter/dist/esm/languages/prism/c');
    case 'cpp':
    case 'c++':
      return import('react-syntax-highlighter/dist/esm/languages/prism/cpp');
    case 'csharp':
    case 'c#':
      return import('react-syntax-highlighter/dist/esm/languages/prism/csharp');
    default:
      return Promise.resolve();
  }
};

interface LazyCodeHighlighterProps {
  children: string;
  language: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function LazyCodeHighlighter({ 
  children, 
  language, 
  showLineNumbers = true,
  className = ""
}: LazyCodeHighlighterProps) {
  return (
    <Suspense 
      fallback={
        <div className={`bg-muted rounded-lg p-4 font-mono text-sm ${className}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-muted-foreground/20 rounded animate-pulse" />
            <span className="text-muted-foreground text-xs">Loading syntax highlighting...</span>
          </div>
          <pre className="whitespace-pre-wrap text-muted-foreground/70">
            {children}
          </pre>
        </div>
      }
    >
      <LazyHighlighterInner 
        language={language}
        showLineNumbers={showLineNumbers}
        className={className}
      >
        {children}
      </LazyHighlighterInner>
    </Suspense>
  );
}

function LazyHighlighterInner({ 
  children, 
  language, 
  showLineNumbers,
  className 
}: LazyCodeHighlighterProps) {
  // Load the specific language style
  loadLanguageStyle(language);

  return (
    <SyntaxHighlighter
      language={language}
      showLineNumbers={showLineNumbers}
      className={className}
      customStyle={{
        margin: 0,
        padding: '1rem',
        background: 'hsl(var(--muted))',
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
      }}
      lineNumberStyle={{
        color: 'hsl(var(--muted-foreground))',
        opacity: 0.5,
        fontSize: '0.75rem',
        paddingRight: '1rem',
        userSelect: 'none',
      }}
      codeTagProps={{
        style: {
          color: 'hsl(var(--foreground))',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        }
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
}
