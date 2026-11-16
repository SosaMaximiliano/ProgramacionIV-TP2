import { inject, Service, signal } from '@angular/core';
import { LoginRespuesta, UsuarioRespuesta } from '../modelos/usuario.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Service()
export class AuthService {
  private usuarioService = inject(UsuarioService);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';

  async registrar(datos: FormData) {
    //El método envía a /auth/registro/ del backend los datos del
    // formulario y devuelve la respuesta al componente en forma LoginRespuesta
    return await firstValueFrom(this.http.post<LoginRespuesta>(this.apiUrl + '/registro', datos));
  }

  async login(identificador: string, password: string) {
    //El método envía a /auth/login sólo identificador y contraseña.
    //Devuelve la respuesta al componente en forma LoginRespuesta.
    return await firstValueFrom(
      this.http.post<LoginRespuesta>(this.apiUrl + '/login', {
        identificador: identificador,
        password: password,
      }),
    );
  }

  logout() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('usuario');
    this.usuarioService.logout();
  }

  obtenerToken() {
    return sessionStorage.getItem('access_token');
  }

  obtenerHeadersToken() {
    const token = sessionStorage.getItem('access_token');
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
