<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold">{{ title }}</h3>
          <UBadge :color="badgeColor" variant="subtle">
            {{ events.length }}
          </UBadge>
        </div>
        <UButton
          v-if="events.length > 0"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="expanded = !expanded"
        >
          {{ expanded ? 'Collapse' : 'Expand' }}
        </UButton>
      </div>
    </template>

    <div v-if="events.length === 0" class="text-center py-8 text-gray-500">
      No {{ title.toLowerCase() }} received yet
    </div>

    <div v-else class="space-y-2">
      <TransitionGroup name="slide">
        <div
          v-for="(event, index) in displayedEvents"
          :key="event.id"
          class="p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
        >
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center gap-2">
              <UBadge :color="badgeColor" size="xs">
                #{{ events.length - index }}
              </UBadge>
              <span class="text-xs text-gray-500">
                {{ formatTime(event.timestamp) }}
              </span>
            </div>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              @click="toggleDetails(event.id)"
            >
              {{ expandedEvents.has(event.id) ? 'Hide' : 'Show' }}
            </UButton>
          </div>

          <!-- Event Summary -->
          <div class="text-sm mb-2">
            <slot name="summary" :event="event" :data="event.data">
              <pre class="text-xs">{{ formatSummary(event.data) }}</pre>
            </slot>
          </div>

          <!-- Event Details (Expanded) -->
          <div v-if="expandedEvents.has(event.id)" class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <pre class="text-xs overflow-x-auto bg-gray-50 dark:bg-gray-950 p-2 rounded">{{ JSON.stringify(event.data, null, 2) }}</pre>
          </div>
        </div>
      </TransitionGroup>

      <!-- Show More Button -->
      <div v-if="!expanded && events.length > maxDisplay" class="text-center pt-2">
        <UButton
          size="sm"
          color="neutral"
          variant="ghost"
          @click="expanded = true"
        >
          Show {{ events.length - maxDisplay }} more
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { ConsensusEvent } from '~/composables/useXrplConsensus'

const props = withDefaults(
  defineProps<{
    title: string
    events: ConsensusEvent[]
    badgeColor?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral" | undefined
    maxDisplay?: number
  }>(),
  {
    badgeColor: "primary",
    maxDisplay: 5,
  }
)

const expanded = ref(false)
const expandedEvents = ref(new Set<string>())

const displayedEvents = computed(() => {
  return expanded.value ? props.events : props.events.slice(0, props.maxDisplay)
})

const toggleDetails = (id: string) => {
  if (expandedEvents.value.has(id)) {
    expandedEvents.value.delete(id)
  } else {
    expandedEvents.value.add(id)
  }
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  const ms = date.getMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${seconds}.${ms}`
}

const formatSummary = (data: any) => {
  if (!data) return 'No data'
  // Try to create a concise summary
  const keys = Object.keys(data).slice(0, 3)
  return keys.map(key => `${key}: ${JSON.stringify(data[key])}`).join(', ')
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
