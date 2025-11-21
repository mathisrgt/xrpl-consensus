import { Client } from 'xrpl'
import type {
  ConsensusStream,
  LedgerStream,
  ValidationStream,
  TransactionStream,
} from 'xrpl'

export interface ConsensusEvent {
  id: string
  timestamp: number
  type: 'consensus' | 'validation' | 'ledger' | 'transaction'
  data: any
}

export interface ConnectionStats {
  connected: boolean
  startTime: number | null
  eventsReceived: number
  lastEventTime: number | null
}

export const useXrplConsensus = () => {
  const client = ref<Client | null>(null)
  const isConnected = ref(false)
  const isConnecting = ref(false)
  const connectionError = ref<string | null>(null)

  // Event storage with max limits to prevent memory issues
  const MAX_EVENTS = 100
  const consensusPhases = ref<ConsensusEvent[]>([])
  const validations = ref<ConsensusEvent[]>([])
  const ledgers = ref<ConsensusEvent[]>([])
  const transactions = ref<ConsensusEvent[]>([])

  // Connection stats
  const stats = ref<ConnectionStats>({
    connected: false,
    startTime: null,
    eventsReceived: 0,
    lastEventTime: null,
  })

  // Helper to add event with limit
  const addEvent = (array: Ref<ConsensusEvent[]>, event: ConsensusEvent) => {
    array.value.unshift(event)
    if (array.value.length > MAX_EVENTS) {
      array.value.pop()
    }
    stats.value.eventsReceived++
    stats.value.lastEventTime = Date.now()
  }

  // Generate unique ID for events
  const generateEventId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const connect = async (url: string = 'wss://xrplcluster.com/') => {
    if (isConnecting.value || isConnected.value) {
      return
    }

    try {
      isConnecting.value = true
      connectionError.value = null

      // Create new client
      client.value = new Client(url)

      // Set up event listeners before connecting
      setupEventListeners()

      // Connect to the server
      await client.value.connect()

      isConnected.value = true
      stats.value.connected = true
      stats.value.startTime = Date.now()

      // Subscribe to multiple streams
      await client.value.request({
        command: 'subscribe',
        streams: ['consensus', 'validations', 'ledger', 'transactions_proposed'],
      })

      console.log('Successfully subscribed to all streams')
    } catch (error: any) {
      connectionError.value = error.message || 'Failed to connect'
      isConnected.value = false
      stats.value.connected = false
      console.error('Connection error:', error)
    } finally {
      isConnecting.value = false
    }
  }

  const setupEventListeners = () => {
    if (!client.value) return

    // Consensus phases
    client.value.on('consensusPhase', (data: ConsensusStream) => {
      addEvent(consensusPhases, {
        id: generateEventId(),
        timestamp: Date.now(),
        type: 'consensus',
        data,
      })
    })

    // Validations
    client.value.on('validationReceived', (data: ValidationStream) => {
      addEvent(validations, {
        id: generateEventId(),
        timestamp: Date.now(),
        type: 'validation',
        data,
      })
    })

    // Ledger closed
    client.value.on('ledgerClosed', (data: LedgerStream) => {
      addEvent(ledgers, {
        id: generateEventId(),
        timestamp: Date.now(),
        type: 'ledger',
        data,
      })
    })

    // Transactions proposed
    client.value.on('transaction', (data: TransactionStream) => {
      // Only add proposed transactions (not validated yet)
      if (data.validated === false) {
        addEvent(transactions, {
          id: generateEventId(),
          timestamp: Date.now(),
          type: 'transaction',
          data,
        })
      }
    })
  }

  const disconnect = async () => {
    if (client.value && isConnected.value) {
      await client.value.disconnect()
      client.value = null
      isConnected.value = false
      stats.value.connected = false
    }
  }

  const clearEvents = () => {
    consensusPhases.value = []
    validations.value = []
    ledgers.value = []
    transactions.value = []
    stats.value.eventsReceived = 0
    stats.value.lastEventTime = null
  }

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    // State
    isConnected,
    isConnecting,
    connectionError,
    consensusPhases,
    validations,
    ledgers,
    transactions,
    stats,

    // Methods
    connect,
    disconnect,
    clearEvents,
  }
}
