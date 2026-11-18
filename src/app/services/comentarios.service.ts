import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ComentarioRespuesta } from '../modelos/comentario.model';
import { AuthService } from './auth.service';
import { API_URL } from '../api.config';

@Service()
export class ComentariosService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/publicaciones`;
  private authService = inject(AuthService);

  async traerPorPublicacion(idPost: string, offset: number, limit: number) {
    return await firstValueFrom(
      this.http.get<ComentarioRespuesta[]>(`${this.apiUrl}/${idPost}/comentarios`, {
        params: { offset, limit },
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async traerTodosPorPublicacion(idPost: string) {
    return await firstValueFrom(
      this.http.get<ComentarioRespuesta[]>(`${this.apiUrl}/${idPost}/comentarios`, {
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async traerPorId(idPost: string, id: string) {
    return await firstValueFrom(
      this.http.get<ComentarioRespuesta>(`${this.apiUrl}/${idPost}/comentarios${id}`, {
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async crear(idPost: string, texto: string) {
    return await firstValueFrom(
      this.http.post<ComentarioRespuesta>(
        `${this.apiUrl}/${idPost}/comentarios`,
        { comentario: texto },
        {
          headers: this.authService.obtenerHeadersToken(),
        },
      ),
    );
  }

  async modificar(idPost: string, id: string, texto: string) {
    return await firstValueFrom(
      this.http.put<ComentarioRespuesta>(
        `${this.apiUrl}/${idPost}/comentarios/${id}`,
        {
          comentario: texto,
        },
        {
          headers: this.authService.obtenerHeadersToken(),
        },
      ),
    );
  }
}
