import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioRespuesta } from '../../modelos/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
@Component({
  imports: [FormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  identificador = '';
  password = '';
  mensaje = signal('');
  usuarioEncontrado: UsuarioRespuesta | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService: UsuarioService,
  ) {}

  //Para el login uso FormsModule en lugar de ReactiveForms y le paso el formulario por parámetro.
  async iniciarSesion(formulario: NgForm) {
    if (formulario.invalid) {
      formulario.control.markAllAsTouched();
      return;
    }

    try {
      this.mensaje.set('ingresando...');

      //Llamó al login del servicio
      const respuesta = await this.authService.login(this.identificador, this.password);
      this.usuarioEncontrado = respuesta.usuario;
      sessionStorage.setItem('usuario', respuesta.usuario._id);
      sessionStorage.setItem('access_token', respuesta.access_token);
      await this.usuarioService.obtenerUsuarioActual();

      await this.router.navigate(['/inicio']);
    } catch (error) {
      console.log(error);

      this.mensaje.set(
        error instanceof HttpErrorResponse && error.status === 401
          ? 'Credenciales incorrectas.'
          : 'No se pudo conectar con el servidor.',
      );
    }
  }
}
