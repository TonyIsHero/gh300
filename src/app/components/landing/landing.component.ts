import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-white/10 text-center transform transition-all hover:scale-[1.02]">
        <div class="w-24 h-24 mx-auto flex items-center justify-center mb-6 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600/50 shadow-inner">
          <img src="images/github-copilot-icon.svg" alt="GitHub Copilot Icon" class="w-16 h-16 object-contain drop-shadow-md">
        </div>
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 mb-4 tracking-tight leading-tight">
          Microsoft GitHub Copilot GH 300
        </h1>
        <p class="text-slate-600 dark:text-slate-300 text-lg mb-10 font-medium">Welcome to GH 300 preparation exam</p>
        
        <div class="space-y-4">
          <button (click)="selectMode('practise')" class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-blue-700 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all shadow-md">
            Practise
          </button>
          
          <button (click)="selectMode('mock')" class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all shadow-lg hover:shadow-blue-500/25">
            Mock Test
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
