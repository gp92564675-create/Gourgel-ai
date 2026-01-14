
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private authService = inject(AuthService);
  
  username = signal('');
  password = signal('');
  error = signal<string | null>(null);

  onLogin() {
    this.error.set(null);
    const success = this.authService.login(this.username(), this.password());
    if (!success) {
      this.error.set('Invalid credentials. Using mock login.');
      // Fallback for demo purposes
      this.authService.login('user', 'pass');
    }
  }

  updateUsername(event: Event) {
    this.username.set((event.target as HTMLInputElement).value);
  }

  updatePassword(event: Event) {
    this.password.set((event.target as HTMLInputElement).value);
  }
}
