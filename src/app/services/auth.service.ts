import { inject, Service, signal } from '@angular/core';
import { LoginRespuesta, UsuarioRespuesta } from '../modelos/usuario.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { UsuarioService } from './usuario.service';
import { API_URL } from '../api.config';
import { Router } from '@angular/router';

@Service()
export class AuthService {
  private usuarioService = inject(UsuarioService);
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}/auth`;
  private router = inject(Router);
  readonly mostrarAvisoSesion = signal(false);
  readonly sesionValidada = signal(false);
  private timerAviso?: ReturnType<typeof setTimeout>;
  private timerVencimiento?: ReturnType<typeof setTimeout>;

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

  async logout() {
    this.limpiarSesion();
    void this.router.navigateByUrl('/login');
  }

  limpiarSesion() {
    clearTimeout(this.timerAviso);
    clearTimeout(this.timerVencimiento);
    this.mostrarAvisoSesion.set(false);
    this.sesionValidada.set(false);

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('usuario');
    this.usuarioService.usuarioActual.set(null);
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

  guardarSesion(respuesta: LoginRespuesta) {
    sessionStorage.setItem('usuario', respuesta.usuario._id);
    sessionStorage.setItem('access_token', respuesta.access_token);
    this.usuarioService.usuarioActual.set(respuesta.usuario);
    this.sesionValidada.set(true);
    this.programarTemporizadores(respuesta.access_token);
  }

  async autorizar(): Promise<UsuarioRespuesta> {
    const token = this.obtenerToken();
    if (!token) throw new Error('No hay un token para validar.');

    const usuario = await firstValueFrom(
      this.http.post<UsuarioRespuesta>(
        `${this.apiUrl}/autorizar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      ),
    );

    sessionStorage.setItem('usuario', usuario._id);
    this.usuarioService.usuarioActual.set(usuario);
    this.sesionValidada.set(true);
    this.programarTemporizadores(token);
    return usuario;
  }

  restaurarTemporizador() {
    const token = this.obtenerToken();
    if (token) this.programarTemporizadores(token);
  }

  programarTemporizadores(token: string) {
    clearTimeout(this.timerAviso);
    clearTimeout(this.timerVencimiento);
    this.mostrarAvisoSesion.set(false);

    const vencimiento = this.leerVencimiento(token);

    if (!vencimiento) {
      this.logout();
      return;
    }

    const milisegundosRestantes = vencimiento - Date.now();

    if (milisegundosRestantes <= 0) {
      this.logout();
      return;
    }

    // PARA PRUEBAS
    const cincoMinutos = 30 * 1000;

    // const cincoMinutos = 5 * 60 * 1000;

    this.timerAviso = setTimeout(
      () => this.mostrarAvisoSesion.set(true),
      Math.max(0, milisegundosRestantes - cincoMinutos),
    );

    this.timerVencimiento = setTimeout(() => this.logout(), milisegundosRestantes);
  }

  async extenderSesion() {
    const token = this.obtenerToken();

    if (!token) {
      this.logout();
      return;
    }

    try {
      const respuesta = await firstValueFrom(
        this.http.post<{ access_token: string }>(
          `${this.apiUrl}/refrescar`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      );

      sessionStorage.setItem('access_token', respuesta.access_token);
      this.programarTemporizadores(respuesta.access_token);
    } catch {
      this.logout();
    }
  }

  leerVencimiento(token: string): number | null {
    try {
      const parte = token.split('.')[1];
      const base64 = parte.replace(/-/g, '+').replace(/_/g, '/');
      const base64Completo = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      const payload = JSON.parse(atob(base64Completo));

      return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
      return null;
    }
  }
}
