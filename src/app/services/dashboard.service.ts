import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ComentarioRespuesta } from '../modelos/comentario.model';
import { PublicacionRespuesta } from '../modelos/publicacion.model';
import { AuthService } from './auth.service';
import { API_URL } from '../api.config';
import { UsuarioService } from './usuario.service';
import { ComentariosService } from './comentarios.service';
@Service()
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/dashboard`;
  private comentariosService = inject(ComentariosService);

  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);

  async userGetCantPosts(idUsuario: string) {}

  async userGetCantComm(idUsuario: string) {}

  async postGetCantComm(idPost: string) {
    const respuesta = await this.comentariosService.traerTodosPorPublicacion(idPost);
    return respuesta.length;
  }
}
