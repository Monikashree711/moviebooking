import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection.component';
import { BookingConfirmationComponent } from './pages/booking-confirmation/booking-confirmation.component';


export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'movies/:id/book', component: SeatSelectionComponent },
  { path: 'booking/:id', component: BookingConfirmationComponent },
  { path: '**', redirectTo: 'movies' }
];
