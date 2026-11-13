import { UsuarioService } from '../../services/usuario.service';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Usuario } from '../../modelos/usuario.model';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';

@Component({
  imports: [FormsModule, RouterLink, ReactiveFormsModule],
  selector: 'app-registro',
  styleUrl: './registro.component.css',
  templateUrl: './registro.component.html',
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  mensaje = '';
  descripcion = signal('');
  imagenPerfil: File | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  formRegistro: FormGroup = this.fb.group({
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
  });

  async registrarUsuario() {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    try {
      const formulario = this.formRegistro.getRawValue();
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
      const respuesta = await this.usuarioService.registrar(datos);

      sessionStorage.setItem('access_token', respuesta.access_token);
      this.usuarioService.usuarioActual.set(respuesta.usuario);

      await this.router.navigate(['/publicaciones']);
    } catch (error) {
      console.log(error);
      this.mensaje = 'No se pudo registrar el usuario.';
    }
  }

  seleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagenPerfil = input.files?.[0] ?? null;
  }
}
