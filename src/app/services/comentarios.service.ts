import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ComentarioRespuesta } from '../modelos/comentario.model';
import { AuthService } from './auth.service';

@Service()
export class ComentariosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/publicaciones';
  private authService = inject(AuthService);

  async traerPorPublicacion(idPost: string) {
    return await firstValueFrom(
      this.http.get<ComentarioRespuesta[]>(`${this.apiUrl}/${idPost}/comentarios`, {
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
}
