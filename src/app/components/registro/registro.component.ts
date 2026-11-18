import { passwordsIgualesValidator } from './../../validators/custom.validators';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  selector: 'app-registro',
  styleUrl: './registro.component.css',
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  mensaje = signal('');
  descripcion = signal('');
  imagenPerfil: File | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  //DISEÑO DEL FORMULARIO DE REGISTRO
  formRegistro: FormGroup = this.fb.group(
    {
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required]],
      usuario: ['', [Validators.required, Validators.minLength(4)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      repetirPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
      descripcion: ['', [Validators.maxLength(40)]],
    },
    {
      validators: [passwordsIgualesValidator],
    },
  );

  async registrarUsuario() {
    this.mensaje.set('');
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    try {
      //Guardo el formulario en una variable
      const formulario = this.formRegistro.getRawValue();

      //Instancio un FormData para guardar los valores del formulario
      const datos = new FormData();
      datos.append('nombre', formulario.nombre);
      datos.append('apellido', formulario.apellido);
      datos.append('correo', formulario.correo);
      datos.append('fechaNacimiento', formulario.fechaNacimiento);
      datos.append('usuario', formulario.usuario);
      datos.append('password', formulario.password);
      datos.append('descripcion', formulario.descripcion);
      datos.append('perfil', 'usuario');
      if (this.imagenPerfil) {
        datos.append('imagenPerfil', this.imagenPerfil);
      }

      //Acá envío la variable de tipo FormData al backend por medio del método del servicio.
      //El back devuelve la respuesta como {usuario, access_token}.
      const respuesta = await this.authService.registrar(datos);

      //Guardo el token y usuario id
      this.authService.guardarSesion(respuesta);

      await this.router.navigate(['/publicaciones']);
    } catch (error) {
      console.log(error);
      if (error instanceof HttpErrorResponse && error.status === 409) {
        const mensajeServidor = error.error?.message;
        this.mensaje.set(
          Array.isArray(mensajeServidor)
            ? mensajeServidor.join(' ')
            : mensajeServidor || 'El correo o nombre de usuario ya está registrado.',
        );
      } else if (error instanceof HttpErrorResponse && error.status === 400) {
        const mensajeServidor = error.error?.message;
        this.mensaje.set(
          Array.isArray(mensajeServidor)
            ? mensajeServidor.join(' ')
            : mensajeServidor || 'Revisá los datos ingresados.',
        );
      } else {
        this.mensaje.set('No se pudo registrar el usuario. Intentá nuevamente.');
      }
    }
  }

  seleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagenPerfil = input.files?.[0] ?? null;
  }
}
