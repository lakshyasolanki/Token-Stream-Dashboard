import { useEffect, useRef } from "react"
import { useTokenStore } from "../store/useTokenStore"
import { type TokenUpdate } from "../types"

const FLUSH_INTERVAL = 200;
const MAX_DELAY = 30000;
const INITIAL_DELAY = 1000;

function useWebsocket(symbols: string[]) {
  const connectRef = useRef<(syms: string[]) => void>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const bufferRef = useRef(new Map<string, TokenUpdate>())
  const batchRef = useRef<number | null>(null)
  const intentionalDisconnectRef = useRef(false)
  const reconnectAttemptRef = useRef(0)

  connectRef.current = (syms: string[]) => {
    intentionalDisconnectRef.current = false

    const streams = syms.map((s) => `${s.toLowerCase()}@miniTicker`).join('/')
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttemptRef.current = 0;

      useTokenStore.getState().setConnectionStatus('connected');

      batchRef.current = setInterval(() => {
        if (bufferRef.current.size === 0) return
        useTokenStore.getState().batchUpdate(bufferRef.current)
        bufferRef.current.clear()
      }, FLUSH_INTERVAL)
    }

    ws.onmessage = (msgEvent) => {
      try {
        const msg = JSON.parse(msgEvent.data);
        const data = msg.data;

        const currentPrice = parseFloat(data.c);
        const openPrice = parseFloat(data.o)
        const change24h = ((currentPrice - openPrice) / openPrice) * 100

        const update: TokenUpdate = {
          symbol: data.s,
          price: currentPrice,
          change24h: change24h,
          high24h: parseFloat(data.h),
          low24h: parseFloat(data.l),
          volume: parseFloat(data.v),
          quotevolume: parseFloat(data.q)
        }
        bufferRef.current.set(data.s, update)
      } catch (err) {
        console.error(`Error while parsing the msg from websocket ${err}`)
      }
    }

    ws.onerror = (errEvent) => {
      console.warn(`Error occured in websocket server ${errEvent}`)
      ws.close()
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
      useTokenStore.getState().setConnectionStatus('disconnected')

      if (batchRef.current) {
        clearInterval(batchRef.current)
        batchRef.current = null
      }

      if (!intentionalDisconnectRef.current) {
        const exponentialBackoff = Math.pow(2, reconnectAttemptRef.current)
        const jitter = Math.random() * 1000
        const delay = Math.min((INITIAL_DELAY * exponentialBackoff) + jitter, MAX_DELAY)

        console.log(`Reconnecting in ${Math.round(delay)}ms (attempt ${reconnectAttemptRef.current})`);
        useTokenStore.getState().setConnectionStatus('connecting')

        setTimeout(() => {
          reconnectAttemptRef.current += 1
          connectRef.current!(syms)
        }, delay)
      }
    }
  }

  const teardown = () => {
    console.log('Shutting the system down')
    intentionalDisconnectRef.current = true

    bufferRef.current.clear()
    if (batchRef.current) {
      clearInterval(batchRef.current!)
      batchRef.current = null
    }

    wsRef.current?.close()
    wsRef.current = null;
  }

  useEffect(() => {
    connectRef.current?.(symbols);

    return () => {
      teardown();
    }
  }, [])
}

export default useWebsocket;
