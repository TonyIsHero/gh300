import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-screen w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex overflow-hidden transition-colors duration-300">
      
      <!-- Left Navigation Panel -->
      <aside class="w-[60px] md:w-[80px] flex-shrink-0 border-r border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 overflow-y-auto custom-scrollbar">
        <div class="flex flex-col items-center py-6 space-y-4">
          @for (q of examService.activeQuestions(); track q.id; let i = $index) {
            <div class="relative group">
              <button (click)="examService.jumpToQuestion(i)"
                      class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all focus:outline-none"
                      [ngClass]="{
                        'border-emerald-500 text-emerald-600 dark:text-emerald-400': isAttempted(q.id) && examService.currentIndex() !== i,
                        'border-slate-300 dark:border-slate-600 text-slate-400 hover:border-slate-400 dark:hover:border-slate-400 hover:text-slate-600 dark:hover:text-slate-200': !isAttempted(q.id) && examService.currentIndex() !== i,
                        'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 border-transparent bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400': examService.currentIndex() === i
                      }">
                <span class="text-sm font-semibold">{{ i + 1 }}</span>
              </button>
            </div>
          }
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 overflow-y-auto py-10 px-4 md:px-10 custom-scrollbar">
        <div class="max-w-4xl mx-auto space-y-6 lg:space-y-10">
        
        <!-- Header / Progress -->
        <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700/50">
          <div class="flex-1 space-y-2">
            <h1 class="text-2xl lg:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300">
              GH 300 Preparation Exam
            </h1>
            <p class="text-slate-500 dark:text-slate-400 font-medium">
              Question {{ examService.currentIndex() + 1 }} of {{ examService.totalQuestions() }}
            </p>
          </div>
          <div class="w-full lg:w-64">
            <div class="relative w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700">
              <div class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out" 
                   [style.width.%]="examService.progress()">
              </div>
            </div>
          </div>
        </header>

        <!-- Question Area -->
        @if (examService.currentQuestion(); as q) {
          <div class="bg-white dark:bg-slate-800/80 rounded-3xl p-6 lg:p-10 shadow-xl dark:shadow-2xl border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
            
            <div class="flex items-start gap-4 mb-8">
               <span class="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-500/30">
                 {{ examService.currentIndex() + 1 }}
               </span>
               <h2 class="text-xl lg:text-2xl font-semibold leading-relaxed pt-1 text-slate-800 dark:text-white">
                 {{ q.text }}
               </h2>
            </div>

            <div class="space-y-4">
              <span class="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-300 uppercase mb-2">
                {{ q.type === 'single' ? 'Pick one' : 'Pick multiple' }}
              </span>

              @for (opt of q.options; track $index; let i = $index) {
                <label 
                  class="relative flex items-center p-5 rounded-2xl border cursor-pointer transition-all duration-200 group overflow-hidden"
                  [ngClass]="{
                    'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/50': !isSelected(i) && !examService.hasSubmittedCurrent(),
                    'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.5)]': isSelected(i) && !examService.hasSubmittedCurrent(),
                    'opacity-75 cursor-default': examService.hasSubmittedCurrent(),
                    'border-red-500 bg-red-50 dark:bg-red-500/10': isSelected(i) && examService.hasSubmittedCurrent() && !isCorrectOption(i),
                    'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10': isCorrectOption(i) && examService.hasSubmittedCurrent()
                  }"
                  (click)="toggleOption(i, q.type)">
                  
                  <!-- Checkbox / Radio Visual -->
                  <div class="flex-shrink-0 mr-4">
                    @if (q.type === 'single') {
                      <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm"
                           [ngClass]="getControlClass(i)">
                         <div class="w-2.5 h-2.5 rounded-full" [ngClass]="getControlDotClass(i)"></div>
                      </div>
                    } @else {
                      <div class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors shadow-sm"
                           [ngClass]="getControlClass(i)">
                         <svg *ngIf="isSelected(i) || (examService.hasSubmittedCurrent() && isCorrectOption(i))" 
                              class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                         </svg>
                      </div>
                    }
                  </div>

                  <!-- Text -->
                  <span class="flex-1 text-lg font-medium"
                        [ngClass]="getTextClass(i)">
                    {{ opt }}
                  </span>

                  <!-- Validation Icons -->
                  @if (examService.hasSubmittedCurrent()) {
                    <div class="ml-4 flex-shrink-0 animate-in fade-in zoom-in duration-300">
                      @if (isCorrectOption(i)) {
                        <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-200 dark:border-emerald-500/20">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      } @else if (isSelected(i)) {
                        <div class="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-red-200 dark:border-red-500/20">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </div>
                      }
                    </div>
                  }
                </label>
              }
            </div>

            <!-- Footer Actions -->
            <div class="mt-10 flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 pt-8">
              
              <!-- Result Text -->
              <div class="h-10 flex items-center">
                @if (examService.hasSubmittedCurrent()) {
                  <span class="text-lg font-bold flex items-center gap-2 animate-in slide-in-from-left-4 fade-in duration-300"
                        [ngClass]="examService.currentQuestionIsCorrect() ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                    @if (examService.currentQuestionIsCorrect()) {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Correct Answer!
                    } @else {
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Incorrect
                    }
                  </span>
                }
              </div>

              <!-- Buttons -->
              <div class="flex space-x-4">
                @if (!examService.hasSubmittedCurrent()) {
                  @if (examService.currentIndex() === examService.totalQuestions() - 1) {
                    <button (click)="finishExam()"
                            class="px-8 py-3.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-lg active:scale-95">
                      Finish Exam
                    </button>
                  } @else {
                    <button (click)="skip()"
                            class="px-8 py-3.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all active:scale-95 shadow-lg">
                      Skip Question
                    </button>
                  }
                  <button (click)="submit()"
                          [disabled]="examService.currentSelection().length === 0"
                          class="px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit Answer
                  </button>
                } @else {
                  @if (examService.currentIndex() === examService.totalQuestions() - 1) {
                    <button (click)="finishExam()"
                            class="px-8 py-3.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-lg active:scale-95">
                      Finish Exam
                    </button>
                  } @else {
                    <button (click)="next()"
                            class="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-slate-800 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 dark:focus:ring-white focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all shadow-xl shadow-slate-800/10 dark:shadow-white/10 active:scale-95">
                      Next Question
                      <svg class="w-5 h-5 text-white dark:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  }
                }
              </div>

            </div>
          </div>
        }
        </div>
      </div>
    </div>
  `
})
export class ExamComponent {
  examService = inject(ExamService);
  private router = inject(Router);

  isAttempted(id: number) {
    return this.examService.submittedQuestions().has(id);
  }

  skip() {
    this.next();
  }

  isSelected(index: number) {
    return this.examService.currentSelection().includes(index);
  }

  isCorrectOption(index: number) {
    const q = this.examService.currentQuestion();
    return q ? q.correctAnswers.includes(index) : false;
  }

  toggleOption(index: number, type: 'single' | 'multiple') {
    if (this.examService.hasSubmittedCurrent()) return;
    this.examService.toggleAnswer(index, type);
  }

  submit() {
    if (this.examService.currentSelection().length > 0) {
      this.examService.submitCurrentQuestion();
    }
  }

  next() {
    const isFinished = this.examService.currentIndex() === this.examService.totalQuestions() - 1;
    if (isFinished) {
      this.finishExam();
    } else {
      this.examService.nextQuestion();
    }
  }

  finishExam() {
    this.examService.isExamFinished.set(true);
    this.router.navigate(['/results']);
  }

  // --- Dynamic Styling Helpers ---
  getControlClass(index: number) {
    const submitted = this.examService.hasSubmittedCurrent();
    const selected = this.isSelected(index);
    const correct = this.isCorrectOption(index);

    if (!submitted) {
      if (selected) return 'border-blue-500 bg-blue-500';
      return 'border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-blue-400 dark:group-hover:border-blue-400 group-hover:bg-slate-50 dark:group-hover:bg-slate-700';
    } else {
      if (correct) return 'border-emerald-500 bg-emerald-500';
      if (selected && !correct) return 'border-red-500 bg-red-500';
      return 'border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 opacity-50';
    }
  }

  getControlDotClass(index: number) {
    const submitted = this.examService.hasSubmittedCurrent();
    if (!submitted) {
      return this.isSelected(index) ? 'bg-white' : 'bg-transparent';
    } else {
      if (this.isCorrectOption(index)) return 'bg-white';
      return (this.isSelected(index) && !this.isCorrectOption(index)) ? 'bg-white' : 'bg-transparent';
    }
  }

  getTextClass(index: number) {
    const submitted = this.examService.hasSubmittedCurrent();
    const selected = this.isSelected(index);
    const correct = this.isCorrectOption(index);

    if (!submitted) {
      return selected ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-200';
    } else {
      if (correct) return 'text-emerald-600 dark:text-emerald-300 font-semibold';
      if (selected && !correct) return 'text-red-600 dark:text-red-300';
      return 'text-slate-400 dark:text-slate-500';
    }
  }
}
