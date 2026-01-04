import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink], // importante para que routerLink funcione
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(private router: Router) {}

  login() {
    this.router.navigate(['/dashboard']);
  }
}
