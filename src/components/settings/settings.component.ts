
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrokerService, AccountType } from '../../services/broker.service';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  brokerService = inject(BrokerService);
  authService = inject(AuthService);

  connectedBroker = this.brokerService.connectedBroker;
  accountType = this.brokerService.accountType;

  brokers = ['Quotex', 'Nexus', 'Olymp Trade', 'IQ Option', 'Binomo', 'Pocket Option', 'Deriv', 'ExpertOption', 'Spectre.ai'];
  selectedBroker = signal(this.brokers[0]);
  
  isConnecting = signal(false);
  isBrokerLoginOpen = signal(false);
  
  brokerUsername = signal('');
  brokerPassword = signal('');

  openBrokerLoginModal() {
    this.isBrokerLoginOpen.set(true);
  }

  closeBrokerLoginModal() {
    this.isBrokerLoginOpen.set(false);
    this.brokerUsername.set('');
    this.brokerPassword.set('');
  }

  handleBrokerLogin() {
    if (!this.brokerUsername() || !this.brokerPassword()) return; // Simple validation

    this.isConnecting.set(true);
    // Simulate API call to broker
    setTimeout(() => {
      this.brokerService.connect(this.selectedBroker());
      this.isConnecting.set(false);
      this.closeBrokerLoginModal();
    }, 1500);
  }

  disconnect() {
    this.brokerService.disconnect();
  }

  changeAccountType(type: AccountType) {
    this.brokerService.setAccountType(type);
  }

  logout() {
    this.disconnect();
    this.authService.logout();
  }
  
  updateSelectedBroker(event: Event) {
    this.selectedBroker.set((event.target as HTMLSelectElement).value);
  }

  updateBrokerUsername(event: Event) {
    this.brokerUsername.set((event.target as HTMLInputElement).value);
  }

  updateBrokerPassword(event: Event) {
    this.brokerPassword.set((event.target as HTMLInputElement).value);
  }
}