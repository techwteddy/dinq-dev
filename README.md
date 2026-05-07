# Dinq.dev 🇪🇹

> AI-powered development platform for Ethiopian developers.  
> Build anything. Ship fast. In English or Amharic.

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up your API key

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Get your key at: https://console.anthropic.com

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🏗 Project Structure

```
dinq/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Hero landing page
│   ├── play/
│   │   └── page.tsx            # Workspace (editor + preview)
│   └── api/
│       └── generate/
│           └── route.ts        # Claude API route
│
├── components/
│   ├── editor/
│   │   └── CodeEditor.tsx      # Monaco editor (custom Dinq theme)
│   ├── preview/
│   │   └── PreviewPane.tsx     # Sandboxed iframe live preview
│   └── ui/
│       ├── DinqNav.tsx         # Nav + HeroBadge + SuggestionPills + ImportRow
│       ├── ChatInput.tsx       # Hero prompt input with model selector
│       ├── WorkspaceNav.tsx    # Workspace top bar (layout, copy, download)
│       ├── PromptBar.tsx       # Build / Edit / Explain mode bar
│       ├── RayBackground.tsx   # Ethiopian-flag-colored ring background
│       └── LoadingOverlay.tsx  # Animated loading screen
│
├── styles/
│   └── globals.css             # Tailwind + Google Fonts
├── .env.example
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 🚀 Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy — your app will be live at your custom domain

Then point **dinq.dev** to Vercel:
- Add `dinq.dev` as a custom domain in Vercel project settings
- Update your DNS: CNAME → `cname.vercel-dns.com`

---

## 🛠 V1 Feature Roadmap

- [x] Hero landing page (EN + Amharic)
- [x] Monaco code editor with custom Dinq dark theme
- [x] Live preview in sandboxed iframe
- [x] Claude API integration (build / edit / explain modes)
- [x] Copy + download generated code
- [x] Split / editor / preview layout toggle
- [ ] File tree (multi-file projects)
- [ ] Project save & history
- [ ] One-click Vercel deploy button
- [ ] Telebirr / CBE Birr component library
- [ ] Amharic prompt optimization

---

## 🎨 Design Tokens

| Token        | Value       | Usage                   |
|--------------|-------------|-------------------------|
| `dinq-bg`    | `#080810`   | Page background          |
| `dinq-green` | `#34d399`   | Primary accent (green)   |
| `dinq-gold`  | `#fbbf24`   | Secondary accent (gold)  |
| `dinq-red`   | `#ef4444`   | Tertiary accent (red)    |

Colors inspired by the Ethiopian flag 🇪🇹

---

Built with ❤️ for Ethiopian developers · [dinq.dev](https://dinq.dev)
