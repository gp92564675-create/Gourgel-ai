
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalService } from '../../services/signal.service';
import { TradeService } from '../../services/trade.service';
import { BrokerService } from '../../services/broker.service';
import { inject } from '@angular/core';
import { Signal } from '../../models';

@Component({
  selector: 'app-signals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsComponent {
  signalService = inject(SignalService);
  tradeService = inject(TradeService);
  brokerService = inject(BrokerService);

  signals = this.signalService.signals;
  isLoading = this.signalService.isLoading;
  error = this.signalService.error;

  selectedSignal = signal<Signal | null>(null);
  tradeAmount = signal<number>(10);
  
  isModalOpen = signal<boolean>(false);
  
  openTradeModal(signal: Signal) {
    this.selectedSignal.set(signal);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedSignal.set(null);
  }

  confirmTrade() {
    const sig = this.selectedSignal();
    const amount = this.tradeAmount();
    if (sig && amount > 0 && amount <= this.brokerService.balance()) {
        this.tradeService.placeTrade(sig, amount);
        this.closeModal();
    }
  }

  updateAmount(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.tradeAmount.set(Number(value));
  }
}
