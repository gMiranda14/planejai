import { Send } from 'lucide-react'
import { useState, type FormEvent } from 'react'

interface ChatInputProps {
  onSend: (question: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [question, setQuestion] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!question.trim() || disabled) {
      return
    }

    onSend(question)
    setQuestion('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
      <div className="bg-input flex-1 rounded-full px-4 py-3 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.15)]">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pergunte algo sobre sua simulação..."
          disabled={disabled}
          className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none disabled:opacity-60"
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !question.trim()}
        aria-label="Enviar pergunta"
        className="bg-primary text-primary-foreground flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send size={18} />
      </button>
    </form>
  )
}
