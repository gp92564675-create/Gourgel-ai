
export interface Signal {
  asset: string; // e.g., 'EUR/USD'
  type: 'CALL' | 'PUT';
  timeframe: 'M1' | 'M5';
  probability: number; // e.g., 95
  strategy: string; // e.g., 'Trend Confluence'
}

export interface Trade {
  id: string;
  signal: Signal;
  entryAmount: number;
  timestamp: number;
  result?: 'WIN' | 'LOSS';
  payout?: number;
}
