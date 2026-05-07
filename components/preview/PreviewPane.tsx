'use client'

import { useEffect, useRef, useState } from 'react'

interface PreviewPaneProps {
  code: string
}

// Build the full HTML document that renders the React component in the iframe
function buildPreviewHTML(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dinq Preview</title>
  <!-- Tailwind CDN for preview -->
  <script src="https://cdn.tailwindcss.com"><\/script>
  <!-- React + ReactDOM + Babel for in-browser JSX transform -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Noto+Sans+Ethiopic:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; font-family: 'DM Sans', sans-serif; background: #080810; -webkit-font-smoothing: antialiased; }
    #root { min-height: 100vh; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useRef, useCallback, useMemo } = React;

    // Shim 'use client' directive (not needed in browser)
    ${code
      .replace(/^'use client'\s*/m, '')
      .replace(/^"use client"\s*/m, '')
      // Remove next.js specific imports
      .replace(/import.*from\s+['"]next\/.*['"]\s*\n?/g, '')
      // Replace default export with a render call
    }

    const rootEl = document.getElementById('root');
    const root = ReactDOM.createRoot(rootEl);

    // Try to render — wrap in error boundary
    class ErrorBoundary extends React.Component {
      constructor(props) { super(props); this.state = { error: null }; }
      static getDerivedStateFromError(error) { return { error }; }
      render() {
        if (this.state.error) {
          return React.createElement('div', {
            style: { padding: 32, color: '#ef4444', fontFamily: 'monospace', background: '#1a0000', minHeight: '100vh' }
          }, [
            React.createElement('div', { key: 'title', style: { fontSize: 18, marginBottom: 12, color: '#fca5a5' } }, '⚠ Render Error'),
            React.createElement('pre', { key: 'msg', style: { fontSize: 13, whiteSpace: 'pre-wrap', color: '#ef4444' } }, this.state.error.message),
          ]);
        }
        return this.props.children;
      }
    }

    // Find the default export name and render it
    try {
      root.render(
        React.createElement(ErrorBoundary, null,
          React.createElement(
            typeof exports !== 'undefined' && exports.default ? exports.default : window.__DinqComponent__,
            null
          )
        )
      );
    } catch(e) {
      root.render(
        React.createElement('div', {
          style: { padding: 32, color: '#ef4444', fontFamily: 'monospace', background: '#1a0000', minHeight: '100vh' }
        }, e.message)
      );
    }
  <\/script>
  <script>
    // Extract default export for rendering
    // Babel compiles to a module-like scope, so we patch it
    window.__DinqComponent__ = null;
  <\/script>
</body>
</html>`
}

export function PreviewPane({ code }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Debounce code updates to avoid too-frequent re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeRef.current) return
      const doc = iframeRef.current.contentDocument
      if (!doc) return
      doc.open()
      doc.write(buildPreviewHTML(code))
      doc.close()
    }, 600)
    return () => clearTimeout(timer)
  }, [code])

  return (
    <div className="flex flex-col h-full bg-[#080810]">
      {/* Preview header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0a0a14]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-dinq-green animate-pulse" />
          <span className="text-xs text-white/30">Live Preview</span>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          className="text-xs text-white/25 hover:text-white/50 transition-colors px-2 py-1 rounded"
          title="Refresh preview"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Sandboxed iframe */}
      <iframe
        key={refreshKey}
        ref={iframeRef}
        title="Dinq Preview"
        className="flex-1 w-full border-0"
        sandbox="allow-scripts"
        style={{ background: '#080810' }}
      />
    </div>
  )
}
