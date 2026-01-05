import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EventosService } from '../eventos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  conciertos: any[] = [];
  todosLosConciertos: any[] = [];
  form!: FormGroup;
  terminoBusqueda: string = '';

  editando = false;
  eventoId!: number;

  // 👇 controla el modal / formulario
  mostrarFormulario = false;

  constructor(
    private eventosService: EventosService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nameEvent: ['', Validators.required],
      descriptionEvent: [''],
      microserviceEventId: ['', Validators.required],
      venue: [''],
      dateTimeEvent: ['', Validators.required],
      capacity: [0],
      imageUrl: ['']
    });

    this.cargarConciertos();
  }

  // 🎬 Listar solo conciertos
  cargarConciertos() {
    this.eventosService.getEventos().subscribe({
      next: (res: any[]) => {
        this.conciertos = res.filter(e => e.eventType === 'concert');
        this.todosLosConciertos = [...this.conciertos];
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los conciertos', 'error');
      }
    });
  }

  // 🔍 Buscar conciertos
  buscarConciertos(event: any) {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    
    if (!termino) {
      this.conciertos = [...this.todosLosConciertos];
      return;
    }

    this.conciertos = this.todosLosConciertos.filter(concierto => 
      concierto.nameEvent.toLowerCase().includes(termino)
    );
  }

  // ➕ Abrir formulario (Agregar)
  abrirFormulario() {
    this.form.reset();
    this.editando = false;
    this.mostrarFormulario = true;
  }

  // ❌ Cerrar formulario
  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.reset();
  }

  // 💾 Crear / actualizar película
  guardar() {
    if (this.form.invalid) {
      Swal.fire('Formulario incompleto', 'Completa los campos obligatorios', 'warning');
      return;
    }

    const payload = {
      ...this.form.value,
      eventType: 'concert'
    };

    if (this.editando) {
      this.eventosService.actualizarEvento(this.eventoId, payload)
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'el concierto fue actualizado correctamente', 'success');
            this.cerrarFormulario();
            this.cargarConciertos();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo actualizar el concierto', 'error');
          }
        });

    } else {
      this.eventosService.crearEvento(payload)
        .subscribe({
          next: (response: any) => {
            Swal.fire('Concierto creado', 'El concierto se creó correctamente', 'success');
            this.cerrarFormulario();
            // Agregar el nuevo concierto al array sin recargar
            const nuevoConcierto = { ...payload, idEvent: response.idEvent };
            this.conciertos.push(nuevoConcierto);
            this.todosLosConciertos.push(nuevoConcierto);
          },
          error: () => {
            Swal.fire('Error', 'No se pudo crear el concierto', 'error');
          }
        });
    }
  }

  // ✏️ Editar
  editar(concierto: any) {
    this.editando = true;
    this.eventoId = concierto.idEvent;
    this.mostrarFormulario = true;

    this.form.patchValue({
      nameEvent: concierto.nameEvent,
      descriptionEvent: concierto.descriptionEvent,
      microserviceEventId: concierto.microserviceEventId,
      venue: concierto.venue,
      dateTimeEvent: concierto.dateTimeEvent,
      capacity: concierto.capacity,
      imageUrl: concierto.imageUrl
    });
  }

  // 🗑️ Eliminar (cancelar evento)
  eliminar(id: number) {
    Swal.fire({
      title: '¿Eliminar concierto?',
      text: 'Esta acción cancelará el evento',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.eventosService.eliminarEvento(id)
          .subscribe({
            next: () => {
              Swal.fire('Eliminado', 'El concierto fue eliminado', 'success');
              // Eliminar el concierto del array sin recargar
              this.conciertos = this.conciertos.filter(c => c.idEvent !== id);
              this.todosLosConciertos = this.todosLosConciertos.filter(c => c.idEvent !== id);
            },
            error: () => {
              Swal.fire('Error', 'No se pudo eliminar el concierto', 'error');
            }
          });
      }
    });
  }

  // 🔄 Reset formulario
  reset() {
    this.editando = false;
    this.eventoId = 0;
    this.form.reset();
  }
}