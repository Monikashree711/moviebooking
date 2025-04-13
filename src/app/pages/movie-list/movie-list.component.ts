import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MovieService } from '../../services/movie.service'; 

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  standalone: true, // <-- if using `imports`, this must be standalone
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe((data: any[]) => {
      this.movies = data;
    });
  }
}
