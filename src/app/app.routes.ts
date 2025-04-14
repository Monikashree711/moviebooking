import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';



export const appRoutes: Routes = [
  { path: '', component: MovieListComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  {
    path: 'movies/:id/seats',
    loadComponent: () =>
      import('./pages/seat-selection/seat-selection.component').then(m => m.SeatSelectionComponent)
  },
  {
    path: 'booking-confirmation',
    loadComponent: () =>
      import('./pages/booking-confirmation/booking-confirmation.component')
        .then(m => m.BookingConfirmationComponent)
  }
];

