import useWebsocket from "../hooks/useWebSocket"
import { useSortedSymbols } from "../store/useTokenStore"
import { SYMBOLS } from "../utils/tokens"
import TokenCard from "./TokenCard"


export const TokenList = () => {
  useWebsocket(SYMBOLS)
  const sortedSymbols = useSortedSymbols()

  return (
    <div className="grid grid-cols-3 gap-8">
      {sortedSymbols.map((sym) => (
        <TokenCard key={sym} symbol={sym} />
      ))}
    </div>
  )
}
