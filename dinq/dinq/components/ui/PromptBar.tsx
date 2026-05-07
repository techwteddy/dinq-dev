'use client'

import { useState } from 'react'
import { SendHorizontal, Loader2 } from 'lucide-react'

type Mode = 'build' | 'edit' | 'explain'

interface PromptBarProps {
  lang: 'en' | 'am'
  onSubmit: (prompt: string, mode: Mode) => void
  loading: boolean
}

const MODES: { id: Mode; label: string; labelAm: string; color: string }[] = [
  { id: 'build',   label: 'Build',   labelAm: 'ይገንቡ',   color: '#34d399' },
  { id: 'edit',    label: 'Edit',    labelAm: 'ያስተካክሉ', color: '#60a5fa' },
  { id: 'explain', label: 'Explain', labelAm: 'ያብራሩ',  color: '#fbbf24' },
]

export function PromptBar({ lang, onSubmit, loading }: PromptBarProps) {
  const [mode, setMode] = useState<Mode>('build')
  const [prompt, setPrompt] = useState('')

  const submit = () => {
    if (prompt.trim() && !loading) {
      onSubmit(prompt.trim(), mode)
      setPrompt('')
    }
  }

  const currentMode = MODES.find(m => m.id === mode)!

  return (
    <div className="shrink-0 border-b border-white/[0.06] px-4 py-3"
      style={{ background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-3 max-w-4xl mx-auto">
        {/* Mode tabs */}
        <div className="flex gap-1 shrink-0">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
              style={{
                background: mode === m.id ? `${m.color}18` : 'transparent',
                color: mode === m.id ? m.color : 'rgba(255,255,255,0.3)',
                border: `1px solid ${mode === m.id ? `${m.color}40` : 'transparent'}`,
              }}
            >
              {lang === 'am' ? m.labelAm : m.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex-1 relative flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.08]"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') submit() }}
            disabled={loading}
            placeholder={
              lang === 'en'
                ? mode === 'build'   ? 'Describe what to build...'
                : mode === 'edit'    ? 'Describe your changes...'
                :                      'What do you want to understand?'
                : mode === 'build'   ? 'ምን መገንባት ፈለጉ...'
                : mode === 'edit'    ? 'ምን ለውጥ ፈለጉ...'
                :                      'ምን ለመረዳት ፈለጉ...'
            }
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/25"
            style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : undefined }}
          />

          <button
            onClick={submit}
            disabled={!prompt.trim() || loading}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: prompt.trim() && !loading ? currentMode.color : 'rgba(255,255,255,0.07)',
              color: prompt.trim() && !loading ? 'white' : 'rgba(255,255,255,0.2)',
              cursor: prompt.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading
              ? <Loader2 size={14} className="animate-spin" />
              : <SendHorizontal size={14} />
            }
          </button>
        </div>
      </div>
    </div>
  )
}
