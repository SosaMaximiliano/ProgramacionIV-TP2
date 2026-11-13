import { inject, Service, signal } from '@angular/core';
import { LoginRespuesta, Usuario, UsuarioRespuesta } from '../modelos/usuario.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Service()
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/usuario';
  usuarioActual = signal<UsuarioRespuesta | null>(null);

  async registrar(datos: FormData) {
    return await firstValueFrom(this.http.post<LoginRespuesta>(this.apiUrl + '/registro', datos));
  }

  async login(usuario: string, password: string) {
    return await firstValueFrom(
      this.http.post<LoginRespuesta>(this.apiUrl + '/login', {
        usuario: usuario,
        password: password,
      }),
    );
  }

  logout() {
    this.usuarioActual.set(null);
  }
}
