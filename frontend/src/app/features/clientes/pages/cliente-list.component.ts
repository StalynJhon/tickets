import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../cliente.service';

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
  terminoBusqueda = '';

  mostrarModal = false;
  editando = false;
  clienteEditandoId: number | null = null;

  clienteForm: any = {
    cedulaCliente: '',
    nombreCliente: '',
    usernameCliente: '',
    passwordCliente: '',
    emailCliente: '',
    telefonoCliente: '',
    direccionCliente: ''
  };

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  /* ===============================
     CARGAR CLIENTES
  =============================== */
  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data.map(cliente => ({
          ...cliente,
          stadoCliente: cliente.stadoCliente ?? 'activo',

          // 🔹 CORRECCIÓN: usamos directamente los campos devueltos por el backend
          emailCliente: cliente.correoCliente ?? '',
          telefonoCliente: cliente.telefonoCliente ?? '',
          direccionCliente: cliente.direccionCliente ?? '',
          tipoCliente: cliente.tipoCliente ?? 'Regular',
          menu: false
        }));

        this.clientesFiltrados = [...this.clientes];
      },
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  /* ===============================
     BUSCAR CLIENTES
  =============================== */
  buscarClientes() {
    const term = this.terminoBusqueda.toLowerCase();

    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombreCliente?.toLowerCase().includes(term) ||
      c.cedulaCliente?.toLowerCase().includes(term) ||
      c.usernameCliente?.toLowerCase().includes(term) ||
      c.emailCliente?.toLowerCase().includes(term)
    );
  }

  /* ===============================
     CAMBIAR ESTADO
  =============================== */
  cambiarEstado(cliente: any) {
    const nuevoEstado = cliente.stadoCliente === 'activo' ? 'inactivo' : 'activo';
    const payload = { ...cliente, stadoCliente: nuevoEstado };

    if (!payload.passwordCliente) delete payload.passwordCliente;

    this.clienteService.actualizarCliente(cliente.idClientes, payload).subscribe({
      next: () => { cliente.stadoCliente = nuevoEstado; },
      error: () => alert('Error al cambiar estado')
    });
  }

  /* ===============================
     MODAL
  =============================== */
  abrirModalCrear() {
    this.editando = false;
    this.limpiarFormulario();
    this.mostrarModal = true;
  }

  abrirModalEditar(cliente: any) {
    this.editando = true;
    this.clienteEditandoId = cliente.idClientes;

    this.clienteForm = {
      cedulaCliente: cliente.cedulaCliente,
      nombreCliente: cliente.nombreCliente,
      usernameCliente: cliente.usernameCliente,
      passwordCliente: '',
      emailCliente: cliente.emailCliente,
      telefonoCliente: cliente.telefonoCliente,
      direccionCliente: cliente.direccionCliente
    };

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.clienteForm = {
      cedulaCliente: '',
      nombreCliente: '',
      usernameCliente: '',
      passwordCliente: '',
      emailCliente: '',
      telefonoCliente: '',
      direccionCliente: ''
    };
    this.clienteEditandoId = null;
  }

  /* ===============================
     GUARDAR CLIENTE
  =============================== */
  guardarCliente() {
    const payload = { ...this.clienteForm };
    if (!this.editando && !payload.passwordCliente) {
      alert('La contraseña es obligatoria');
      return;
    }

    if (this.editando && !payload.passwordCliente) delete payload.passwordCliente;

    if (this.editando && this.clienteEditandoId) {
      this.clienteService.actualizarCliente(this.clienteEditandoId, payload).subscribe({
        next: () => { this.cerrarModal(); this.cargarClientes(); },
        error: () => alert('Error al actualizar cliente')
      });
    } else {
      this.clienteService.crearCliente(payload).subscribe({
        next: () => { this.cerrarModal(); this.cargarClientes(); },
        error: () => alert('Error al crear cliente')
      });
    }
  }

  /* ===============================
     ELIMINAR CLIENTE
  =============================== */
  eliminarCliente(id: number) {
    if (!confirm('¿Desea eliminar este cliente?')) return;

    this.clienteService.eliminarCliente(id).subscribe({
      next: () => this.cargarClientes(),
      error: () => alert('Error al eliminar cliente')
    });
  }
}
