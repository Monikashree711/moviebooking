import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  showDetails: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const movieId = this.route.snapshot.paramMap.get('id');
    this.http.get(`http://localhost:3000/api/movies/${movieId}`).subscribe((data: any) => {
      this.movie = data;
    });
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
