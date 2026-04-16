import { useToken, useTokenPrice } from "../store/useTokenStore"
import { formatPrice } from "../utils/format"
import { TOKEN_INFO } from "../utils/tokens"
import { Sparkline } from "./Sparkline"

const TokenCard = ({ symbol }: { symbol: string }) => {
  const token = useToken(symbol)
  const is24Up = token.change24h >= 0;
  const change24h = token.change24h.toFixed(2)
  const isUp = token.price >= token.prevPrice

  return (
    <div
      className={`space-y-4 rounded-xl shadow-xs ${isUp ? 'bg-green-900/25' : 'bg-red-900/25'} border-[0.5px] border-gray-800`}
    >
      <div className="">
        <div className="flex gap-5">
          <div className={`${TOKEN_INFO[symbol].theme}/25 rounded-2xl border border-gray-800`}>
            <div className="size-12 m-2">
              <img src={`${TOKEN_INFO[symbol].logo}`} />
            </div>
          </div>
          <div className="p-2">
            <div className="text-gray-600">{symbol.replace('USDT', '/USDT')}</div>
            <div className="text-2xl">{TOKEN_INFO[symbol].name}</div>
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between gap-3 pr-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex gap-5">
            <div
              className={`${TOKEN_INFO[symbol].theme}  w-1 h-6 rounded-r-2xl`}
            />
            <span>Price</span>
          </div>
          <div className="text-4xl pl-6 truncate">
            {formatPrice(useTokenPrice(symbol))}
          </div>
          <div className="flex gap-2">
            <div
              className={`${is24Up ? 'bg-green-400/25 text-green-500' : 'bg-red-500/25 text-red-500'} m-2 ml-6 px-4 py-2 rounded-full`}
            >
              {is24Up
                ? `↑ ${change24h}%`
                : `↓ ${-(change24h)}%`}
            </div>
          </div>
        </div>
        <div className="pt-2 shrink-0">
          <Sparkline prices={token.priceHistory} isUp={is24Up} />
        </div>
      </div>
    </div>
  )
}

export default TokenCard
