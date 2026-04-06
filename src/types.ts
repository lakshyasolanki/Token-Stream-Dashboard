export interface Token {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: number;
  quotevolume: number;

  prevPrice: number;
  startPrice: number;
  priceHistory: number[];  //For SVG Sparklines, we are managing price history of last 30 prices
}

//Token data came out of binance 
// {
// "stream":"btcusdt@miniTicker",
// "data":{
//    "e":"24hrMiniTicker",
//    "E":1775451031022,
//    "s":"BTCUSDT",
//    "c":"69136.25000000",     current price
//    "o":"67105.81000000",     opening price(24h ago)
//    "h":"69588.00000000",     high24
//    "l":"66611.66000000",     low24
//    "v":"15559.78278000",     volume
//    "q":"1058873560.40730200" quotevolume
// }}
export interface TokenUpdate {
  symbol: string;
  price: number;
  change24h: number;           //((c - o) / o) * 100
  high24h: number;
  low24h: number;
  volume: number;
  quotevolume: number;
}

//the shape of the entire store
export interface TokenStore {
  tokens: Record<string, Token>;   //{ "BTC": { price: 65000, volume: 1000 }, "ETH": { price: 3500, volume: 5000 }  };
  sortedSymbols: string[];         //'The official ui order'
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'syncing';

  setConnectionStatus: (status: TokenStore['connectionStatus']) => void;
  batchUpdate: (updates: Map<string, TokenUpdate>) => void;
}
