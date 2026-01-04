import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../clientes/cliente.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  cliente = {
    cedulaCliente: '',
    nombreCliente: '',
    usernameCliente: '',
    passwordCliente: '',
    correoCliente: '',
    celularCliente: '',
    direccionCliente: '',
    stadoCliente: 'ACTIVO'
  };

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) {}

  registrar() {
    const body = {
      cedulaCliente: this.cliente.cedulaCliente,
      nombreCliente: this.cliente.nombreCliente,
      usernameCliente: this.cliente.usernameCliente,
      passwordCliente: this.cliente.passwordCliente,
      direccionCliente: this.cliente.direccionCliente,
      telefonoCliente: this.cliente.celularCliente, 
      emailCliente: this.cliente.correoCliente,    
      tipoCliente: 'Regular'
    };

    this.clienteService.crearCliente(body).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrarse');
      }
    });
  }

  limpiarFormulario() {
    this.cliente = {
      cedulaCliente: '',
      nombreCliente: '',
      usernameCliente: '',
      passwordCliente: '',
      correoCliente: '',
      celularCliente: '',
      direccionCliente: '',
      stadoCliente: 'ACTIVO'
    };
  }
}
