import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-final-booking',
  templateUrl: './final-booking.component.html',
  styleUrls: ['./final-booking.component.css'],
  imports: [CommonModule]
})
export class FinalBookingComponent implements OnInit {
  bookings: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.movieService.getAllBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        console.log("✅ Bookings loaded:", this.bookings);
      },
      error: (err) => {
        console.error('❌ Error fetching bookings:', err);
      }
    });
  }
}
