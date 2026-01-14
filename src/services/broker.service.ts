
import { Injectable, signal } from '@angular/core';

export type AccountType = 'DEMO' | 'REAL';

@Injectable({
  providedIn: 'root',
})
export class BrokerService {
  connectedBroker = signal<string | null>(null);
  accountType = signal<AccountType>('DEMO');
  balance = signal<number>(10000);

  connect(broker: string) {
    this.connectedBroker.set(broker);
    this.resetBalance();
  }

  disconnect() {
    this.connectedBroker.set(null);
  }
  
  setAccountType(type: AccountType) {
    this.accountType.set(type);
    this.resetBalance();
  }

  updateBalance(amount: number) {
    this.balance.update(b => b + amount);
  }

  private resetBalance() {
    if (this.accountType() === 'DEMO') {
        this.balance.set(10000);
    } else {
        this.balance.set(500); // A smaller, more realistic starting balance for a real account
    }
  }
}
