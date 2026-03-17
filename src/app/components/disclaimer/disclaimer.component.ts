import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div class="max-w-2xl w-full bg-slate-800 rounded-3xl shadow-2xl p-10 border border-white/5">
        
        <div class="flex items-center space-x-4 mb-8">
          <div class="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white">Before we begin</h2>
        </div>

        <div class="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8 backdrop-blur-sm shadow-inner">
          <p class="text-slate-300 text-lg leading-relaxed">
            There are <strong class="text-white">123 questions</strong> here, out of which <strong class="text-white">54</strong> will be in the official exam. 
            <span class="text-blue-400 font-medium">90% questions should match.</span>
          </p>
        </div>

        <label class="flex items-center space-x-4 cursor-pointer group mb-10 p-4 rounded-xl hover:bg-slate-700/30 transition-colors">
          <div class="relative flex items-center justify-center">
            <input type="checkbox"
                   class="peer sr-only"
                   [checked]="acknowledged()"
                   (change)="toggleAcknowledge()" />
            <div class="w-6 h-6 border-2 border-slate-500 rounded bg-slate-800 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all peer-focus:ring-2 peer-focus:ring-blue-500/50"></div>
            <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="text-slate-300 font-medium group-hover:text-white transition-colors">
            Yes, I acknowledge and understand these conditions.
          </span>
        </label>

        <div class="flex space-x-4">
          <button (click)="goBack()" class="flex-1 py-4 px-6 border border-slate-600 rounded-xl text-slate-300 font-bold hover:bg-slate-700 hover:text-white transition-colors focus:ring-2 focus:ring-slate-500 focus:outline-none">
            Back
          </button>
          
          <button (click)="start()" 
                  [disabled]="!acknowledged()"
                  class="flex-1 flex justify-center py-4 px-6 border border-transparent rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 shadow-lg shadow-blue-500/25">
            Start Exam
          </button>
        </div>
        
      </div>
    </div>
  `
})
export class DisclaimerComponent {
  private router = inject(Router);
  private examService = inject(ExamService);
  
  acknowledged = signal(false);

  toggleAcknowledge() {
    this.acknowledged.update(v => !v);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  start() {
    if (this.acknowledged()) {
      this.examService.startExam();
      this.router.navigate(['/exam']);
    }
  }
}
