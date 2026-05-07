'use client'

import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeEditorProps {
  value: string
  onChange: (val: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <MonacoEditor
        height="100%"
        defaultLanguage="typescript"
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? '')}
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'gutter',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          formatOnPaste: true,
          tabSize: 2,
          wordWrap: 'on',
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true },
          // Dark Dinq-themed colors applied via token overrides
          'semanticHighlighting.enabled': true,
        }}
        beforeMount={(monaco) => {
          // Define custom Dinq dark theme
          monaco.editor.defineTheme('dinq-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'keyword',   foreground: '34d399', fontStyle: 'bold' },
              { token: 'string',    foreground: 'fbbf24' },
              { token: 'comment',   foreground: '4a5568', fontStyle: 'italic' },
              { token: 'type',      foreground: '60a5fa' },
              { token: 'function',  foreground: 'e2e8f0' },
              { token: 'variable',  foreground: 'f1f5f9' },
            ],
            colors: {
              'editor.background':              '#080810',
              'editor.foreground':              '#e2e8f0',
              'editorLineNumber.foreground':    '#2d3748',
              'editorLineNumber.activeForeground': '#4a5568',
              'editor.lineHighlightBackground': '#0f0f1a',
              'editor.selectionBackground':     '#34d39930',
              'editorCursor.foreground':        '#34d399',
              'editorIndentGuide.background1':  '#1a1a2e',
              'editor.inactiveSelectionBackground': '#34d39920',
            },
          })
          monaco.editor.setTheme('dinq-dark')
        }}
      />
    </div>
  )
}
