import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { UsuarioService } from './services/usuario.service';
@Component({
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('red-social');

  constructor(private usuarioService: UsuarioService) {}
  async ngOnInit() {
    if (sessionStorage.getItem('access_token') && sessionStorage.getItem('usuario')) {
      try {
        await this.usuarioService.obtenerUsuarioActual();
      } catch {
        this.usuarioService.obtenerUsuarioActual();
      }
    }
  }
}
