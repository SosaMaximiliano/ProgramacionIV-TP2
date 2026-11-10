import { UsuarioRespuesta } from '../../modelos/usuario.model';
import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [RouterLink],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  constructor(
    readonly usuarioService: UsuarioService,
    private router: Router,
  ) {}

  cerrarSesion() {
    this.usuarioService.logout();
    this.router.navigateByUrl('/inicio');
  }
}
