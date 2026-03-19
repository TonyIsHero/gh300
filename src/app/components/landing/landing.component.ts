import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4 transition-colors duration-500 relative overflow-hidden">
      <!-- Spotlight Effect -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-slate-100 dark:bg-white/5 rounded-full blur-[100px] opacity-70"></div>
      </div>

      <div class="z-10 text-center flex flex-col items-center max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 class="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter mb-6">
          GH 300<span class="text-slate-400 dark:text-white/30">.</span>
        </h1>
        <p class="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-medium mb-12 tracking-tight max-w-lg mx-auto">
          The definitive preparation experience for Microsoft GitHub Copilot.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button (click)="selectMode('mock')" class="w-full sm:w-auto px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-slate-900/20 dark:shadow-white/10">
            Mock Exam
          </button>
          
          <button (click)="selectMode('practise')" class="w-full sm:w-auto px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-semibold bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md">
            Practise Mode
          </button>
        </div>
      </div>
    </div>
  `
})
export class LandingComponent {
  private router = inject(Router);

  selectMode(mode: 'practise' | 'mock') {
    this.router.navigate(['/disclaimer'], { queryParams: { mode } });
  }
}
