import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login-component',
  styleUrl: './login-component.css',
  templateUrl: './login-component.html',
})
export class LoginComponent {
  usuario = '';
  password = '';
  mensaje = '';

  async iniciarSesion(formulario: NgForm): Promise<void> {
    this.mensaje = '';
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      this.mensaje = 'Ingresá un correo y contraseña válidos.';
      return;
    }
    //LOGIN BASICO PARA PROBAR FUNCIONALIDAD.
    //CAMBIAR POR MATCHEO A DB
    this.mensaje =
      this.usuario == 'user' && this.password == 'password'
        ? 'Bienvenido'
        : 'Credenciales inválidas';
  }
}
