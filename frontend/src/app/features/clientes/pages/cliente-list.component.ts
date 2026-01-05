import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../cliente.service';
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
  clientesFiltrados: any[] = [];
  filtroActual: string = 'todos';
  terminoBusqueda: string = '';

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
          direccionCliente: cliente.detallesMongo?.direccionCliente || '',
          menu: false // 👈 aseguramos que ningún menú esté abierto
        }));
        this.clientesFiltrados = [...this.clientes];
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
        this.cargarClientes();
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
    // 🔹 CERRAR TODOS LOS MENÚS ABIERTOS
    this.clientes.forEach(c => c.menu = false);

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

  /* ============================
     MÉTODOS MENÚ ⋮
     ============================ */

  editarDesdeMenu(cliente: any) {
    cliente.menu = false;
    this.abrirModalEditar(cliente);
  }

  eliminarDesdeMenu(cliente: any) {
    cliente.menu = false;
    this.eliminarCliente(cliente.idClientes);
  }

  // Métodos para búsqueda y filtrado
  aplicarFiltro(filtro: string): void {
    this.filtroActual = filtro;
    this.filtrarClientes();
  }

  filtrarClientes(): void {
    let clientesFiltrados = [...this.clientes];

    // Aplicar filtro por estado
    if (this.filtroActual === 'activos') {
      clientesFiltrados = clientesFiltrados.filter(cliente => true); // Todos los clientes están activos
    } else if (this.filtroActual === 'inactivos') {
      clientesFiltrados = clientesFiltrados.filter(cliente => false); // No hay clientes inactivos en este ejemplo
    }

    // Aplicar filtro de búsqueda
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase();
      clientesFiltrados = clientesFiltrados.filter(cliente => 
        cliente.nombreCliente.toLowerCase().includes(termino) ||
        cliente.cedulaCliente.toLowerCase().includes(termino) ||
        cliente.emailCliente.toLowerCase().includes(termino) ||
        cliente.telefonoCliente.toLowerCase().includes(termino) ||
        cliente.direccionCliente.toLowerCase().includes(termino)
      );
    }

    this.clientesFiltrados = clientesFiltrados;
  }

  buscarClientes(): void {
    this.filtrarClientes();
  }
}