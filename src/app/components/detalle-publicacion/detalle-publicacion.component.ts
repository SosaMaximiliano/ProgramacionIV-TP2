import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionCard } from '../publicacion-card/publicacion-card.component';
import { ComentarioCardComponent } from '../comentario-card/comentario-card.component';
import { ComentarioFormComponent } from '../comentario-form/comentario-form.component';
import { ComentariosService } from '../../services/comentarios.service';
import { ComentarioRespuesta } from '../../modelos/comentario.model';

@Component({
  imports: [PublicacionCard, ComentarioCardComponent, ComentarioFormComponent],
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

  constructor(
    private route: ActivatedRoute,
    private publicacionesService: PublicacionesService,
    private comentarioService: ComentariosService,
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

  private async cargarComentarios(idPost: string) {
    this.cargandoComentarios.set(true);
    try {
      const comentarios = await this.comentarioService.traerPorPublicacion(idPost);
      this.comentarios.set(comentarios);
    } catch (error) {
      console.log(error);
      this.errorComentario.set('No se pudieron cargar los comentarios.');
    } finally {
      this.cargandoComentarios.set(false);
    }
  }

  async cambiarLike(idPost: string) {
    const actualizada = await this.publicacionesService.meGustaToggle(idPost);
    if (!actualizada) return;
    this.publicacion.set(actualizada);
  }
}
