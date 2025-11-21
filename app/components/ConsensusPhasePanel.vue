<template>
  <EventsPanel
    title="Consensus Phases"
    :events="events"
    badge-color="purple"
    :max-display="5"
  >
    <template #summary="{ data }">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-purple-600 dark:text-purple-400">
            {{ getPhaseLabel(data.consensus) }}
          </span>
          <UBadge v-if="data.consensus === 'accepted'" color="green" size="xs">
            Ledger Accepted
          </UBadge>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
          <div v-if="data.ledger_index">
            Ledger Index: <span class="font-mono">{{ data.ledger_index }}</span>
          </div>
          <div v-if="data.ledger_hash">
            Hash: <span class="font-mono text-xs">{{ data.ledger_hash?.substring(0, 16) }}...</span>
          </div>
          <div v-if="data.ledger_time">
            Time: {{ formatLedgerTime(data.ledger_time) }}
          </div>
        </div>
      </div>
    </template>
  </EventsPanel>
</template>

<script setup lang="ts">
import type { ConsensusEvent } from '~/composables/useXrplConsensus'

defineProps<{
  events: ConsensusEvent[]
}>()

const getPhaseLabel = (phase: string) => {
  const labels: Record<string, string> = {
    'open': '🔓 Open',
    'establish': '⚡ Establish',
    'accepted': '✅ Accepted',
  }
  return labels[phase] || phase
}

const formatLedgerTime = (rippleTime: number) => {
  // Convert Ripple epoch (946684800 = Jan 1, 2000) to Unix epoch
  const date = new Date((rippleTime + 946684800) * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
</script>
