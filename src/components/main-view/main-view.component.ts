
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { SignalsComponent } from '../signals/signals.component';
import { HistoryComponent } from '../history/history.component';
import { SettingsComponent } from '../settings/settings.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

export type MainView = 'dashboard' | 'signals' | 'history' | 'settings';

@Component({
  selector: 'app-main-view',
  standalone: true,
  imports: [CommonModule, DashboardComponent, SignalsComponent, HistoryComponent, SettingsComponent, BottomNavComponent],
  templateUrl: './main-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainViewComponent {
  activeView = signal<MainView>('dashboard');

  onViewChange(view: MainView) {
    this.activeView.set(view);
  }
}
