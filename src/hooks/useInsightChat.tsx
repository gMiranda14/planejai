import { useState } from 'react'

import { buildChatSystemPrompt } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import {
  getChatReply,
  type ChatMessage,
  type InsightData,
} from '@/services/aiService'

export const useInsightChat = (
  simulationId: string,
  insight: InsightData | null,
) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return getFormData(simulationId)?.chatHistory ?? []
  })
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const persistMessages = (chatHistory: ChatMessage[]) => {
    const simulation = getFormData(simulationId)

    if (!simulation) {
      return
    }

    updateSimulation(simulationId, {
      ...simulation,
      chatHistory,
    } as SimulationRecord)
  }

  const sendMessage = async (question: string) => {
    const trimmedQuestion = question.trim()

    if (!trimmedQuestion || !insight || isSending) {
      return
    }

    const simulation = getFormData(simulationId)

    if (!simulation) {
      setError('Simulação não encontrada.')
      return
    }

    const userMessage: ChatMessage = { role: 'user', content: trimmedQuestion }
    const historyWithUserMessage = [...messages, userMessage]

    setMessages(historyWithUserMessage)
    persistMessages(historyWithUserMessage)
    setError(null)
    setIsSending(true)

    try {
      const systemPrompt = buildChatSystemPrompt(simulation, insight)
      const reply = await getChatReply(systemPrompt, historyWithUserMessage)

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: reply,
      }
      const historyWithReply = [...historyWithUserMessage, assistantMessage]

      setMessages(historyWithReply)
      persistMessages(historyWithReply)
    } catch {
      setError('Não foi possível obter uma resposta. Tente novamente.')
    } finally {
      setIsSending(false)
    }
  }

  return { messages, isSending, error, sendMessage }
}
