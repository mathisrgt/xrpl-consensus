<template>
  <UContainer class="py-8 min-h-screen">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        XRPL Consensus Monitor
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">
        Real-time monitoring of XRPL consensus process, validations, and ledger activity
      </p>
    </div>

    <!-- Connection Status -->
    <div class="mb-6">
      <ConnectionStatus
        :is-connected="isConnected"
        :is-connecting="isConnecting"
        :connection-error="connectionError"
        :stats="stats"
        @connect="handleConnect"
        @disconnect="handleDisconnect"
        @clear="handleClear"
      />
    </div>

    <!-- Events Grid -->
    <div v-if="isConnected" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Consensus Phases -->
      <ConsensusPhasePanel :events="consensusPhases" />

      <!-- Validations -->
      <ValidationPanel :events="validations" />

      <!-- Ledgers -->
      <LedgerPanel :events="ledgers" />

      <!-- Transactions -->
      <TransactionPanel :events="transactions" />
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg"
    >
      <div class="text-5xl mb-4">📡</div>
      <h2 class="text-xl font-semibold mb-2">Ready to Monitor</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Select a network above and click Connect to start monitoring consensus activity
      </p>
    </div>

    <!-- Info Section -->
    <div class="mt-8 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
      <h3 class="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">
        About XRPL Consensus
      </h3>
      <div class="text-sm text-blue-800 dark:text-blue-200 space-y-2">
        <p>
          <strong>Consensus Phases:</strong> The XRPL uses a consensus protocol that goes through phases:
          <span class="font-mono">open</span> (collecting transactions),
          <span class="font-mono">establish</span> (validators propose transaction sets),
          and <span class="font-mono">accepted</span> (consensus reached).
        </p>
        <p>
          <strong>Validations:</strong> Trusted validators sign and broadcast validation messages
          to agree on the state of the ledger.
        </p>
        <p>
          <strong>Ledgers:</strong> Each ledger is a snapshot of all account balances and settings
          at a specific point in time. New ledgers typically close every 3-5 seconds.
        </p>
        <p>
          <strong>Transaction Proposals:</strong> Transactions are proposed to the network
          before they are included in a validated ledger.
        </p>
      </div>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {
  isConnected,
  isConnecting,
  connectionError,
  consensusPhases,
  validations,
  ledgers,
  transactions,
  stats,
  connect,
  disconnect,
  clearEvents,
} = useXrplConsensus()

const handleConnect = async (url: string) => {
  await connect(url)
}

const handleDisconnect = async () => {
  await disconnect()
}

const handleClear = () => {
  clearEvents()
}
</script>
