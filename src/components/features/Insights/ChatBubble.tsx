import { MessageCircle } from 'lucide-react'
import Skeleton from 'react-loading-skeleton'

import type { ChatMessage } from '@/services/aiService'

interface ChatBubbleProps {
  message: ChatMessage
}

function MessageParagraph({ children }: { children: string }) {
  return (
    <p className="text-muted-foreground text-sm leading-relaxed">{children}</p>
  )
}

function MessageList({ items }: { items: string[] }) {
  return (
    <ol className="text-muted-foreground ml-6 list-decimal text-sm leading-relaxed">
      {items.map((item, index) => (
        <li key={index} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  )
}

function renderMessageContent(content: string) {
  const cleaned = content.replace(/\*\*/g, '').replace(/[*#_`]/g, '')

  const blocks = cleaned
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  return blocks.map((block, blockIndex) => {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const isList =
      lines.length > 1 && lines.every((line) => line.startsWith('- '))

    if (isList) {
      return (
        <MessageList
          key={blockIndex}
          items={lines.map((line) => line.replace(/^-\s*/, ''))}
        />
      )
    }

    return <MessageParagraph key={blockIndex}>{block}</MessageParagraph>
  })
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <MessageCircle size={13} className="text-primary" />
        <span className="text-foreground text-xs">
          {isUser ? 'Você' : 'Resposta da IA'}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {renderMessageContent(message.content)}
      </div>
    </div>
  )
}

export function ChatTypingBubble() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <MessageCircle size={13} className="text-primary" />
        <span className="text-foreground text-xs">Resposta da IA</span>
      </div>
      <Skeleton
        count={2}
        baseColor="var(--color-skeleton-base)"
        highlightColor="var(--color-skeleton-highlight)"
      />
    </div>
  )
}
