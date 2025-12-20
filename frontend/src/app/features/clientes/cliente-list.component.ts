import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from './cliente.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  clientes: any[] = [];

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        // Mapeamos los campos de mongo al nivel principal con los nombres correctos
        this.clientes = data.map(cliente => ({
          ...cliente,
          emailCliente: cliente.detallesMongo?.emailCliente || '',
          telefonoCliente: cliente.detallesMongo?.telefonoCliente || '',
          direccionCliente: cliente.detallesMongo?.direccionCliente || ''
        }));
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  eliminarCliente(id: number) {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) {
      return;
    }

    this.clienteService.eliminarCliente(id).subscribe({
      next: () => {
        alert('Cliente eliminado correctamente');
        this.cargarClientes(); // refresca la tabla
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar cliente');
      }
    });
  }

  clienteEditando: any = null;
  mostrarModal = false;

  abrirModalEditar(cliente: any) {
    // copia para no modificar la tabla directamente
    this.clienteEditando = { ...cliente };

    // usamos los nombres originales del backend
    this.clienteEditando.emailCliente = cliente.emailCliente;
    this.clienteEditando.telefonoCliente = cliente.telefonoCliente;
    this.clienteEditando.direccionCliente = cliente.direccionCliente;

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.clienteEditando = null;
  }

  guardarEdicion() {
    this.clienteService
      .actualizarCliente(this.clienteEditando.idClientes, this.clienteEditando)
      .subscribe({
        next: () => {
          alert('Cliente actualizado correctamente');
          this.cerrarModal();
          this.cargarClientes();
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar cliente');
        }
      });
  }

}
