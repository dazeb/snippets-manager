import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTheme } from "@/hooks/useTheme";

// Lazy load syntax highlighter for better code splitting with error handling
const SyntaxHighlighter = lazy(() =>
  import('react-syntax-highlighter/dist/esm/prism').then(module => ({
    default: module.default || module.Prism || module
  })).catch(() =>
    // Fallback to regular import if ESM fails
    import('react-syntax-highlighter').then(module => ({
      default: module.Prism
    }))
  )
);

// Lazy load themes
const loadThemes = () =>
  import('react-syntax-highlighter/dist/esm/styles/prism').then(module => ({
    oneDark: module.oneDark,
    oneLight: module.oneLight
  }));

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [themes, setThemes] = useState<any>(null);
  const { theme } = useTheme();

  // Load themes on component mount
  useEffect(() => {
    loadThemes().then(setThemes);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  // Map common language names to Prism-supported languages
  const getLanguageForPrism = (lang: string): string => {
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'py': 'python',
      'rb': 'ruby',
      'sh': 'bash',
      'shell': 'bash',
      'yml': 'yaml',
      'md': 'markdown',
    };
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  const prismLanguage = getLanguageForPrism(language);
  const syntaxStyle = themes ? (theme === 'dark' ? themes.oneDark : themes.oneLight) : undefined;

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      {/* Code Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1.5 font-mono text-xs">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {language}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {code.split('\n').length} lines
          </span>
        </div>

        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        <Suspense fallback={
          <div className="p-6 flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Loading syntax highlighting...
            </div>
          </div>
        }>
          {syntaxStyle && (
            <SyntaxHighlighter
              language={prismLanguage}
              style={syntaxStyle}
              showLineNumbers={true}
              lineNumberStyle={{
                minWidth: '3em',
                paddingRight: '1em',
                color: theme === 'dark' ? '#6b7280' : '#9ca3af',
                backgroundColor: 'transparent',
                borderRight: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                marginRight: '1em',
                textAlign: 'right',
                userSelect: 'none'
              }}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: 'transparent',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
              }}
              codeTagProps={{
                style: {
                  fontFamily: 'inherit'
                }
              }}
            >
              {code}
            </SyntaxHighlighter>
          )}
          {!syntaxStyle && (
            <div className="p-6">
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-card-foreground">
                <code className="block">{code}</code>
              </pre>
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}
