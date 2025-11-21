<template>
  <EventsPanel
    title="Transaction Proposals"
    :events="events"
    badge-color="orange"
    :max-display="5"
  >
    <template #summary="{ data }">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-orange-600 dark:text-orange-400">
            {{ getTransactionTypeIcon(data.transaction?.TransactionType) }}
            {{ data.transaction?.TransactionType || 'Transaction' }}
          </span>
          <UBadge v-if="!data.validated" color="orange" size="xs">
            Proposed
          </UBadge>
          <UBadge v-else color="green" size="xs">
            Validated
          </UBadge>
        </div>
        <div class="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
          <div v-if="data.transaction?.hash">
            Hash: <span class="font-mono text-xs">{{ data.transaction.hash?.substring(0, 16) }}...</span>
          </div>
          <div v-if="data.transaction?.Account">
            From: <span class="font-mono text-xs">{{ data.transaction.Account?.substring(0, 20) }}...</span>
          </div>
          <div v-if="data.transaction?.Destination">
            To: <span class="font-mono text-xs">{{ data.transaction.Destination?.substring(0, 20) }}...</span>
          </div>
          <div v-if="data.transaction?.Amount">
            Amount: <span class="font-mono">{{ formatAmount(data.transaction.Amount) }}</span>
          </div>
          <div v-if="data.ledger_index">
            Ledger: <span class="font-mono">{{ data.ledger_index }}</span>
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

const getTransactionTypeIcon = (type?: string) => {
  const icons: Record<string, string> = {
    'Payment': '💸',
    'OfferCreate': '📊',
    'OfferCancel': '❌',
    'TrustSet': '🤝',
    'AccountSet': '⚙️',
    'SetRegularKey': '🔑',
    'SignerListSet': '📝',
    'EscrowCreate': '⏳',
    'EscrowFinish': '✅',
    'EscrowCancel': '🚫',
    'PaymentChannelCreate': '🌊',
    'PaymentChannelFund': '💰',
    'PaymentChannelClaim': '💵',
  }
  return icons[type || ''] || '📄'
}

const formatAmount = (amount: any) => {
  if (typeof amount === 'string') {
    const drops = parseInt(amount)
    return `${(drops / 1000000).toFixed(6)} XRP`
  }
  return JSON.stringify(amount)
}
</script>
