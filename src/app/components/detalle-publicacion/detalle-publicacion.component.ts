import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionCard } from '../publicacion-card/publicacion-card.component';
import { ComentarioCardComponent } from '../comentario-card/comentario-card.component';
import { ComentarioFormComponent } from '../comentario-form/comentario-form.component';
import { ComentariosService } from '../../services/comentarios.service';
import { ComentarioRespuesta } from '../../modelos/comentario.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  imports: [PublicacionCard, ComentarioCardComponent, ComentarioFormComponent, RouterLink],
  selector: 'app-detalle-publicacion.component',
  styleUrl: './detalle-publicacion.component.css',
  templateUrl: './detalle-publicacion.component.html',
})
export class DetallePublicacionComponent {
  publicacion = signal<PublicacionRespuesta | null>(null);
  cargando = signal(true);
  cargandoPost = signal(true);
  cargandoComentarios = signal(true);
  error = signal('');
  errorPost = signal('');
  errorComentario = signal('');
  idPublicacion = '';
  comentarios = signal<ComentarioRespuesta[] | []>([]);
  offset = signal(0);
  readonly limit = 10;
  hayMas = signal(false);
  mensaje = '';
  cargandoMas = signal(false);

  constructor(
    private route: ActivatedRoute,
    private publicacionesService: PublicacionesService,
    private comentarioService: ComentariosService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('No se indicó qué publicación mostrar.');
      this.cargando.set(false);
      return;
    }
    this.idPublicacion = id;

    this.cargarPublicacion(id);
    this.cargarComentarios(id);
  }

  async enviarComentario(texto: string) {
    try {
      const comentario = await this.comentarioService.crear(this.idPublicacion, texto);
      this.comentarios.update((e) => [...e, comentario]);
    } catch (error) {
      console.log(error);
    }
  }

  private async cargarPublicacion(id: string) {
    this.cargandoPost.set(true);
    try {
      const publicacion = await this.publicacionesService.traerPorId(id);
      this.publicacion.set(publicacion);
    } catch (error) {
      console.log(error);
      this.errorPost.set('No se pudo cargar la publicación.');
    } finally {
      this.cargandoPost.set(false);
    }
  }

  private async cargarComentarios(idPost: string, agregar = false) {
    if (agregar) {
      this.cargandoMas.set(true);
    } else {
      this.cargandoComentarios.set(true);
    }

    try {
      const pagina = await this.comentarioService.traerPorPublicacion(
        idPost,
        this.offset(),
        this.limit + 1,
      );

      this.hayMas.set(pagina.length > this.limit);
      const paginaVisible = pagina.slice(0, this.limit);

      this.comentarios.update((actuales) =>
        agregar ? [...actuales, ...paginaVisible] : paginaVisible,
      );
    } catch (error) {
      console.log(error);
      this.errorComentario.set('No se pudieron cargar los comentarios.');
    } finally {
      if (agregar) {
        this.cargandoMas.set(false);
      } else {
        this.cargandoComentarios.set(false);
      }
    }
  }

  async cambiarLike(idPost: string) {
    const actualizada = await this.publicacionesService.meGustaToggle(idPost);
    if (!actualizada) return;
    this.publicacion.set(actualizada);
  }

  async eliminarPublicacion(idPost: string) {
    await this.publicacionesService.eliminarPublicacion(idPost);
    this.router.navigateByUrl('/publicaciones');
  }

  async cargarMas() {
    if (!this.hayMas() || this.cargandoMas()) return;

    this.offset.update((valor) => valor + this.limit);
    await this.cargarComentarios(this.idPublicacion, true);
  }

  async editarComentario(id: string, texto: string) {
    try {
      const actualizado = await this.comentarioService.modificar(this.idPublicacion, id, texto);

      this.comentarios.update((lista) =>
        lista.map((comentario) => (comentario._id === actualizado._id ? actualizado : comentario)),
      );
    } catch (error) {
      console.error('No se pudo actualizar el comentario:', error);
    }
  }
}
