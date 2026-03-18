import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { ThemeService } from './services/theme.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThemeToggleComponent],
  template: `
    <app-theme-toggle></app-theme-toggle>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'gh300';
  themeService = inject(ThemeService); // Initialize service
}
