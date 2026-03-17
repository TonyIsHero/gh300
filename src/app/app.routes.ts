import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { ExamComponent } from './components/exam/exam.component';
import { ResultsComponent } from './components/results/results.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: 'exam', component: ExamComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
