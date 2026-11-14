import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PublicacionRespuesta } from '../modelos/publicacion.model';
import { UsuarioService } from './usuario.service';

@Service()
export class PublicacionesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/publicaciones';
  usuarioService = inject(UsuarioService);

  async traerTodas() {
    return await firstValueFrom(this.http.get<PublicacionRespuesta[]>(this.apiUrl));
  }

  async traerPorId(id: string) {
    return await firstValueFrom(
      this.http.get<PublicacionRespuesta>(`${this.apiUrl}/${id}`, {
        headers: this.obtenerHeadersToken(),
      }),
    );
  }

  async traerPagina(orden: 'fecha' | 'likes', offset: number, limit: number) {
    return await firstValueFrom(
      this.http.get<PublicacionRespuesta[]>(this.apiUrl, {
        params: { orden, offset, limit },
        headers: this.obtenerHeadersToken(),
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
        { headers: this.obtenerHeadersToken() },
      ),
    );
  }

  async quitarLike(idPost: string) {
    return await firstValueFrom(
      this.http.delete<PublicacionRespuesta>(`${this.apiUrl}/${idPost}/likes`, {
        headers: this.obtenerHeadersToken(),
      }),
    );
  }

  private obtenerHeadersToken() {
    const token = sessionStorage.getItem('access_token');

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async eliminarPublicacion(idPost: string) {
    return await firstValueFrom(
      this.http.delete<PublicacionRespuesta>(`${this.apiUrl}/${idPost}`, {
        headers: this.obtenerHeadersToken(),
      }),
    );
  }

  async crearPublicacion(datos: FormData) {
    return await firstValueFrom(
      this.http.post<PublicacionRespuesta>(`${this.apiUrl}/nueva`, datos, {
        headers: this.obtenerHeadersToken(),
      }),
    );
  }

  async traerUltimasPorUsuario(idUsuario: string) {
    return await firstValueFrom(
      this.http.get<PublicacionRespuesta[]>(`${this.apiUrl}/usuario/${idUsuario}/ultimas`, {
        headers: this.obtenerHeadersToken(),
      }),
    );
  }
}
