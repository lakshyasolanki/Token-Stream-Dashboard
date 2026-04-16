# 🪙 Token Stream Dashboard

A high-performance, real-time cryptocurrency dashboard built with React, TypeScript, and Vite. This project is designed to handle high-frequency WebSocket data streams with a focus on performance, resilience, and battery efficiency.

## 📺 Demo
![Token Stream Dashboard Demo](public/assets/demo.mov)
*(Note: If the video doesn't play directly, you can find it in `public/assets/demo.mov`)*

## 🚀 Project Overview

The Token Stream Dashboard is not just a simple crypto tracker; it's an exploration of high-frequency data handling in the browser. It implements a sophisticated data pipeline to ensure the UI remains fluid even when receiving 50+ updates per second.

### 🧠 The Brain (State Management)
Uses **Zustand** for centralized state management, focusing on a clear data flow. It manages token data, sorted symbols, and connection statuses, ensuring that the UI reacts predictably to state changes.

### 💖 The Heart (Buffered WebSocket)
At the core is a **Buffered WebSocket pipeline**:
- **Data Coalescing:** High-frequency updates are held in a buffer (Map).
- **Batch Flushing:** The buffer is flushed to the store every 200ms, preventing unnecessary UI re-renders and "chatter."
- **Resilience:** Implements an exponential backoff strategy with jitter to handle network failures and prevent "Thundering Herd" issues.
- **Teardown System:** Aggressively manages resources by closing connections and clearing timers when the tab is hidden or the component unmounts to save battery and memory.

### 🏗️ The Body (Performance Rendering)
To achieve maximum performance, the dashboard employs a **Direct-to-DOM** rendering strategy:
- **Virtual DOM Bypass:** While the static parts of the `TokenCard` are managed by React, the "hot" data (prices) are updated via `refs` and `innerText` directly, bypassing the React reconciliation process.
- **GPU-Accelerated Animations:** Visual "flashes" for price changes are handled by CSS animations on the GPU, keeping the CPU free for data processing.

## 🛠️ Known Flaws & Future Improvements

While the core architecture is solid, there are several areas identified for future development:

- **List Virtualization:** Currently, the `TokenList` renders all cards. As the number of tokens grows, implementing virtualization (e.g., `react-window`) will be necessary to maintain performance.
- **Advanced Jitter:** Refining the exponential backoff with more sophisticated jitter to further protect the backend from reconnection storms.
- **Enhanced Visibility Logic:** Further optimizing the WebSocket state when the tab is throttled by the browser in the background.
- **Historical Data:** Adding sparkline history beyond the live stream for a more complete market overview.
- **Dynamic Formatting:** Improving the decimal handling for ultra-low-priced "meme" tokens vs. high-priced assets like BTC.

## 🛠️ Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **State:** Zustand
- **Styling:** CSS3 (GPU-accelerated animations)
- **Language:** TypeScript
