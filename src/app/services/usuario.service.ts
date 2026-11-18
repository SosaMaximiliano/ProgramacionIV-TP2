import { inject, Service, signal } from '@angular/core';
import { UsuarioRespuesta } from '../modelos/usuario.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL } from '../api.config';

@Service()
export class UsuarioService {
  private http = inject(HttpClient);
  // private apiUrl = 'http://localhost:3000/usuario';
  private apiUrl = `${API_URL}/usuario`;
  usuarioActual = signal<UsuarioRespuesta | null>(null);

  async obtenerUsuarioActual(): Promise<UsuarioRespuesta | null> {
    const usuario = sessionStorage.getItem('usuario');
    this.usuarioActual.set(
      await firstValueFrom(this.http.get<UsuarioRespuesta>(this.apiUrl + `/${usuario}`)),
    );
    return this.usuarioActual();
  }

  async actualizarPerfil(idUsuario: string, datos: FormData) {
    const usuarioActualizado = await firstValueFrom(
      this.http.patch<UsuarioRespuesta>(`${this.apiUrl}/${idUsuario}`, datos, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
        },
      }),
    );
    this.usuarioActual.set(usuarioActualizado);
    return usuarioActualizado;
  }

  logout() {
    this.usuarioActual.set(null);
  }
}
