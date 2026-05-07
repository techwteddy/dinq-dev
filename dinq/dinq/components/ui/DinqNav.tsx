'use client'

// ─── DinqNav ──────────────────────────────────────────────────────────────────
interface NavProps {
  lang: 'en' | 'am'
  setLang: (l: 'en' | 'am') => void
}

export function DinqNav({ lang, setLang }: NavProps) {
  return (
    <nav className="relative z-20 flex items-center justify-between px-8 py-5">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg font-bold text-white font-ethiopic"
          style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}
        >
          ዲ
        </div>
        <span className="text-xl font-extrabold tracking-tight">
          Dinq<span style={{ color: '#34d399' }}>.dev</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <div className="flex rounded-full border border-white/10 overflow-hidden">
          {(['en', 'am'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className="px-4 py-1.5 text-xs font-semibold transition-all"
              style={{
                background: lang === l ? 'rgba(52,211,153,0.15)' : 'transparent',
                color: lang === l ? '#34d399' : 'rgba(255,255,255,0.4)',
              }}
            >
              {l === 'en' ? 'EN' : 'አማ'}
            </button>
          ))}
        </div>

        <a
          href="/play"
          className="px-5 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#34d399,#059669)' }}
        >
          {lang === 'en' ? 'Start building' : 'ይጀምሩ'}
        </a>
      </div>
    </nav>
  )
}

// ─── HeroBadge ────────────────────────────────────────────────────────────────
export function HeroBadge({ lang }: { lang: 'en' | 'am' }) {
  return (
    <button
      className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white relative overflow-hidden transition-transform hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))',
        boxShadow: 'inset 0 1px rgba(255,255,255,0.12), 0 0 0 1px rgba(255,255,255,0.07)',
      }}
    >
      {/* shimmer line */}
      <span
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-32"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(52,211,153,0.9),rgba(251,191,36,0.8),transparent)', filter: 'blur(0.5px)' }}
      />
      <span className="font-ethiopic text-base">ድ</span>
      <span>
        {lang === 'en'
          ? 'Introducing Dinq v1 — Built for Ethiopian devs'
          : <span className="font-ethiopic">ዲንቅ v1 — ለኢትዮጵያ ሶፍትዌር ገንቢዎች</span>
        }
      </span>
    </button>
  )
}

// ─── SuggestionPills ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { en: 'Build a Telebirr checkout page',      am: 'Telebirr ክፍያ ፔጅ ይገንቡ'   },
  { en: 'Create an Amharic blog with Next.js', am: 'የአማርኛ ብሎግ ይፍጠሩ'         },
  { en: 'Make a food delivery app UI',         am: 'የምግብ ዲሊቨሪ አፕ UI ይስሩ'    },
  { en: 'Build an e-commerce storefront',      am: 'የኢ-ኮሜርስ ሱቅ ይጀምሩ'        },
  { en: 'Generate a landing page',             am: 'ላንዲንግ ፔጅ ይፍጠሩ'          },
]

interface SuggestionsProps {
  lang: 'en' | 'am'
  onPick: (prompt: string) => void
}

export function SuggestionPills({ lang, onPick }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-2xl w-full">
      {SUGGESTIONS.map((s, i) => (
        <button
          key={i}
          onClick={() => onPick(s.en)}  // always send English to the API
          className="px-4 py-2 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] text-white/50 transition-all hover:bg-[rgba(52,211,153,0.08)] hover:border-[rgba(52,211,153,0.3)] hover:text-white"
          style={{ fontFamily: lang === 'am' ? "'Noto Sans Ethiopic', sans-serif" : undefined }}
        >
          {lang === 'am' ? s.am : s.en}
        </button>
      ))}
    </div>
  )
}

// ─── ImportRow ────────────────────────────────────────────────────────────────
export function ImportRow({ lang }: { lang: 'en' | 'am' }) {
  return (
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <span className="text-sm text-white/25">
        {lang === 'en' ? 'or import from' : <span className="font-ethiopic">ወይም ያስመጡ</span>}
      </span>
      {[
        { label: 'Figma',  icon: '◈' },
        { label: 'GitHub', icon: '⊕' },
      ].map(opt => (
        <button
          key={opt.label}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/[0.04] text-white/40 transition-all hover:bg-white/[0.08] hover:text-white"
        >
          <span>{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  )
}
