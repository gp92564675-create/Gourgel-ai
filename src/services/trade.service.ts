
import { Injectable, computed, signal } from '@angular/core';
import { Signal, Trade } from '../models';
import { BrokerService } from './broker.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TradeService {
  private brokerService = inject(BrokerService);
  tradeHistory = signal<Trade[]>([]);

  stats = computed(() => {
    const history = this.tradeHistory();
    const totalTrades = history.length;
    const wins = history.filter(t => t.result === 'WIN').length;
    const losses = history.filter(t => t.result === 'LOSS').length;
    
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

    return {
        totalTrades,
        wins,
        losses,
        winRate
    };
  });


  placeTrade(signal: Signal, amount: number) {
    const newTrade: Trade = {
      id: Math.random().toString(36).substring(2, 9),
      signal,
      entryAmount: amount,
      timestamp: Date.now(),
    };

    this.brokerService.updateBalance(-amount);
    this.tradeHistory.update(history => [newTrade, ...history]);

    // Simulate trade resolution after a delay
    setTimeout(() => {
        this.resolveTrade(newTrade.id);
    }, 5000 * (signal.timeframe === 'M1' ? 1 : 5)); // 5sec * multiplier
  }

  private resolveTrade(tradeId: string) {
    this.tradeHistory.update(history => {
        const tradeIndex = history.findIndex(t => t.id === tradeId);
        if (tradeIndex === -1) return history;

        const trade = { ...history[tradeIndex] };
        
        // Simulate a high win rate, but not 100%
        const isWin = Math.random() * 100 < trade.signal.probability;
        trade.result = isWin ? 'WIN' : 'LOSS';

        const payoutPercentage = 0.87; // Typical binary options payout
        trade.payout = isWin ? trade.entryAmount * (1 + payoutPercentage) : 0;
        
        if (isWin) {
            this.brokerService.updateBalance(trade.payout);
        }

        const newHistory = [...history];
        newHistory[tradeIndex] = trade;
        return newHistory;
    });
  }
}
