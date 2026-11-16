import { UsuarioRespuesta } from '../../modelos/usuario.model';
import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(
    readonly authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router,
  ) {}

  cerrarSesion() {
    this.authService.logout();
    this.router.navigateByUrl('/inicio');
  }
}
