import { Component, signal } from '@angular/core';
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
  imports: [PublicacionCard, ComentarioCardComponent],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.component.css',
  templateUrl: './mi-perfil.component.html',
})
export class MiPerfilComponent {
  publicaciones = signal<PublicacionConComentarios[]>([]);

  constructor(
    public authService: AuthService,
    private publicacionesService: PublicacionesService,
    private comentarioService: ComentariosService,
    private usuarioService: UsuarioService,
  ) {}

  async ngOnInit(): Promise<void> {
    const publicaciones = await this.publicacionesService.traerUltimasPorUsuario(
      this.usuarioService.usuarioActual()?._id ?? '',
    );

    const publicacionesConComentarios = await Promise.all(
      publicaciones.map(async (post) => ({
        ...post,
        comentarios: await this.comentarioService.traerPorPublicacion(post._id),
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
}
