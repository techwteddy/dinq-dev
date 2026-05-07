'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { PreviewPane } from '@/components/preview/PreviewPane'
import { WorkspaceNav } from '@/components/ui/WorkspaceNav'
import { ChatPanel } from '@/components/ui/ChatPanel'
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
        <p className="text-white/50 text-lg">Chat with Dinq AI to start building →</p>
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
  const [lang, setLang] = useState<'en' | 'am'>(initialLang)
  const [layout, setLayout] = useState<'split' | 'editor' | 'preview'>('split')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: lang === 'en'
      ? "Hi! I'm Dinq AI 👋 Tell me what you want to build — I'll ask questions, plan it with you, and generate the code live."
      : "ሰላም! እኔ ዲንቅ AI ነኝ 👋 ምን መገንባት እንደሚፈልጉ ይንገሩኝ — እጠይቃለሁ፣ እንደ እቅድ እናወጣና ኮዱን በቀጥታ እሰራለሁ።"
    }
  ])
  const [generationCount, setGenerationCount] = useState(0)

  useEffect(() => {
    if (initialPrompt && generationCount === 0) {
      handleChat(initialPrompt)
    }
  }, []) // eslint-disable-line

  const handleChat = useCallback(async (userMessage: string, mode: 'build' | 'edit' | 'explain' = 'build') => {
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      // First get AI planning/response
      const planRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages, currentCode: code, lang }),
      })
      const planData = await planRes.json()
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'ai', text: planData.reply }])

      // If AI decided to generate code, fetch it
      if (planData.shouldGenerate) {
        const codeRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: planData.codePrompt || userMessage, 
            currentCode: code, 
            mode: planData.mode || mode 
          }),
        })
        const codeData = await codeRes.json()
        if (codeData.code) {
          setCode(codeData.code)
          setGenerationCount(c => c + 1)
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }, [messages, code, lang])

  return (
    <div className="h-screen flex flex-col bg-[#080810] overflow-hidden">
      <WorkspaceNav
        lang={lang}
        setLang={setLang}
        layout={layout}
        setLayout={setLayout}
        code={code}
      />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Chat panel — always visible */}
        <ChatPanel
          lang={lang}
          messages={messages}
          loading={loading}
          onSend={handleChat}
        />

        {/* Code editor */}
        {(layout === 'split' || layout === 'editor') && (
          <div className={`flex flex-col ${layout === 'split' ? 'flex-1 border-r border-white/[0.06]' : 'flex-1'}`}>
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
          <div className={layout === 'split' ? 'flex-1' : 'flex-1'}>
            <PreviewPane code={code} />
          </div>
        )}

        {loading && <LoadingOverlay lang={lang} />}
      </div>
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
