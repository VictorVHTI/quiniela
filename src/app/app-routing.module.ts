import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NewsComponent } from './pages/news/news.component';
import { QuinielaDetailsComponent } from './pages/quiniela-details/quiniela-details.component';
import { CreditsComponent } from './pages/credits/credits.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'login/t/:pt', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'news', component: NewsComponent },
  { path: 'quiniela/:id', component: QuinielaDetailsComponent },
  { path: 'credits', component: CreditsComponent },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }