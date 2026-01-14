
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerService } from '../../services/broker.service';
import { TradeService } from '../../services/trade.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  brokerService = inject(BrokerService);
  tradeService = inject(TradeService);

  balance = this.brokerService.balance;
  accountType = this.brokerService.accountType;
  stats = this.tradeService.stats;
  recentTrades = this.tradeService.tradeHistory;
}
