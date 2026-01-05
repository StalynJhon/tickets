import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MovieService } from '../../../../core/services/movie.service';
import { Movie } from '../../../../entities/movie/movie.model';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css']
})
export class MovieFormComponent {

  movie: Movie = {
    title: '',
    genre: ''
  };

  loading = false;
  error: string | null = null;

  isEdit = false;
 movieId!: number;

  constructor(private movieService: MovieService,
    private route: ActivatedRoute,
  private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEdit = true;
      this.movieId = Number(id);

      this.movieService.getMovieById(this.movieId).subscribe({
        next: (data) => {
          this.movie = data;
        },
        error: () => {
          this.error = 'Error al cargar la película';
        }
      });
    }
  }
  submit(): void {
    this.loading = true;
    this.error = null;

    this.movieService.createMovie(this.movie).subscribe({
      next: () => {
        this.loading = false;
        this.movie = { title: '', genre: '' };
        alert('Película creada correctamente');
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al crear la película';
        this.loading = false;
      }
    });
  }
}