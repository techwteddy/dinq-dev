'use client'

import Link from 'next/link'
import { Monitor, Code2, Columns2, Download, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface WorkspaceNavProps {
  lang: 'en' | 'am'
  setLang: (l: 'en' | 'am') => void
  layout: 'split' | 'editor' | 'preview'
  setLayout: (l: 'split' | 'editor' | 'preview') => void
  code: string
}

export function WorkspaceNav({ lang, setLang, layout, setLayout, code }: WorkspaceNavProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'component.tsx'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#080810] z-20 shrink-0">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="w-7 h-7 rounded-[7px] flex items-center justify-center text-sm font-bold text-white font-ethiopic"
          style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}>
          ዲ
        </div>
        <span className="text-base font-extrabold tracking-tight">
          Dinq<span style={{ color: '#34d399' }}>.dev</span>
        </span>
      </Link>

      {/* Layout toggle */}
      <div className="flex items-center gap-1 p-1 rounded-lg border border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {([
          { id: 'editor',  icon: <Code2 size={14} />,    label: 'Code'    },
          { id: 'split',   icon: <Columns2 size={14} />, label: 'Split'   },
          { id: 'preview', icon: <Monitor size={14} />,  label: 'Preview' },
        ] as const).map(opt => (
          <button
            key={opt.id}
            onClick={() => setLayout(opt.id)}
            title={opt.label}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              background: layout === opt.id ? 'rgba(52,211,153,0.12)' : 'transparent',
              color: layout === opt.id ? '#34d399' : 'rgba(255,255,255,0.35)',
            }}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Lang */}
        <div className="flex rounded-full border border-white/10 overflow-hidden">
          {(['en', 'am'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className="px-3 py-1 text-xs font-semibold transition-all"
              style={{
                background: lang === l ? 'rgba(52,211,153,0.15)' : 'transparent',
                color: lang === l ? '#34d399' : 'rgba(255,255,255,0.35)',
              }}>
              {l === 'en' ? 'EN' : 'አማ'}
            </button>
          ))}
        </div>

        {/* Copy */}
        <button onClick={copy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all">
          {copied ? <Check size={13} style={{ color: '#34d399' }} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>

        {/* Download */}
        <button onClick={download}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all">
          <Download size={13} />
          <span className="hidden sm:inline">Download</span>
        </button>
      </div>
    </header>
  )
}
