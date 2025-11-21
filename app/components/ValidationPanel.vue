<template>
  <EventsPanel
    title="Validations"
    :events="events"
    badge-color="green"
    :max-display="5"
  >
    <template #summary="{ data }">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-green-600 dark:text-green-400">
            Validation Received
          </span>
          <UBadge v-if="data.full" color="green" size="xs">Full</UBadge>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
          <div v-if="data.ledger_index">
            Ledger Index: <span class="font-mono">{{ data.ledger_index }}</span>
          </div>
          <div v-if="data.ledger_hash">
            Hash: <span class="font-mono text-xs">{{ data.ledger_hash?.substring(0, 16) }}...</span>
          </div>
          <div v-if="data.validation_public_key">
            Validator: <span class="font-mono text-xs">{{ data.validation_public_key?.substring(0, 20) }}...</span>
          </div>
          <div v-if="data.flags !== undefined">
            Flags: <span class="font-mono">{{ data.flags }}</span>
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
</script>
