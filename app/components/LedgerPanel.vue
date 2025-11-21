<template>
  <EventsPanel
    title="Ledgers"
    :events="events"
    badge-color="blue"
    :max-display="5"
  >
    <template #summary="{ data }">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-blue-600 dark:text-blue-400">
            🔐 Ledger Closed
          </span>
          <UBadge v-if="data.validated_ledgers" color="blue" size="xs">
            Validated
          </UBadge>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
          <div v-if="data.ledger_index">
            Ledger Index: <span class="font-mono">{{ data.ledger_index }}</span>
          </div>
          <div v-if="data.ledger_hash">
            Hash: <span class="font-mono text-xs">{{ data.ledger_hash?.substring(0, 16) }}...</span>
          </div>
          <div v-if="data.txn_count !== undefined">
            Transactions: <span class="font-mono">{{ data.txn_count }}</span>
          </div>
          <div v-if="data.ledger_time">
            Time: {{ formatLedgerTime(data.ledger_time) }}
          </div>
          <div v-if="data.fee_base !== undefined">
            Base Fee: <span class="font-mono">{{ data.fee_base }} drops</span>
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

const formatLedgerTime = (rippleTime: number) => {
  const date = new Date((rippleTime + 946684800) * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}
</script>
