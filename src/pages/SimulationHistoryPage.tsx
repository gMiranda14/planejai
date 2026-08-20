import { useState } from 'react'
import { Inbox } from 'lucide-react'

import { HistoryCard } from '@/components/features/History/HistoryCard'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function SimulationHistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(getAllSimulations)

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir esta simulação? Essa ação não pode ser desfeita.',
    )

    if (!confirmed) {
      return
    }

    deleteSimulation(id)
    setSimulations(getAllSimulations())
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center gap-3 rounded-2xl p-10 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <div className="bg-muted-primary flex h-12 w-12 items-center justify-center rounded-full">
            <Inbox size={22} className="text-primary" />
          </div>
          <p className="text-foreground font-semibold">
            Nenhuma simulação encontrada
          </p>
          <p className="text-muted-foreground text-sm">
            Faça sua primeira simulação para começar a acompanhar seus objetivos
            financeiros.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {simulations.map((simulation) => (
            <HistoryCard
              key={simulation.id}
              simulation={simulation}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  )
}
