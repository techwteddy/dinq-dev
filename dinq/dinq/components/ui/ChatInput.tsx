'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Paperclip, Image, FileCode, ChevronDown, Check, SendHorizontal, Lightbulb } from 'lucide-react'

const MODELS = [
  { id: 'dinq-pro',  name: 'Dinq Pro',  desc: 'Best quality',  badge: 'New' },
  { id: 'dinq-fast', name: 'Dinq Fast', desc: 'Quick builds',  badge: null  },
  { id: 'dinq-mini', name: 'Dinq Mini', desc: 'Light & fast',  badge: null  },
]

interface ChatInputProps {
  lang: 'en' | 'am'
  onBuild: (prompt: string) => void
}

export function ChatInput({ lang, onBuild }: ChatInputProps) {
  const [msg, setMsg] = useState('')
  const [attachOpen, setAttachOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const [model, setModel] = useState(MODELS[0])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const attachRef = useRef<HTMLDivElement>(null)
  const modelRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px'
  }, [msg])

  // Close dropdowns on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (attachRef.current && !attachRef.current.contains(e.target as Node)) setAttachOpen(false)
      if (modelRef.current && !modelRef.current.contains(e.target as Node)) setModelOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const submit = useCallback(() => {
    if (msg.trim()) { onBuild(msg.trim()); setMsg('') }
  }, [msg, onBuild])

  const placeholder = lang === 'en'
    ? 'What do you want to build? Ask in English or Amharic...'
    : 'ምን መገንባት ትፈልጋለህ? በአማርኛ ወይም እንግሊዝኛ...'

  const hasMsg = msg.trim().length > 0

  return (
    <div className="relative w-full max-w-2xl">
      {/* Gradient border */}
      <div
        className="absolute inset-[-1px] rounded-[18px] pointer-events-none"
        style={{ background: 'linear-gradient(135deg,rgba(52,211,153,0.28),rgba(251,191,36,0.12),rgba(255,255,255,0.04))' }}
      />
      <div
        className="relative rounded-[18px]"
        style={{ background: 'rgba(16,16,26,0.95)', boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.5)' }}
      >
        <textarea
          ref={textareaRef}
          value={msg}
          onChange={e => setMsg(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent border-none outline-none text-white placeholder-white/25 px-5 pt-5 pb-3 text-[15px] leading-relaxed"
          style={{
            minHeight: 84, maxHeight: 200,
            fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : "'DM Sans', sans-serif",
          }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
          <div className="flex items-center gap-1">
            {/* Attach */}
            <div ref={attachRef} className="relative">
              <button
                onClick={() => { setAttachOpen(o => !o); setModelOpen(false) }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/45 transition-all"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <Plus size={16} style={{ transform: attachOpen ? 'rotate(45deg)' : undefined, transition: 'transform 0.2s' }} />
              </button>
              {attachOpen && (
                <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 rounded-[14px] border border-white/10 overflow-hidden"
                  style={{ background: 'rgba(14,14,22,0.97)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', minWidth: 175, padding: 6 }}>
                  {[
                    { icon: <Paperclip size={13} />, label: 'Upload file' },
                    { icon: <Image size={13} />,     label: 'Add image'  },
                    { icon: <FileCode size={13} />,  label: 'Import code'},
                  ].map((item, i) => (
                    <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm text-white/50 hover:bg-white/[0.06] hover:text-white transition-all text-left">
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Model selector */}
            <div ref={modelRef} className="relative">
              <button
                onClick={() => { setModelOpen(o => !o); setAttachOpen(false) }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/45 hover:text-white transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                {model.name}
                <ChevronDown size={12} style={{ transform: modelOpen ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s' }} />
              </button>
              {modelOpen && (
                <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 rounded-[14px] border border-white/10"
                  style={{ background: 'rgba(14,14,22,0.97)', backdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', minWidth: 200, padding: 6 }}>
                  <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/20">Model</div>
                  {MODELS.map(m => (
                    <button key={m.id} onClick={() => { setModel(m); setModelOpen(false) }}
                      className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-[10px] border-none text-left transition-all ${model.id === m.id ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:bg-white/[0.05] hover:text-white'}`}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {m.name}
                          {m.badge && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>{m.badge}</span>}
                        </div>
                        <div className="text-[11px] text-white/25 mt-0.5">{m.desc}</div>
                      </div>
                      {model.id === m.id && <Check size={13} style={{ color: '#34d399' }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-white/30 hover:text-white/60 transition-colors">
              <Lightbulb size={13} /> Plan
            </button>
            <button
              onClick={submit}
              disabled={!hasMsg}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: hasMsg ? 'linear-gradient(135deg,#34d399,#059669)' : 'rgba(255,255,255,0.07)',
                color: hasMsg ? 'white' : 'rgba(255,255,255,0.2)',
                boxShadow: hasMsg ? '0 0 20px rgba(52,211,153,0.3)' : 'none',
                cursor: hasMsg ? 'pointer' : 'not-allowed',
              }}
            >
              {lang === 'en' ? 'Build now' : <span className="font-ethiopic">ይገንቡ</span>}
              <SendHorizontal size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
