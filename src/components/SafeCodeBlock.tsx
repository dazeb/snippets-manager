import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SafeCodeBlockProps {
  code: string;
  language: string;
}

export function SafeCodeBlock({ code, language }: SafeCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [syntaxHighlighter, setSyntaxHighlighter] = useState<any>(null);
  const [highlighterError, setHighlighterError] = useState(false);

  // Safely load syntax highlighter
  useEffect(() => {
    let mounted = true;

    const loadHighlighter = async () => {
      try {
        // Try to load the syntax highlighter
        const module = await import('react-syntax-highlighter/dist/esm/prism');
        if (mounted) {
          setSyntaxHighlighter(() => module.default || module.Prism || module);
        }
      } catch (error) {
        console.warn('Failed to load syntax highlighter:', error);
        if (mounted) {
          setHighlighterError(true);
        }
      }
    };

    loadHighlighter();

    return () => {
      mounted = false;
    };
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
        {syntaxHighlighter && !highlighterError ? (
          <syntaxHighlighter
            language={prismLanguage}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: '#6b7280',
              backgroundColor: 'transparent',
              borderRight: '1px solid #374151',
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
          </syntaxHighlighter>
        ) : (
          // Fallback to plain text with line numbers
          <div className="p-6">
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-card-foreground">
              {code.split('\n').map((line, index) => (
                <div key={index} className="flex">
                  <span className="inline-block w-12 text-right pr-4 text-muted-foreground select-none border-r border-border mr-4">
                    {index + 1}
                  </span>
                  <code className="flex-1">{line}</code>
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
