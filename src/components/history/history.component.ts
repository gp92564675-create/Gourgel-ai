import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeService } from '../../services/trade.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryComponent {
  tradeService = inject(TradeService);
  tradeHistory = this.tradeService.tradeHistory;

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}