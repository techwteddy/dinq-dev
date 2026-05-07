'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DinqNav, HeroBadge, SuggestionPills, ImportRow } from '@/components/ui/DinqNav'
import { RayBackground } from '@/components/ui/RayBackground'
import { ChatInput } from '@/components/ui/ChatInput'

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'am'>('en')
  const router = useRouter()

  const handleBuild = (prompt: string) => {
    const encoded = encodeURIComponent(prompt)
    router.push(`/play?prompt=${encoded}&lang=${lang}`)
  }

  const title =
    lang === 'en'
      ? <>What will you <span className="hero-grad italic">build</span> today?</>
      : <span className="font-ethiopic">ዛሬ ምን <span className="hero-grad">ትገነባለህ?</span></span>

  const subtitle =
    lang === 'en'
      ? 'Describe your app in English or Amharic — Dinq builds it instantly.'
      : <span className="font-ethiopic">በአማርኛ ወይም በእንግሊዝኛ ጠይቅ — ዲንቅ ይሰራዋል።</span>

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#080810] flex flex-col">
      <RayBackground />
      <DinqNav lang={lang} setLang={setLang} />

      <div className="relative z-10 flex justify-center mt-6">
        <HeroBadge lang={lang} />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-8 px-4 mt-10 pb-20">
        <div className="text-center max-w-2xl">
          <h1
            className="text-5xl font-extrabold leading-tight"
            style={{ letterSpacing: lang === 'am' ? '0' : '-1.5px' }}
          >
            {title}
          </h1>
          <p className="mt-4 text-base text-white/40 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <ChatInput lang={lang} onBuild={handleBuild} />
        <SuggestionPills lang={lang} onPick={handleBuild} />
        <ImportRow lang={lang} />
      </main>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080810] to-transparent" />

      <style jsx global>{`
        .hero-grad {
          background: linear-gradient(135deg, #34d399, #fbbf24);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  )
}
