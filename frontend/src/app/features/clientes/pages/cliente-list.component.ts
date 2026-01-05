import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ClientesService, Cliente } from '../cliente.service';

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

  cargarClientes(): void {
    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      this.clientesFiltrados = clientes;
    });
  }

  filtrar(): void {
    const texto = this.filtro.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(texto) ||
      c.email.toLowerCase().includes(texto) ||
      c.documento.toLowerCase().includes(texto)
    );
  }

  crear(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  editar(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  cambiarEstado(cliente: Cliente): void {
    cliente.activo = !cliente.activo;
  }

  eliminar(cliente: Cliente): void {
    this.clientes = this.clientes.filter(c => c.id !== cliente.id);
    this.clientesFiltrados = this.clientesFiltrados.filter(c => c.id !== cliente.id);
  }
}
