<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">Connection Status</h3>
        <UBadge
          :color="isConnected ? 'success' : 'error'"
          variant="subtle"
        >
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Network Selection -->
      <div v-if="!isConnected">
        <label class="block text-sm font-medium mb-3">Select Network</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            v-for="network in networks"
            :key="network.id"
            class="p-4 rounded-lg border-2 transition-all text-left"
            :class="[
              selectedNetwork === network.id
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
                : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            ]"
            :disabled="isConnecting"
            @click="selectedNetwork = network.id"
          >
            <div class="font-semibold mb-1">{{ network.name }}</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ network.description }}
            </div>
          </button>
        </div>

        <!-- Selected URL Display -->
        <div class="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div class="text-xs text-gray-500 dark:text-gray-400 mb-1">Server URL</div>
          <code class="text-sm font-mono text-gray-700 dark:text-gray-300">
            {{ selectedUrl }}
          </code>
        </div>
      </div>

      <!-- Connected Network Info -->
      <div v-else class="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
        <div class="flex items-center gap-2 mb-1">
          <span class="font-semibold text-green-700 dark:text-green-300">
            {{ connectedNetworkName }}
          </span>
        </div>
        <code class="text-xs font-mono text-green-600 dark:text-green-400">
          {{ connectedUrl }}
        </code>
      </div>

      <!-- Connection Buttons -->
      <div class="flex gap-2">
        <UButton
          v-if="!isConnected"
          color="primary"
          :loading="isConnecting"
          :disabled="isConnecting"
          @click="handleConnect"
        >
          {{ isConnecting ? 'Connecting...' : 'Connect' }}
        </UButton>
        <UButton
          v-else
          color="error"
          @click="$emit('disconnect')"
        >
          Disconnect
        </UButton>
        <UButton
          v-if="isConnected"
          color="neutral"
          variant="outline"
          @click="$emit('clear')"
        >
          Clear Events
        </UButton>
      </div>

      <!-- Error Message -->
      <UAlert
        v-if="connectionError"
        color="error"
        variant="subtle"
        title="Connection Error"
        :description="connectionError"
      />

      <!-- Stats -->
      <div
        v-if="stats.connected"
        class="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800"
      >
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
          <div class="text-lg font-semibold">{{ uptime }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Events</div>
          <div class="text-lg font-semibold">{{ stats.eventsReceived }}</div>
        </div>
        <div>
          <div class="text-sm text-gray-500 dark:text-gray-400">Last Event</div>
          <div class="text-lg font-semibold">
            {{ stats.lastEventTime ? timeSince(stats.lastEventTime) : 'N/A' }}
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ConnectionStats } from '~/composables/useXrplConsensus'

interface Network {
  id: string
  name: string
  description: string
  url: string
}

const props = defineProps<{
  isConnected: boolean
  isConnecting: boolean
  connectionError: string | null
  stats: ConnectionStats
}>()

const emit = defineEmits<{
  connect: [url: string]
  disconnect: []
  clear: []
}>()

const networks: Network[] = [
  {
    id: 'mainnet',
    name: 'Mainnet',
    description: 'Production network',
    url: 'wss://xrplcluster.com/',
  },
  {
    id: 'testnet',
    name: 'Testnet',
    description: 'Test network',
    url: 'wss://s.altnet.rippletest.net:51233/',
  },
  {
    id: 'devnet',
    name: 'Devnet',
    description: 'Development network',
    url: 'wss://s.devnet.rippletest.net:51233/',
  },
]

const selectedNetwork = ref('mainnet')
const connectedUrl = ref('')

const selectedUrl = computed(() => {
  return networks.find(n => n.id === selectedNetwork.value)?.url || ''
})

const connectedNetworkName = computed(() => {
  const network = networks.find(n => n.url === connectedUrl.value)
  return network?.name || 'Custom'
})

const handleConnect = () => {
  connectedUrl.value = selectedUrl.value
  emit('connect', selectedUrl.value)
}

// Computed uptime with auto-refresh
const now = ref(Date.now())
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const uptime = computed(() => {
  if (!props.stats.startTime) return '0s'
  const seconds = Math.floor((now.value - props.stats.startTime) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m`
})

const timeSince = (timestamp: number) => {
  const seconds = Math.floor((now.value - timestamp) / 1000)
  if (seconds < 1) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}
</script>
