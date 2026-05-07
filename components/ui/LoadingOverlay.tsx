'use client'

import { useEffect, useState } from 'react'

const MESSAGES = {
  en: ['Thinking...', 'Writing your component...', 'Applying Ethiopian styling...', 'Almost done...'],
  am: ['እያሰበ ነው...', 'ኮምፖነንቱን እየጻፈ ነው...', 'ዲዛይን እየተጨመረ ነው...', 'ሊጠናቀቅ ነው...'],
}

export function LoadingOverlay({ lang }: { lang: 'en' | 'am' }) {
  const [msgIdx, setMsgIdx] = useState(0)
  const msgs = MESSAGES[lang]

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(i => (i + 1) % msgs.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [msgs.length])

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center"
      style={{ background: 'rgba(8,8,16,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="flex flex-col items-center gap-6">
        {/* Spinning ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: '#34d399', borderRightColor: '#fbbf24', animationDuration: '1s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-ethiopic text-xl">
            ዲ
          </div>
        </div>

        {/* Message */}
        <p
          className="text-sm text-white/60 animate-fade-in"
          key={msgIdx}
          style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : undefined }}
        >
          {msgs[msgIdx]}
        </p>
      </div>
    </div>
  )
}
