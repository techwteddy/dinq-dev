import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPT = `You are Dinq, an expert AI coding assistant built specifically for Ethiopian developers.

Your job is to generate clean, production-quality React components based on user prompts.

RULES:
1. Always return a SINGLE self-contained React component as the default export
2. Use Tailwind CSS for all styling (it is pre-configured)
3. Use only React hooks (useState, useEffect, etc.) — no external libraries unless the user asks
4. Include realistic placeholder data for any lists, tables, or cards
5. If the user mentions Ethiopian context (Telebirr, CBE Birr, Amharic text, etc.), incorporate it naturally
6. Make the UI beautiful — use a dark theme by default unless the user specifies otherwise
7. Add helpful comments in the code
8. The component must be renderable immediately with no missing imports or undefined variables

RESPONSE FORMAT:
Return ONLY the code block, starting with the imports. No explanation before or after. No markdown fences.
Start directly with: import React...  or  'use client'

Example of correct output format:
'use client'
import { useState } from 'react'
export default function MyComponent() { ... }
`

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentCode, mode } = await req.json()

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    // Build the user message based on mode
    let userMessage = ''
    if (mode === 'edit' && currentCode) {
      userMessage = `Here is the current code:\n\`\`\`\n${currentCode}\n\`\`\`\n\nUser request: ${prompt}\n\nModify the code to fulfill this request. Return the complete updated component.`
    } else if (mode === 'explain' && currentCode) {
      userMessage = `Explain this code in simple terms, then suggest 3 improvements:\n\`\`\`\n${currentCode}\n\`\`\``
    } else {
      userMessage = `Build this: ${prompt}`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
    }

    const data = await response.json()
    const rawCode = data.content?.[0]?.text ?? ''

    // Strip any accidental markdown fences
    const code = rawCode
      .replace(/^```(?:tsx?|jsx?|javascript|typescript)?\n?/m, '')
      .replace(/\n?```$/m, '')
      .trim()

    return NextResponse.json({ code })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
