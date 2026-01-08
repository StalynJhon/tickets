import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConcertService } from '../conciertos.service';

@Component({
  selector: 'app-conciertos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conciertos.component.html',
  styleUrls: ['./conciertos.component.css']
})
export class ConciertosComponent implements OnInit {

  conciertos: any[] = [];

  // 🎯 FORM ALINEADO AL BACKEND
  nuevoConcierto = {
    nameConcert: '',
    tourName: '',
    descriptionConcert: '',
    dateConcert: '',
    startTime: '',
    endTime: '',
    ticketPrice: null as number | null,
    vipPrice: null as number | null,
    durationMinutes: null as number | null
  };

  cargando = false;
  error = '';
  success = '';

  constructor(private concertService: ConcertService) {}

  ngOnInit(): void {
    this.obtenerConciertos();
  }

  obtenerConciertos() {
    this.concertService.getConciertos().subscribe({
      next: (data) => this.conciertos = data,
      error: () => this.error = 'Error al cargar conciertos'
    });
  }

  crearConcierto() {
    this.error = '';
    this.success = '';

    // ✅ Validación mínima (backend-safe)
    if (
      !this.nuevoConcierto.nameConcert ||
      !this.nuevoConcierto.dateConcert ||
      !this.nuevoConcierto.startTime ||
      !this.nuevoConcierto.ticketPrice
    ) {
      this.error = 'Nombre, fecha, hora y precio son obligatorios';
      return;
    }

    this.cargando = true;

    this.concertService.crearConcierto(this.nuevoConcierto).subscribe({
      next: () => {
        this.success = 'Concierto creado correctamente 🎉';

        // 🔄 Reset TOTAL del formulario
        this.nuevoConcierto = {
          nameConcert: '',
          tourName: '',
          descriptionConcert: '',
          dateConcert: '',
          startTime: '',
          endTime: '',
          ticketPrice: null,
          vipPrice: null,
          durationMinutes: null
        };

        this.obtenerConciertos();
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al crear el concierto';
        this.cargando = false;
      }
    });
  }
}
