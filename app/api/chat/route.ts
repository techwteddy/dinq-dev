import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPT = `You are Dinq AI, an expert coding assistant built specifically for Ethiopian developers.

Your job is to have a natural conversation with the developer, understand what they want to build, and help them build it.

BEHAVIOR:
- Be friendly, concise and helpful
- Ask clarifying questions when the request is vague
- When you have enough info to build something, set shouldGenerate to true
- For greetings or questions, just reply normally without generating code
- Keep replies short — 1-3 sentences max
- If the user writes in Amharic, reply in Amharic
- Reference Ethiopian context naturally (Telebirr, Addis, etc.) when relevant

RESPONSE FORMAT — always return valid JSON:
{
  "reply": "your conversational response",
  "shouldGenerate": true or false,
  "codePrompt": "detailed prompt for code generation if shouldGenerate is true",
  "mode": "build" or "edit" or "explain"
}

Examples:
- User says "hi" → shouldGenerate: false, just greet back
- User says "build a login page" → shouldGenerate: true, codePrompt: "Build a beautiful dark login page with email and password fields using Tailwind CSS"
- User says "make the button green" → shouldGenerate: true, mode: "edit", codePrompt: "Change the button color to green"
- User says "what should I build for a delivery app?" → shouldGenerate: false, ask clarifying questions`

export async function POST(req: NextRequest) {
  try {
    const { message, history, currentCode, lang } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

    // Build conversation history for context
    const historyText = history
      .slice(-6) // last 6 messages for context
      .map((m: { role: string; text: string }) => `${m.role === 'user' ? 'Developer' : 'Dinq AI'}: ${m.text}`)
      .join('\n')

    const fullPrompt = `${SYSTEM_PROMPT}

Conversation so far:
${historyText}

Current code in editor:
${currentCode ? currentCode.slice(0, 500) + '...' : 'No code yet'}

Developer says: ${message}

Respond in JSON format only.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
        }),
      }
    )

    const data = await response.json()
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    
    // Parse JSON response
    const clean = rawText.replace(/^```json\n?/m, '').replace(/\n?```$/m, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json(parsed)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ 
      reply: "Sorry, something went wrong. Please try again.",
      shouldGenerate: false 
    })
  }
}
