import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { ClientesService, Cliente } from '../cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent implements OnInit {

  form!: FormGroup;
  editando = false;
  idCliente!: number;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      documento: ['', Validators.required]
    });

    this.idCliente = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idCliente) {
      this.editando = true;

      this.clientesService
        .getClienteById(this.idCliente)
        .subscribe(cliente => {
          this.form.patchValue(cliente);
        });
    }
  }

  guardar(): void {
    if (this.form.invalid) return;

    const cliente: Cliente = this.form.value;

    if (this.editando) {
      this.clientesService
        .actualizarCliente(this.idCliente, cliente)
        .subscribe(() => this.router.navigate(['/clientes']));
    } else {
      this.clientesService
        .crearCliente(cliente)
        .subscribe(() => this.router.navigate(['/clientes']));
    }
  }
}
