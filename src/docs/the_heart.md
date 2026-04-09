I would call this hook as- The Heart (The Buffered WebSocket)

### 1. Data Pipeline (Flow of Information)

At the highest level, this is the flow: **WebSocket → Buffer → Batch Flush → Store → UI**

 • WebSocket → raw high-frequency data (can be 50+ msgs/sec)
 • Buffer (Map) → temporary holding tank
 • Batch Flush (every 200ms) → controlled release
 • Store (Zustand) → single state update
 • UI → re-render

What's happening is that we add changes per token to the buffer which is a map and on every 200ms we are flushing the buffer to batch which re-render the ui using batchUpdate function comes from the
Zustand store.

- **Coalescing updates & Lossy compression(intentional data dropping):**
- **Time Based Batching(Controlled Throughput)**
These are the behaviour we got in our system which meant that we are not showing every update, we are showing update which a human eye can notice.
That's not our goal to show updates which a human eye can notice that's just the reflection of our system.

### 2. Resilience System (Reconnect Strategy)

System continues working despite network failures, server issues, or app interruptions.
**Assumes one harsh turth:** Your system will fail, not 'if' -but 'when'. So instead of preventing failures, it **designs for recovery**.

###### Full Resilience Loop

CONNECT
   ↓
WORKING
   ↓
FAIL (error/close)
   ↓
WAIT (backoff + jitter)
   ↓
RECONNECT
   ↓
SUCCESS → RESET attempts
   ↓
FAIL AGAIN → repeat

###### Layer working together

1. Failure Detection
How do we know connection is dead?

- onclose: server closed or network dropped
- onerror: something went wrong -> force close `ws.onerror -> ws.close()` (errors are unreliable- closure is the only clean signal)

1. Controlled Retry (Exponential backoff + jitter)
Instead of instantly reconnecting, it every user reconnect after a delay and that delay also differs user to user(using jitter). Because if delay is same for every user than same problem may occur.
`delay = INITIAL_DELAY * (2 ^ attempts) + jitter`

- Max Delay: A safety cap to prevent the wait time from growing into hours, days, or even years if the connection remains broken for a long period.
? Lil-Que: We can manage max attempts than why we prefer max delay
- Intent Awareness: Sometime there're also intentionally disconnection so make your system aware of the intent

**Why instant reconnect is self-harm?**

- Reconnection Storm (Thundering Herd): Thousands of clients reconnect at once, your system gets DDOS-ed by your own users.
- Infinite Retry Loop: Server down → client keeps retrying → wastes CPU + battery
- No state awareness: Their's no clue of why did connection close? is server alive? should even reconnect now?

### 3. Controlled Teardown System  

If you don't shut down properly, your system never truly stops.

1. Memory leaks: Timers keep running
2. Ghost updates: Old WebSocket still pushing data into your store
3. Duplicate system: New connection + old connection both active
4. Infinite reconnect loops: Even when you intentionally closed.

```ts
const teardown = () => {
  //please observer the order here,that matters

  //set intent flag
  intentionallyDisconnectedRef.current = true;

  //stop timer
  clearInterval(flushTimer);
  //clear state
  bufferRef.clear();

  //close socket & remove it from the memory
  wsRef.current.close();
  wsRef = null;
}
```

###### Where Teardown is Used?

  1. Tab Visibility Change
 Browsers like Chrome aggressively throttle (slow down) JavaScript in background tabs. If you don't disconnect, your WebSocket might fall behind, and when the user clicks back to your tab,
they'll see a "burst" of 100+ outdated price updates at once.

  1. When the Component Unmounts
If the user navigates away from the screen that uses the WebSocket, teardown() is called to stop everything.

### 4. Connection State Machine

We are managing connectionState in store- connecting → connected → disconnected → syncing, The core idea behind it is system exposes its internal state so UI can react.
Example- Show loader when 'connecting', Show red dot when 'disconnected'
