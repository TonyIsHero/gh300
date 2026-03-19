import { Component, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-black flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      <div class="w-full bg-white/90 dark:bg-[#0f0f13]/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl p-6 lg:p-14 border border-slate-200 dark:border-white/10 text-center relative overflow-hidden transition-all duration-500"
           [ngClass]="examService.mode() === 'mock' ? 'max-w-4xl' : 'max-w-2xl'">
        
        <!-- Background Decor -->
        <div class="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 hidden dark:block transition-all"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 hidden dark:block transition-all"></div>

        <div class="relative z-10">
          <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Exam Results</h1>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-12">You have completed the GH 300 {{ examService.mode() === 'mock' ? 'Mock' : 'Practise' }} Exam</p>
          
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
            <div class="bg-slate-100/50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/5">
              <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Score</p>
              <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ examService.score() }} <span class="text-slate-400 dark:text-slate-500">/ {{ examService.totalQuestions() }}</span></p>
            </div>
            <div class="bg-slate-100/50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/5">
              <p class="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider mb-1">Status</p>
              @if (examService.percentage() >= 70) {
                <p class="text-2xl font-bold text-emerald-500 dark:text-emerald-400">Passed</p>
              } @else {
                <p class="text-2xl font-bold text-red-500 dark:text-red-400">Failed</p>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <button (click)="tryAgain()" class="group flex items-center justify-center gap-2 py-4 px-8 border border-transparent rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-all shadow-lg active:scale-95">
              Try Again
            </button>
            @if (examService.mode() === 'mock') {
              <button (click)="showReview = !showReview" class="flex items-center justify-center gap-2 py-4 px-8 border border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition-all shadow-sm active:scale-95">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                {{ showReview ? 'Hide Review' : 'Review Mistakes' }}
              </button>
              <button (click)="printResults()" class="flex items-center justify-center gap-2 py-4 px-8 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95 print:hidden">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                Print
              </button>
            }
            <button (click)="endExam()" class="flex items-center justify-center py-4 px-8 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-95">
              End Exam
            </button>
          </div>

          <!-- Review Block -->
          @if (showReview) {
            <div class="mt-12 text-left space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
              <h2 class="text-2xl font-bold border-b-2 border-slate-200 dark:border-white/10 pb-3 text-slate-900 dark:text-white">Areas for Improvement</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                @for (q of incorrectQuestions(); track q.id) {
                  <div class="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col group hover:shadow-lg transition-all">
                    @if (q.category) {
                      <span class="self-start px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                        {{ q.category }}
                      </span>
                    }
                    <p class="font-bold text-base md:text-lg mb-4 text-slate-800 dark:text-slate-200 flex-1">{{ q.text }}</p>
                    <div class="mt-auto">
                      <p class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Correct Answer(s):</p>
                      <ul class="list-disc pl-5 mb-4 text-slate-600 dark:text-slate-400 font-medium space-y-1 text-sm">
                        @for (ans of q.correctAnswers; track ans) {
                          <li>{{ q.options[ans] }}</li>
                        }
                      </ul>
                      @if (q.explanation) {
                        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl">
                          <p class="text-[13px] font-bold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            Explanation
                          </p>
                          <p class="text-[13px] text-blue-700 dark:text-blue-400 font-medium">{{ q.explanation }}</p>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              @if (incorrectQuestions().length === 0) {
                <div class="p-6 text-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl font-bold border border-emerald-200 dark:border-emerald-800/50">
                  <span class="text-4xl block mb-2">🏆</span>
                  Perfect Score! You made no mistakes.
                </div>
              }
            </div>
          }
          
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

  showReview = false;

  readonly incorrectQuestions = computed(() => {
    const answers = this.examService.userAnswers();
    return this.examService.activeQuestions().filter(q => {
      const selected = answers.get(q.id) || [];
      if (selected.length !== q.correctAnswers.length) return true;
      const sortedSelected = [...selected].sort();
      const sortedCorrect = [...q.correctAnswers].sort();
      return !sortedSelected.every((val, index) => val === sortedCorrect[index]);
    });
  });

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

  printResults() {
    window.print();
  }

  endExam() {
    this.examService.clearProgress();
    this.examService.resetExam();
    this.router.navigate(['/']);
  }
}
