import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  movie!: Movie;
  seats: string[] = [];
  selectedSeats: string[] = [];
  bookedSeats: string[] = [];
  isAdmin: boolean = false;

  totalAmount: number = 0;
  pricePerSeat: number = 150;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';

    this.movieService.getMovieById(movieId).subscribe(data => {
      this.movie = data;
    });

    this.http.get<string[]>(`http://localhost:5000/api/movies/${movieId}/seats`)
      .subscribe(data => {
        this.bookedSeats = data;
      });

    this.generateSeats();
  }

  generateSeats() {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    for (let row of rows) {
      for (let i = 1; i <= 10; i++) {
        this.seats.push(`${row}${i}`);
      }
    }
  }

  toggleSeat(seat: string) {
    if (this.bookedSeats.includes(seat)) return;

    const index = this.selectedSeats.indexOf(seat);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push(seat);
    }

    this.totalAmount = this.selectedSeats.length * this.pricePerSeat;
  }

  continueToConfirmation() {
    this.router.navigate(['/booking-confirmation'], {
      state: {
        selectedSeats: this.selectedSeats,
        totalAmount: this.totalAmount,
        movie: this.movie
      }
    });
  }
}
