import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioAdministracion } from '../../modelos/usuario.model';
import { passwordsIgualesValidator } from '../../validators/custom.validators';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-usuario',
  styleUrl: './usuario.component.css',
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  usuarios = signal<UsuarioAdministracion[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  mensajeExitoso = signal(false);
  usuarioCambiandoEstado = signal<string | null>(null);
  imagenPerfil: File | null = null;
  mensaje = signal('');
  errorLista = signal('');

  formUsuario = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u)]],
      fechaNacimiento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)]],
      repetirPassword: ['', Validators.required],
      descripcion: ['', Validators.maxLength(40)],
      perfil: ['usuario', Validators.required],
    },
    { validators: [passwordsIgualesValidator] },
  );

  constructor(private usuarioService: UsuarioService) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.cargando.set(true);
    this.errorLista.set('');
    try {
      this.usuarios.set(await this.usuarioService.listarParaAdministracion());
    } catch (error) {
      console.error('No se pudo cargar el listado de usuarios.', error);
      this.errorLista.set('No se pudo cargar el listado. Revisá tu sesión e intentá nuevamente.');
    } finally {
      this.cargando.set(false);
    }
  }

  seleccionarImagen(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagenPerfil = input.files?.[0] ?? null;
  }

  async crearUsuario() {
    this.mensaje.set('');
    this.mensajeExitoso.set(false);
    if (this.formUsuario.invalid || this.guardando()) {
      this.formUsuario.markAllAsTouched();
      return;
    }

    const valores = this.formUsuario.getRawValue();
    const datos = new FormData();
    datos.append('nombre', valores.nombre ?? '');
    datos.append('apellido', valores.apellido ?? '');
    datos.append('fechaNacimiento', valores.fechaNacimiento ?? '');
    datos.append('correo', valores.correo ?? '');
    datos.append('usuario', valores.usuario ?? '');
    datos.append('password', valores.password ?? '');
    datos.append('descripcion', valores.descripcion ?? '');
    datos.append('perfil', valores.perfil ?? 'usuario');
    if (this.imagenPerfil) datos.append('imagenPerfil', this.imagenPerfil);

    this.guardando.set(true);
    try {
      const creado = await this.usuarioService.crearDesdeAdministracion(datos);
      this.usuarios.update((lista) => [creado, ...lista]);
      this.formUsuario.reset({
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        correo: '',
        usuario: '',
        password: '',
        repetirPassword: '',
        descripcion: '',
        perfil: 'usuario',
      });
      this.imagenPerfil = null;
      this.mensaje.set('Usuario creado correctamente.');
      this.mensajeExitoso.set(true);
    } catch (error) {
      console.error('No se pudo crear el usuario.', error);
      this.mensaje.set(this.obtenerMensajeError(error, 'No se pudo crear el usuario.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async cambiarEstado(usuario: UsuarioAdministracion) {
    if (this.usuarioCambiandoEstado()) return;

    this.usuarioCambiandoEstado.set(usuario._id);
    this.errorLista.set('');
    try {
      if (usuario.estaHabilitado) {
        await this.usuarioService.deshabilitarUsuario(usuario._id);
      } else {
        await this.usuarioService.habilitarUsuario(usuario._id);
      }

      this.usuarios.update((lista) =>
        lista.map((actual) =>
          actual._id === usuario._id
            ? { ...actual, estaHabilitado: !actual.estaHabilitado }
            : actual,
        ),
      );
    } catch (error) {
      console.error('No se pudo cambiar el estado del usuario.', error);
      this.errorLista.set(this.obtenerMensajeError(error, 'No se pudo cambiar el estado del usuario.'));
    } finally {
      this.usuarioCambiandoEstado.set(null);
    }
  }

  private obtenerMensajeError(error: unknown, mensajePredeterminado: string): string {
    if (!(error instanceof HttpErrorResponse)) return mensajePredeterminado;
    const mensajeServidor = error.error?.message;
    if (Array.isArray(mensajeServidor)) return mensajeServidor.join(' ');
    if (typeof mensajeServidor === 'string') return mensajeServidor;
    if (error.status === 409) return 'El correo o nombre de usuario ya está registrado.';
    if (error.status === 401 || error.status === 403) return 'No tenés permisos para realizar esta acción.';
    return mensajePredeterminado;
  }
}
