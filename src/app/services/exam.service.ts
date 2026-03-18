import { Injectable, signal, computed, effect } from '@angular/core';
import { Question } from '../models/question.model';
import { EXAM_QUESTIONS } from '../data/questions';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  // State
  private readonly allQuestions = signal<Question[]>(EXAM_QUESTIONS);
  
  // The user requested all 123 questions to be there in the same order as they are in the dump.
  readonly activeQuestions = signal<Question[]>(EXAM_QUESTIONS);
  
  readonly currentIndex = signal<number>(0);
  readonly userAnswers = signal<Map<number, number[]>>(new Map());
  readonly submittedQuestions = signal<Set<number>>(new Set());
  readonly isExamFinished = signal<boolean>(false);

  // Computed
  readonly hasSubmittedCurrent = computed(() => {
    const q = this.currentQuestion();
    return q ? this.submittedQuestions().has(q.id) : false;
  });

  // Computed
  readonly currentQuestion = computed(() => {
    const questions = this.activeQuestions();
    const idx = this.currentIndex();
    return questions.length > idx ? questions[idx] : null;
  });

  readonly totalQuestions = computed(() => this.activeQuestions().length);
  
  readonly progress = computed(() => {
    const total = this.totalQuestions();
    if (total === 0) return 0;
    return ((this.currentIndex() + 1) / total) * 100;
  });

  readonly currentSelection = computed(() => {
    const q = this.currentQuestion();
    if (!q) return [];
    const answers = this.userAnswers().get(q.id);
    return answers || [];
  });

  readonly currentQuestionIsCorrect = computed(() => {
    const q = this.currentQuestion();
    if (!q) return false;
    const selected = this.currentSelection();
    const correct = q.correctAnswers;
    if (selected.length !== correct.length) return false;
    const sortedSelected = [...selected].sort();
    const sortedCorrect = [...correct].sort();
    return sortedSelected.every((val, index) => val === sortedCorrect[index]);
  });

  readonly score = computed(() => {
    let correctCount = 0;
    const answers = this.userAnswers();
    this.activeQuestions().forEach(q => {
      const selected = answers.get(q.id) || [];
      if (selected.length === q.correctAnswers.length) {
        const sortedSelected = [...selected].sort();
        const sortedCorrect = [...q.correctAnswers].sort();
        if (sortedSelected.every((val, index) => val === sortedCorrect[index])) {
          correctCount++;
        }
      }
    });
    return correctCount;
  });

  readonly percentage = computed(() => {
    const total = this.totalQuestions();
    if (total === 0) return 0;
    return Math.round((this.score() / total) * 100);
  });

  constructor() {
    this.loadProgress();

    effect(() => {
      const state = {
        currentIndex: this.currentIndex(),
        userAnswers: Array.from(this.userAnswers().entries()),
        submittedQuestions: Array.from(this.submittedQuestions().values()),
        isExamFinished: this.isExamFinished()
      };
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('gh300_progress', JSON.stringify(state));
      }
    });
  }

  private loadProgress() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('gh300_progress');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.currentIndex !== undefined) this.currentIndex.set(parsed.currentIndex);
          if (parsed.userAnswers) this.userAnswers.set(new Map(parsed.userAnswers));
          if (parsed.submittedQuestions) this.submittedQuestions.set(new Set(parsed.submittedQuestions));
          if (parsed.isExamFinished !== undefined) this.isExamFinished.set(parsed.isExamFinished);
        } catch (e) {
          console.error('Error loading progress', e);
        }
      }
    }
  }

  clearProgress() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('gh300_progress');
    }
  }

  startExam() {
    this.activeQuestions.set(this.allQuestions());
    this.currentIndex.set(0);
    this.userAnswers.set(new Map());
    this.submittedQuestions.set(new Set());
    this.isExamFinished.set(false);
  }

  toggleAnswer(optionIndex: number, type: 'single' | 'multiple') {
    if (this.hasSubmittedCurrent()) return; // Cannot change after submit
    const q = this.currentQuestion();
    if (!q) return;

    this.userAnswers.update(answers => {
      const newAnswers = new Map(answers);
      const current = newAnswers.get(q.id) || [];
      
      if (type === 'single') {
        newAnswers.set(q.id, [optionIndex]);
      } else {
        if (current.includes(optionIndex)) {
          newAnswers.set(q.id, current.filter(i => i !== optionIndex));
        } else {
          newAnswers.set(q.id, [...current, optionIndex]);
        }
      }
      return newAnswers;
    });
  }

  submitCurrentQuestion() {
    const q = this.currentQuestion();
    if (q) {
      this.submittedQuestions.update(set => {
        const newSet = new Set(set);
        newSet.add(q.id);
        return newSet;
      });
    }
  }

  nextQuestion() {
    if (this.currentIndex() < this.totalQuestions() - 1) {
      this.currentIndex.update(i => i + 1);
    } else {
      this.isExamFinished.set(true);
    }
  }

  jumpToQuestion(index: number) {
    if (index >= 0 && index < this.totalQuestions()) {
      this.currentIndex.set(index);
    }
  }

  resetExam() {
    this.startExam();
  }
}
