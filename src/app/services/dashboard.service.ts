import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { API_URL } from '../api.config';
import { DatoEstadistica } from '../modelos/estadistica.model';
@Service()
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/estadisticas`;
  private authService = inject(AuthService);

  async publicacionesPorUsuario(desde: string, hasta: string) {
    return await firstValueFrom(
      this.http.get<DatoEstadistica[]>(`${this.apiUrl}/publicaciones-por-usuario`, {
        params: { desde, hasta },
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async comentariosPorDia(desde: string, hasta: string) {
    return await firstValueFrom(
      this.http.get<DatoEstadistica[]>(`${this.apiUrl}/comentarios-por-dia`, {
        params: { desde, hasta },
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }

  async comentariosPorPublicacion(desde: string, hasta: string) {
    return await firstValueFrom(
      this.http.get<DatoEstadistica[]>(`${this.apiUrl}/comentarios-por-publicacion`, {
        params: { desde, hasta },
        headers: this.authService.obtenerHeadersToken(),
      }),
    );
  }
}
