# PropChain

A Vite + React + TypeScript app demonstrating a clean wallet connection flow (MetaMask), a reusable modal, and a single toggle button in the Navbar that swaps between “Connect Wallet” and the truncated address when connected.

## Highlights
- Wallet modal remains open after a successful connection and shows the full address plus a Disconnect action.
- Navbar uses a single toggle button: not connected → “Connect Wallet”, connected → truncated address (e.g., `0xabc...123`).
- Address persistence via `localStorage` key `propchain_wallet_address` across refreshes.
- Syncs state with MetaMask via `accountsChanged` (EIP‑1193) to reflect account switches.
- Strong TypeScript typings for `window.ethereum` and `request<T>`; no use of `any`.

## Demo Images
The following images showcase the wallet flow and UI:

<img width="1917" height="993" alt="Connect Wallet Modal (prompt to connect)" src="https://github.com/user-attachments/assets/b6d9c077-4f45-478b-b48d-510909a1caeb" />

<img width="1917" height="990" alt="Modal showing connected address and localStorage persistence" src="https://github.com/user-attachments/assets/4df4cd1f-cac7-4c9a-a7df-8c1ffbfad597" />

<img width="1210" height="952" alt="Navbar button showing truncated address after connection" src="https://github.com/user-attachments/assets/8bf1a2b5-2afa-48f5-a39b-2f9b4a651104" />

<img width="1918" height="995" alt="Modal showing metamask not detected" src="https://github.com/user-attachments/assets/5ae55527-ec33-4eb3-a14c-aff536a824dd" />

## How It Works
- Click the Navbar button to connect. Once connected, the button turns emerald and shows the truncated address.
- Open the Wallet modal from the same button; the modal displays the full address and provides a Disconnect option.
- Disconnect via the Navbar button (toggle) or the modal; the address is cleared and the button reverts to “Connect Wallet”.
- Account changes from MetaMask trigger UI updates automatically via `accountsChanged`.

## Key Files
- `src/utils/wallet.ts` — wallet utilities, `EthereumProvider` types, `request<T>` generics, `localStorage` helpers.
- `src/components/WalletModal/WalletModal.tsx` — reusable modal for connecting/disconnecting.
- `src/components/Layout/Navbar.tsx` — single toggle button shows truncated address when connected.
- `src/App.tsx` — integrates modal, persistence, toggle behavior, and provider event syncing.

## Run Locally
- `npm install`
- `npm run dev` then open `http://localhost:5173/`

## Notes
- If MetaMask is not installed, the app surfaces a friendly error message.
- User-rejected requests (EIP‑1193 `code: 4001`) are handled gracefully without breaking the flow.
