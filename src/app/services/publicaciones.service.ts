import { UsuarioService } from './usuario.service';
import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PublicacionRespuesta } from '../modelos/publicacion.model';
import { AuthService } from './auth.service';
import { API_URL } from '../api.config';
@Service()
export class PublicacionesService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/publicaciones`;

  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);

  async traerTodas() {
    return await firstValueFrom(this.http.get<PublicacionRespuesta[]>(this.apiUrl));
  }

  async traerPorId(id: string) {
    return await firstValueFrom(
      this.http.get<PublicacionRespuesta>(`${this.apiUrl}/${id}`, {
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async traerPagina(orden: 'fecha' | 'likes', offset: number, limit: number) {
    return await firstValueFrom(
      this.http.get<PublicacionRespuesta[]>(this.apiUrl, {
        params: { orden, offset, limit },
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async meGustaToggle(idPost: string) {
    const publicacion = await this.traerPorId(idPost);
    const idUsuario = this.usuarioService.usuarioActual()?._id;

    if (!publicacion || !idUsuario) return;

    const yaTieneLike = publicacion.likes.includes(idUsuario);

    if (yaTieneLike) {
      return await this.quitarLike(idPost);
    }

    return await this.agregarLike(idPost);
  }

  async agregarLike(idPost: string) {
    return await firstValueFrom(
      this.http.post<PublicacionRespuesta>(
        `${this.apiUrl}/${idPost}/likes`,
        {},
        { headers: this.authService.obtenerHeadersToken() },
      ),
    );
  }

  async quitarLike(idPost: string) {
    return await firstValueFrom(
      this.http.delete<PublicacionRespuesta>(`${this.apiUrl}/${idPost}/likes`, {
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async eliminarPublicacion(idPost: string) {
    return await firstValueFrom(
      this.http.delete<PublicacionRespuesta>(`${this.apiUrl}/${idPost}`, {
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async crearPublicacion(datos: FormData) {
    return await firstValueFrom(
      this.http.post<PublicacionRespuesta>(`${this.apiUrl}/nueva`, datos, {
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async traerUltimasPorUsuario(idUsuario: string) {
    return await firstValueFrom(
      this.http.get<PublicacionRespuesta[]>(`${this.apiUrl}/usuario/${idUsuario}/ultimas`, {
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }
}
