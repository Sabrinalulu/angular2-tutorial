import { NgModule } from '@angular/core';
// the app can have routing functionality
import { RouterModule, Routes } from '@angular/router';
// HeroesComponent, will give the Router somewhere to go once you configure the routes
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { HeroDetailComponent }  from './hero-detail/hero-detail.component';

// Routes tell the Router which view to display when a user clicks a link or pastes a URL into the browser address bar
// already imports the heroescomponent -> use it directly
// The typical route includes
// path: a string that matches the URL in the browser address bar
// component: the component that the router should create when navigating to this route
// This tells the router to match that URL to path: 'heroes' and display the HeroesComponent when the URL is something like localhost:4200/heroes
const routes: Routes = [
  
  // default route
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'heroes', component: HeroesComponent }
];

@NgModule({
  // initializes the router and starts it listening for browser location changes
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }