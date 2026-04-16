type SparklineProps = {
  prices: number[] | undefined
  isUp: boolean
  width?: number
  height?: number
}

export const Sparkline = ({ prices, isUp, width = 120, height = 56 }: SparklineProps) => {
  if (!prices || prices.length < 2) {
    return <div style={{ width, height }} className="opacity-30" />
  }

  const W = width
  const H = height
  const PAD = 4

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1

  const points = prices.map((price, i) => ({
    x: (i / (prices.length - 1)) * (W - PAD * 2) + PAD,
    y: H - PAD - ((price - min) / range) * (H - PAD * 2),
  }))

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ')

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(2)},${H} L ${points[0].x.toFixed(2)},${H} Z`

  const stroke = isUp ? '#4ade80' : '#f87171'
  const glow = isUp ? '#22c55e' : '#ef4444'
  const gradId = `spark-grad-${isUp ? 'up' : 'dn'}`
  const glowId = `spark-glow-${isUp ? 'up' : 'dn'}`

  const last = points[points.length - 1]

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.45" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={areaPath} fill={`url(#${gradId})`} />

      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />

      <circle cx={last.x} cy={last.y} r="2.5" fill={stroke} />
      <circle cx={last.x} cy={last.y} r="4.5" fill={glow} fillOpacity="0.25" />
    </svg>
  )
}
