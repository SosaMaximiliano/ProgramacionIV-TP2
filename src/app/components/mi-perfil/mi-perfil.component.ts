import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { PublicacionCard } from '../publicacion-card/publicacion-card.component';
import { ComentariosService } from '../../services/comentarios.service';
import { ComentarioCardComponent } from '../comentario-card/comentario-card.component';
import { ComentarioRespuesta } from '../../modelos/comentario.model';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

type PublicacionConComentarios = PublicacionRespuesta & {
  comentarios: ComentarioRespuesta[];
};

@Component({
  imports: [PublicacionCard, ComentarioCardComponent, ReactiveFormsModule],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.component.css',
  templateUrl: './mi-perfil.component.html',
})
export class MiPerfilComponent {
  private fb = inject(FormBuilder);
  publicaciones = signal<PublicacionConComentarios[]>([]);
  offset = signal(0);
  readonly limit = 10;
  hayMas = signal(false);
  editandoPerfil = signal(false);
  guardandoPerfil = signal(false);
  mensajePerfil = signal('');
  imagenNueva: File | null = null;

  formPerfil = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u)]],
    fechaNacimiento: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(12)]],
    descripcion: ['', Validators.maxLength(100)],
  });

  constructor(
    public authService: AuthService,
    private publicacionesService: PublicacionesService,
    private comentarioService: ComentariosService,
    public usuarioService: UsuarioService,
  ) {}

  async ngOnInit(): Promise<void> {
    const publicaciones = await this.publicacionesService.traerUltimasPorUsuario(
      this.usuarioService.usuarioActual()?._id ?? '',
    );

    const publicacionesConComentarios = await Promise.all(
      publicaciones.map(async (post) => ({
        ...post,
        comentarios: await this.comentarioService.traerPorPublicacion(
          post._id,
          this.offset(),
          this.limit,
        ),
      })),
    );

    this.publicaciones.set(publicacionesConComentarios);
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const [yyyy, mm, dd] = fechaNacimiento.split('-').map(Number);

    let edad = hoy.getFullYear() - yyyy;

    const aunNoCumplio =
      hoy.getMonth() + 1 < mm || (hoy.getMonth() + 1 === mm && hoy.getDate() < dd);

    if (aunNoCumplio) {
      edad--;
    }

    return edad;
  }

  async cambiarLike(idPost: string) {
    const actualizada = await this.publicacionesService.meGustaToggle(idPost);

    if (!actualizada) return;

    this.publicaciones.update((lista) =>
      lista.map((post) => (post._id === idPost ? { ...post, ...actualizada } : post)),
    );
  }

  iniciarEdicionPerfil() {
    const usuario = this.usuarioService.usuarioActual();
    if (!usuario) return;

    this.formPerfil.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      fechaNacimiento: usuario.fechaNacimiento,
      correo: usuario.correo,
      usuario: usuario.usuario,
      descripcion: usuario.descripcion ?? '',
    });
    this.imagenNueva = null;
    this.mensajePerfil.set('');
    this.editandoPerfil.set(true);
  }

  cancelarEdicionPerfil() {
    this.editandoPerfil.set(false);
    this.mensajePerfil.set('');
    this.imagenNueva = null;
  }

  seleccionarImagenPerfil(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.imagenNueva = input.files?.[0] ?? null;
  }

  async guardarPerfil() {
    const usuario = this.usuarioService.usuarioActual();
    if (!usuario || this.guardandoPerfil()) return;
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }

    const valores = this.formPerfil.getRawValue();
    const datos = new FormData();
    datos.append('nombre', valores.nombre ?? '');
    datos.append('apellido', valores.apellido ?? '');
    datos.append('fechaNacimiento', valores.fechaNacimiento ?? '');
    datos.append('correo', valores.correo ?? '');
    datos.append('usuario', valores.usuario ?? '');
    datos.append('descripcion', valores.descripcion ?? '');
    if (this.imagenNueva) datos.append('imagenPerfil', this.imagenNueva);

    this.guardandoPerfil.set(true);
    this.mensajePerfil.set('');
    try {
      await this.usuarioService.actualizarPerfil(usuario._id, datos);
      this.editandoPerfil.set(false);
      this.mensajePerfil.set('Tu perfil se actualizó correctamente.');
    } catch (error) {
      const mensajeServidor = error instanceof HttpErrorResponse ? error.error?.message : null;
      this.mensajePerfil.set(
        error instanceof HttpErrorResponse && error.status === 409
          ? Array.isArray(mensajeServidor)
            ? mensajeServidor.join(' ')
            : mensajeServidor || 'El correo o nombre de usuario ya está registrado.'
          : 'No se pudo actualizar el perfil. Revisá los datos e intentá nuevamente.',
      );
    } finally {
      this.guardandoPerfil.set(false);
    }
  }
}
