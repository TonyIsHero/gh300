import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      <div class="max-w-2xl w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-10 lg:p-14 border border-slate-200 dark:border-white/10 text-center relative overflow-hidden">
        
        <!-- Background Decor -->
        <div class="absolute -top-32 -right-32 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 hidden dark:block"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 hidden dark:block"></div>

        <div class="relative z-10">
          <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Exam Results</h1>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-12">You have completed the GH 300 Preparation Exam</p>
          
          <div class="relative w-48 h-48 mx-auto mb-12">
            <!-- Circular Progress Background -->
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" class="text-slate-200 dark:text-slate-700/50" stroke-width="8" />
              <!-- Progress Arc -->
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" 
                      [class]="examService.percentage() >= 70 ? 'text-emerald-500' : 'text-red-500'" 
                      stroke-width="8" stroke-linecap="round" 
                      [style.stroke-dasharray]="circleDasharray()"
                      [style.stroke-dashoffset]="circleDashoffset()"
                      class="transition-all duration-1000 ease-out drop-shadow-lg" />
            </svg>
            
            <!-- Percentage Text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-5xl font-black text-slate-900 dark:text-white dark:mix-blend-plus-lighter">{{ examService.percentage() }}<span class="text-3xl text-slate-500 dark:text-slate-400">%</span></span>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 mb-12">
            <div class="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
              <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Score</p>
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ examService.score() }} <span class="text-slate-400 dark:text-slate-500">/ {{ examService.totalQuestions() }}</span></p>
            </div>
            <div class="bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50">
              <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Status</p>
              @if (examService.percentage() >= 70) {
                <p class="text-2xl font-bold text-emerald-500 dark:text-emerald-400">Passed</p>
              } @else {
                <p class="text-2xl font-bold text-red-500 dark:text-red-400">Failed</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button (click)="tryAgain()" class="group flex items-center justify-center gap-2 py-4 px-8 border border-transparent rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95">
              <svg class="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Try Again
            </button>
            <button (click)="endExam()" class="flex items-center justify-center py-4 px-8 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-95">
              End Exam
            </button>
          </div>
          
        </div>
      </div>
    </div>
  `
})
export class ResultsComponent {
  examService = inject(ExamService);
  private router = inject(Router);

  // Math for SVG Circle Arc (circumference = 2 * pi * radius = 2 * 3.14159 * 45 = 282.7)
  private readonly circumference = 2 * Math.PI * 45;

  circleDasharray() {
    return `${this.circumference} ${this.circumference}`;
  }

  circleDashoffset() {
    const percentage = this.examService.percentage();
    return this.circumference - (percentage / 100) * this.circumference;
  }

  tryAgain() {
    this.examService.clearProgress();
    this.examService.resetExam();
    this.router.navigate(['/exam']);
  }

  endExam() {
    this.examService.clearProgress();
    this.examService.resetExam();
    this.router.navigate(['/']);
  }
}
