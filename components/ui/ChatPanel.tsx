'use client'

import { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  text: string
}

interface ChatPanelProps {
  lang: 'en' | 'am'
  messages: Message[]
  loading: boolean
  onSend: (message: string) => void
}

export function ChatPanel({ lang, messages, loading, onSend }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = () => {
    if (input.trim() && !loading) {
      onSend(input.trim())
      setInput('')
    }
  }

  return (
    <div className="w-80 shrink-0 flex flex-col border-r border-white/[0.06]" style={{ background: '#09090f' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold font-ethiopic"
          style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}>
          ዲ
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Dinq AI</div>
          <div className="text-[10px] text-white/30">
            {loading 
              ? <span className="text-[#34d399]">thinking...</span> 
              : <span>online</span>
            }
          </div>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-[#34d399] animate-pulse" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-5 h-5 rounded-md shrink-0 mr-2 mt-0.5 flex items-center justify-center text-xs font-bold font-ethiopic"
                style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}>
                ዲ
              </div>
            )}
            <div
              className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed"
              style={{
                background: msg.role === 'user' 
                  ? 'linear-gradient(135deg,#34d399,#059669)' 
                  : 'rgba(255,255,255,0.06)',
                color: msg.role === 'user' ? 'white' : 'rgba(255,255,255,0.85)',
                borderRadius: msg.role === 'user' 
                  ? '18px 18px 4px 18px' 
                  : '18px 18px 18px 4px',
                fontFamily: /[\u1200-\u137F]/.test(msg.text) 
                  ? "'Noto Sans Ethiopic', sans-serif" 
                  : undefined,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-5 h-5 rounded-md shrink-0 mr-2 mt-0.5 flex items-center justify-center text-xs font-bold font-ethiopic"
              style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}>
              ዲ
            </div>
            <div className="px-3 py-2 rounded-2xl text-sm" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '18px 18px 18px 4px' }}>
              <div className="flex gap-1 items-center h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-end gap-2 px-3 py-2 rounded-2xl border border-white/[0.08]"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
            placeholder={lang === 'en' ? 'Ask Dinq AI anything...' : 'ዲንቅ AI ይጠይቁ...'}
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-white/25 resize-none"
            style={{
              maxHeight: 100,
              fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : undefined,
            }}
          />
          <button
            onClick={submit}
            disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-all mb-0.5"
            style={{
              background: input.trim() && !loading ? 'linear-gradient(135deg,#34d399,#059669)' : 'rgba(255,255,255,0.07)',
              color: input.trim() && !loading ? 'white' : 'rgba(255,255,255,0.2)',
            }}
          >
            {loading 
              ? <Loader2 size={12} className="animate-spin" /> 
              : <SendHorizontal size={12} />
            }
          </button>
        </div>
        <p className="text-[10px] text-white/20 text-center mt-2">
          {lang === 'en' ? 'Shift+Enter for new line' : 'Shift+Enter አዲስ መስመር'}
        </p>
      </div>
    </div>
  )
}
