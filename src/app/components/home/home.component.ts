import { Component, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  styleUrl: './home.component.css',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  cargando = signal(true);

  async ngOnInit(): Promise<void> {
    const token = sessionStorage.getItem('access_token');
    const idUsuario = sessionStorage.getItem('usuario');

    if (!token || !idUsuario) {
      this.cargando.set(false);
      this.router.navigateByUrl('/login');
      return;
    }

    try {
      await this.usuarioService.obtenerUsuarioActual();
      this.router.navigateByUrl('/publicaciones');
    } catch (error) {
      console.error('No se pudieron cargar los datos del usuario.', error);
    } finally {
      this.cargando.set(false);
    }
  }
}
