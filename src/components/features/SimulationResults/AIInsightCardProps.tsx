import 'react-loading-skeleton/dist/skeleton.css'

import { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'

import { useInsight } from '@/hooks/useInsight'
import { useInsightChat } from '@/hooks/useInsightChat'

import { ChatBubble, ChatTypingBubble } from '../Insights/ChatBubble'
import { ChatInput } from '../Insights/ChatInput'
import { Content } from '../Insights/Content'
import { Error } from '../Insights/Error'
import { Divider } from '../../shared/Divider'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const {
    messages,
    isSending,
    error: chatError,
    sendMessage,
  } = useInsightChat(simulationId, insight)

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current

    if (!scrollContainer) {
      return
    }

    scrollContainer.scrollTop = scrollContainer.scrollHeight
  }, [messages, isSending])

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>
      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}
      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId)
          }}
        />
      )}
      {!isLoading && insight && !error && (
        <>
          <div
            ref={scrollRef}
            className="max-h-93 scrollbar-thin [scrollbar-color:var(--border)_transparent] overflow-y-auto pr-2"
          >
            <Content insight={insight} />

            {messages.length > 0 && (
              <div className="mt-4 flex flex-col">
                {messages.map((message, index) => (
                  <div key={index}>
                    {index === 0 && <Divider spacing={16} />}
                    <ChatBubble message={message} />
                    {index < messages.length - 1 && <Divider spacing={16} />}
                  </div>
                ))}
              </div>
            )}

            {isSending && (
              <div className="mt-4 flex flex-col">
                {messages.length === 0 && <Divider spacing={16} />}
                <ChatTypingBubble />
              </div>
            )}
          </div>

          {chatError && (
            <p className="mt-3 text-xs text-red-500">⚠️ {chatError}</p>
          )}

          <ChatInput onSend={sendMessage} disabled={isSending} />
        </>
      )}
    </div>
  )
}
