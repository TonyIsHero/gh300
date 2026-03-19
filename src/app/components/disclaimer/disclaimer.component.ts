import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExamService, ExamMode } from '../../services/exam.service';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-4 transition-colors duration-500">
      <div class="max-w-2xl w-full bg-white dark:bg-[#0f0f13] rounded-3xl shadow-2xl p-10 border border-slate-200 dark:border-white/10">
        
        <div class="flex items-center space-x-4 mb-8">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Before we begin</h2>
        </div>

        <div class="bg-slate-100/50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/5 mb-8 backdrop-blur-sm shadow-inner">
          @if (mode() === 'mock') {
            <p class="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
              This is a mock exam trying to replicate the official GH 300, there will be a <strong class="text-slate-900 dark:text-white">120 minutes timer</strong>, pass marks is <strong class="text-slate-900 dark:text-white">70%</strong>. 
              <br/><br/>
              <strong class="text-slate-900 dark:text-white">54 questions</strong> will be randomly shuffled out of the total 123 questions.
            </p>
          } @else {
            <p class="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
              There are <strong class="text-slate-900 dark:text-white">123 questions</strong> here, out of which <strong class="text-slate-900 dark:text-white">54</strong> will be in the official exam. 
              <span class="text-blue-600 dark:text-blue-400 font-medium">90% questions should match.</span>
            </p>
          }
        </div>

        <label class="flex items-center space-x-4 cursor-pointer group mb-10 p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
          <div class="relative flex items-center justify-center">
            <input type="checkbox"
                   class="peer sr-only"
                   [checked]="acknowledged()"
                   (change)="toggleAcknowledge()" />
            <div class="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-black peer-checked:bg-slate-900 dark:peer-checked:bg-white peer-checked:border-slate-900 dark:peer-checked:border-white transition-all peer-focus:ring-2 peer-focus:ring-slate-500/50"></div>
            <svg class="absolute w-4 h-4 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span class="text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Yes, I acknowledge and understand these conditions.
          </span>
        </label>

        <div class="flex space-x-4">
          <button (click)="goBack()" class="flex-1 py-4 px-6 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-white/5 focus:bg-slate-200 dark:focus:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors focus:ring-2 focus:ring-slate-500 focus:outline-none">
            Back
          </button>
          
          <button (click)="start()" 
                  [disabled]="!acknowledged()"
                  class="flex-1 flex justify-center py-4 px-6 border border-transparent rounded-xl text-white dark:text-black font-bold bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-white focus:ring-offset-white dark:focus:ring-offset-black transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg">
            Start Exam
          </button>
        </div>
        
      </div>
    </div>
  `
})
export class DisclaimerComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private examService = inject(ExamService);
  
  acknowledged = signal(false);
  mode = signal<ExamMode>('practise');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['mode']) {
        this.mode.set(params['mode'] as ExamMode);
      }
    });
  }

  toggleAcknowledge() {
    this.acknowledged.update(v => !v);
  }

  goBack() {
    this.router.navigate(['/']);
  }

  start() {
    if (this.acknowledged()) {
      this.examService.startExam(this.mode());
      this.router.navigate(['/exam']);
    }
  }
}
