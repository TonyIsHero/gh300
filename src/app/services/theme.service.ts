import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal<boolean>(true); // default to dark

  constructor() {
    // Read from local storage
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('gh300_theme');
      if (saved === 'light') {
        this.isDarkMode.set(false);
      } else if (saved === 'dark') {
        this.isDarkMode.set(true);
      } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          this.isDarkMode.set(false);
        }
      }
    }

    effect(() => {
      const isDark = this.isDarkMode();
      if (typeof window !== 'undefined' && window.document) {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('gh300_theme', isDark ? 'dark' : 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }
}
