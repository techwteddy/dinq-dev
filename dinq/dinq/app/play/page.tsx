'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { PreviewPane } from '@/components/preview/PreviewPane'
import { WorkspaceNav } from '@/components/ui/WorkspaceNav'
import { PromptBar } from '@/components/ui/PromptBar'
import { LoadingOverlay } from '@/components/ui/LoadingOverlay'

const DEFAULT_CODE = `'use client'
import { useState } from 'react'

export default function Welcome() {
  const [clicked, setClicked] = useState(false)
  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-6xl">ድንቅ</div>
        <h1 className="text-4xl font-bold text-white">
          Welcome to{' '}
          <span style={{
            background: 'linear-gradient(135deg,#34d399,#fbbf24)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Dinq.dev
          </span>
        </h1>
        <p className="text-white/50 text-lg">
          Describe what you want to build above ↑
        </p>
        <button
          onClick={() => setClicked(!clicked)}
          className="px-8 py-3 rounded-full font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}
        >
          {clicked ? '🎉 ድንቅ!' : 'Click me'}
        </button>
      </div>
    </div>
  )
}`

function PlayPageInner() {
  const searchParams = useSearchParams()
  const initialPrompt = searchParams.get('prompt') ?? ''
  const initialLang = (searchParams.get('lang') ?? 'en') as 'en' | 'am'

  const [code, setCode] = useState(DEFAULT_CODE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lang, setLang] = useState<'en' | 'am'>(initialLang)
  const [layout, setLayout] = useState<'split' | 'editor' | 'preview'>('split')
  const [generationCount, setGenerationCount] = useState(0)

  // Auto-generate on first load if prompt provided
  useEffect(() => {
    if (initialPrompt && generationCount === 0) {
      generate(initialPrompt, 'build')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const generate = useCallback(async (prompt: string, mode: 'build' | 'edit' | 'explain' = 'build') => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, currentCode: code, mode }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setCode(data.code)
      setGenerationCount(c => c + 1)
    } catch (e: any) {
      setError(e.message ?? 'Generation failed')
    } finally {
      setLoading(false)
    }
  }, [code])

  return (
    <div className="h-screen flex flex-col bg-[#080810] overflow-hidden">
      {/* Top nav */}
      <WorkspaceNav
        lang={lang}
        setLang={setLang}
        layout={layout}
        setLayout={setLayout}
        code={code}
      />

      {/* Prompt bar */}
      <PromptBar lang={lang} onSubmit={generate} loading={loading} />

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Code editor */}
        {(layout === 'split' || layout === 'editor') && (
          <div className={`flex flex-col ${layout === 'split' ? 'w-1/2 border-r border-white/[0.06]' : 'w-full'}`}>
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-[#0a0a14]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
                <div className="w-3 h-3 rounded-full bg-[#34d399]" />
              </div>
              <span className="text-xs text-white/30 ml-2">component.tsx</span>
            </div>
            <CodeEditor value={code} onChange={setCode} />
          </div>
        )}

        {/* Preview pane */}
        {(layout === 'split' || layout === 'preview') && (
          <div className={layout === 'split' ? 'w-1/2' : 'w-full'}>
            <PreviewPane code={code} />
          </div>
        )}

        {/* Loading overlay */}
        {loading && <LoadingOverlay lang={lang} />}
      </div>

      {/* Error bar */}
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-full">
          {error} — <button onClick={() => setError(null)} className="underline">dismiss</button>
        </div>
      )}
    </div>
  )
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading workspace...</div>
      </div>
    }>
      <PlayPageInner />
    </Suspense>
  )
}
