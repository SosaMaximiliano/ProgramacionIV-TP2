import { inject, Service, signal } from '@angular/core';
import { UsuarioRespuesta } from '../modelos/usuario.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Service()
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/usuario';
  usuarioActual = signal<UsuarioRespuesta | null>(null);

  async obtenerUsuarioActual(): Promise<UsuarioRespuesta | null> {
    const usuario = sessionStorage.getItem('usuario');
    this.usuarioActual.set(
      await firstValueFrom(this.http.get<UsuarioRespuesta>(this.apiUrl + `/${usuario}`)),
    );
    return this.usuarioActual();
  }

  logout() {
    this.usuarioActual.set(null);
  }
}
