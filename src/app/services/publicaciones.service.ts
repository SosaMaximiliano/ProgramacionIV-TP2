import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PublicacionRespuesta } from '../modelos/publicacion.model';

@Service()
export class PublicacionesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/publicaciones';

  async traerTodas() {
    return await firstValueFrom(this.http.get<PublicacionRespuesta[]>(this.apiUrl));
  }

  async traerPorId(id: string) {
    return await firstValueFrom(this.http.get<PublicacionRespuesta>(`${this.apiUrl}/${id}`));
  }

  async traerPagina(orden: 'fecha' | 'likes', offset: number, limit: number) {
    return await firstValueFrom(
      this.http.get<PublicacionRespuesta[]>(this.apiUrl, {
        params: { orden, offset, limit },
      }),
    );
  }
}
