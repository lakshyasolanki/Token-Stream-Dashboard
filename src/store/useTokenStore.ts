import { create } from "zustand";
import type { TokenStore } from "../types";

export const useTokenStore = create<TokenStore>((set) => {
  return {
    tokens: {},
    sortedSymbols: [],
    connectionStatus: 'disconnected',

    setConnectionStatus: (status) => set({ connectionStatus: status }),

    batchUpdate: (updates) => set((state) => {
      //creates shallow copy of tokens state
      const newTokens = { ...state.tokens }

      updates.forEach((update, symbol) => {
        const existing = newTokens[symbol];

        const prevHistory = existing?.priceHistory || [];
        const newHistory = [...prevHistory.slice(-29), update.price]

        newTokens[update.symbol] = {
          symbol: update.symbol,
          price: update.price,
          change24h: update.change24h,
          high24h: update.high24h,
          low24h: update.low24h,
          volume: update.volume,
          quotevolume: update.quotevolume,

          prevPrice: existing ? existing.price : update.price,
          startPrice: existing ? existing.startPrice : update.price,
          priceHistory: newHistory,
        }
      })

      const allSymbols = Object.keys(newTokens);
      const newSortedSymbols = allSymbols.length > state.sortedSymbols.length
        ? [...state.sortedSymbols, ...allSymbols.filter((s) => !state.sortedSymbols.includes(s))]
        : state.sortedSymbols;

      return {
        tokens: newTokens,
        sortedSymbols: newSortedSymbols
      }
    })
  }
})

export const useToken = (symbol: string) =>
  useTokenStore((state) => state.tokens[symbol]);

export const useTokenPrice = (symbol: string) =>
  useTokenStore((state) => state.tokens[symbol].price);

export const useSortedSymbols = () =>
  useTokenStore((state) => state.sortedSymbols);

export const useConnectionStatus = () =>
  useTokenStore((state) => state.connectionStatus)
