import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ClientesService } from '../services/cliente.service';
import { Cliente } from '../models/cliente.model';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent implements OnInit {

  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  filtro: string = '';

  constructor(
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  /* =========================
     CARGAR CLIENTES
  ========================= */
  cargarClientes(): void {
    this.clientesService.getClientes().subscribe((clientes: Cliente[]) => {
      this.clientes = clientes;
      this.clientesFiltrados = clientes;
    });
  }

  /* =========================
     FILTRAR
  ========================= */
  filtrar(): void {
    const texto = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.email.toLowerCase().includes(texto) ||
      c.documento.toLowerCase().includes(texto)
    );
  }

  /* =========================
     CREAR CLIENTE
  ========================= */
  crear(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  /* =========================
     EDITAR CLIENTE
  ========================= */
  editar(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  /* =========================
     CAMBIAR ESTADO (FRONT)
  ========================= */
  cambiarEstado(cliente: Cliente): void {
    cliente.activo = !cliente.activo;
  }

  /* =========================
     ELIMINAR (FRONT)
  ========================= */
  eliminar(cliente: Cliente): void {
    this.clientes = this.clientes.filter(c => c.id !== cliente.id);
    this.clientesFiltrados = this.clientesFiltrados.filter(c => c.id !== cliente.id);
  }
}
