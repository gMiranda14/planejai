import { ExternalLink, Goal, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import type { SimulationRecord } from '@/data/simulation'
import { parseCurrency } from '@/utils/currency'
import { calcMonthlySavings } from '@/utils/simulation'

interface HistoryCardProps {
  simulation: SimulationRecord
  onDelete: (id: string) => void
}

function formatCurrency(value: number) {
  return `R$ ${value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(isoDate?: string) {
  if (!isoDate) {
    return ''
  }

  return new Date(isoDate).toLocaleDateString('pt-BR')
}

export function HistoryCard({ simulation, onDelete }: HistoryCardProps) {
  const navigate = useNavigate()

  const monthlySavings = calcMonthlySavings(simulation)

  const metrics = [
    {
      label: 'Custo da meta',
      value: formatCurrency(parseCurrency(simulation.goalAmount)),
    },
    { label: 'Prazo', value: `${simulation.goalDeadline} meses` },
    { label: 'Economia mensal', value: formatCurrency(monthlySavings) },
  ]

  return (
    <div className="bg-card flex flex-col gap-4 rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:flex-row lg:items-center lg:gap-6">
      <div className="flex items-center gap-3 lg:w-64 lg:shrink-0">
        <div className="bg-muted-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Goal size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-foreground font-semibold">{simulation.goalName}</p>
          <p className="text-muted-foreground text-xs">
            {formatDate(simulation.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              {metric.label}
            </p>
            <p className="text-foreground text-sm font-semibold">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <Divider orientation="horizontal" spacing={0} className="lg:hidden" />

      <div className="flex items-center justify-between gap-2 lg:justify-end lg:gap-4">
        <Button
          type="button"
          variant="ghost"
          aria-label={`Excluir simulação ${simulation.goalName}`}
          onClick={() => onDelete(simulation.id)}
          className="text-red-500 hover:text-red-500"
        >
          <Trash2 size={18} />
        </Button>
        <Divider
          orientation="vertical"
          spacing={4}
          className="hidden lg:block"
        />
        <Button
          type="button"
          variant="secondary"
          icon={ExternalLink}
          onClick={() => void navigate(`/resultado/${simulation.id}`)}
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  )
}
