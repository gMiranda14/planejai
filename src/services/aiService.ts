export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface GroqResponse {
  choices: {
    message: {
      content: string
    }
  }[]
}

const GROQ_API_KEY = String(import.meta.env.VITE_GROQ_API_KEY)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const callGroqAPI = async (
  messages: { role: string; content: string }[],
  jsonMode: boolean,
) => {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      temperature: jsonMode ? 0.2 : 0.5,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Erro retornado pela Groq:', errorText)
    throw new Error(`Erro na requisição: ${response.status} - ${errorText}`)
  }

  return (await response.json()) as GroqResponse
}

export const getInsight = async (prompt: string): Promise<InsightData> => {
  const response = await callGroqAPI(
    [
      {
        role: 'system',
        content:
          'Você é um assistente financeiro especialista. Responda obrigatoriamente e exclusivamente com um objeto JSON válido seguindo a estrutura solicitada.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    true,
  )

  const content = response.choices[0].message.content
  return JSON.parse(content) as InsightData
}

export const getChatReply = async (
  systemPrompt: string,
  history: ChatMessage[],
): Promise<string> => {
  const response = await callGroqAPI(
    [{ role: 'system', content: systemPrompt }, ...history],
    false,
  )

  const content = response.choices[0].message.content

  if (!content) {
    throw new Error('Resposta da IA veio vazia')
  }

  return content
}