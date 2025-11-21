# XRPL Consensus Monitor

A comprehensive real-time dashboard for monitoring the XRP Ledger (XRPL) consensus process, including consensus phases, validations, ledger closures, and transaction proposals.

## Features

- **Real-time Consensus Monitoring**: Track the consensus protocol phases (open, establish, accepted)
- **Validation Tracking**: Monitor validation messages from trusted validators
- **Ledger Activity**: View ledger closures and their details (index, hash, transaction count, fees)
- **Transaction Proposals**: See transactions as they're proposed to the network
- **Connection Management**: Easy connection to different XRPL networks (Mainnet, Testnet, Devnet)
- **Event Buffering**: Smart buffering system to handle fast-moving data (max 100 events per type)
- **Statistics Dashboard**: Track uptime, event counts, and connection status
- **Responsive UI**: Built with @nuxt/ui for a beautiful, responsive interface

## Tech Stack

- **Nuxt 3**: Vue.js framework for modern web applications
- **@nuxt/ui**: Beautiful UI components built on TailwindCSS
- **xrpl.js**: Official XRPL JavaScript/TypeScript library
- **TypeScript**: Type-safe development
- **Vue 3**: Progressive JavaScript framework

## Project Structure

```
xrpl-consensus/
├── app/
│   ├── composables/
│   │   └── useXrplConsensus.ts    # Main XRPL connection composable
│   ├── components/
│   │   ├── ConnectionStatus.vue    # Connection status widget
│   │   ├── EventsPanel.vue         # Reusable events display panel
│   │   ├── ConsensusPhasePanel.vue # Consensus phases display
│   │   ├── ValidationPanel.vue     # Validations display
│   │   ├── LedgerPanel.vue         # Ledger activity display
│   │   └── TransactionPanel.vue    # Transaction proposals display
│   └── pages/
│       └── index.vue               # Main dashboard page
├── package.json
└── nuxt.config.ts
```

## Setup

Install dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Usage

1. **Connect to XRPL Network**:
   - Enter a WebSocket URL or use one of the preset networks
   - Click "Connect" to establish connection

2. **Available Networks**:
   - **Mainnet**: `wss://xrplcluster.com/`
   - **Testnet**: `wss://s.altnet.rippletest.net:51233/`
   - **Devnet**: `wss://s.devnet.rippletest.net:51233/`

3. **Monitor Events**:
   - **Consensus Phases**: See the consensus protocol phases in real-time
   - **Validations**: Track validation messages from validators
   - **Ledgers**: Monitor ledger closures with transaction counts and fees
   - **Transactions**: View proposed transactions before they're validated

4. **Manage Events**:
   - Click "Show/Hide" on individual events to see full details
   - Click "Expand" to see more than the default 5 most recent events
   - Click "Clear Events" to reset all event buffers

## How It Works

### Consensus Process

The XRPL consensus protocol goes through three main phases:

1. **Open Phase**: The ledger is open and collecting new transactions
2. **Establish Phase**: Validators propose their transaction sets and work toward consensus
3. **Accepted Phase**: Consensus is reached and the ledger is closed

### Event Streams

The dashboard subscribes to multiple XRPL streams:

- `consensus`: Consensus phase changes
- `validations`: Validation messages from trusted validators
- `ledger`: Ledger close events
- `transactions_proposed`: Transaction proposals

### Event Buffering

To prevent memory issues with fast-moving data:
- Each event type is limited to 100 most recent events
- Older events are automatically removed when the limit is reached
- Events are displayed in reverse chronological order (newest first)

## Components

### `useXrplConsensus` Composable

Main composable that handles:
- XRPL client connection management
- Event stream subscriptions
- Event buffering and storage
- Connection statistics tracking

### Event Panels

Each event type has a dedicated panel component:
- **ConsensusPhasePanel**: Shows consensus phases with ledger info
- **ValidationPanel**: Displays validator validations
- **LedgerPanel**: Shows ledger closures with transaction counts
- **TransactionPanel**: Displays proposed transactions with types and amounts

## Production

Build the application for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Learn More

- [XRPL Documentation](https://xrpl.org/docs/)
- [XRPL Consensus Protocol](https://xrpl.org/consensus.html)
- [xrpl.js Documentation](https://js.xrpl.org/)
- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt UI Documentation](https://ui.nuxt.com/)
