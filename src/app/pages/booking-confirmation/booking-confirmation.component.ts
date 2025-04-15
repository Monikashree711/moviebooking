import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  selectedSeats: string[] = [];
  totalAmount: number = 0;
  movie: any;
  paymentMethod: string = 'Credit Card';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;
    if (state) {
      this.selectedSeats = state.selectedSeats;
      this.totalAmount = state.totalAmount;
      this.movie = state.movie;
    }
  }

  ngOnInit(): void {}

  confirmBooking() {
    const bookingData = {
      movie_id: this.movie.id,
      title: this.movie.title,
      selected_seats: this.selectedSeats,
      user_name: 'Guest',
      payment_method: this.paymentMethod
    };
  
    this.http.post<any>('http://localhost:5000/api/bookings', bookingData)
      .subscribe({
        next: (response) => {
          console.log('Booking response:', response); // 👈 optional for debugging
          const bookingId = response.id; // ✅ fixed key
          alert(`✅ Booking Confirmed!`);
          this.router.navigate(['/final-booking'], {
            state: {
              bookingDetails: {
                movie: this.movie,
                selectedSeats: this.selectedSeats,
                totalAmount: this.totalAmount,
                paymentMethod: this.paymentMethod,
                bookingId: bookingId
              }
            }
          });
        },
        error: (err) => {
          alert('❌ Booking failed.');
          console.error(err);
        }
      });
  }
  
  
}


