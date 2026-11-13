import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioRespuesta } from '../../modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  usuario = '';
  password = '';
  mensaje = signal('');
  usuarioEncontrado: UsuarioRespuesta | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  async iniciarSesion(formulario: NgForm) {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    try {
      this.mensaje.set('ingresando...');
      const respuesta = await this.usuarioService.login(this.usuario, this.password);
      this.usuarioEncontrado = respuesta.usuario;
      this.usuarioService.usuarioActual.set(respuesta.usuario);
      sessionStorage.setItem('access_token', respuesta.access_token);
      await this.router.navigate(['/inicio']);
    } catch (error) {
      this.mensaje.set(
        error instanceof HttpErrorResponse && error.status === 401
          ? 'Credenciales incorrectas.'
          : 'No se pudo conectar con el servidor.',
      );
    }
  }
}
