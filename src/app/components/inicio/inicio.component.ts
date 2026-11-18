import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  styleUrl: './inicio.component.css',
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const esperaMinima = new Promise<void>((resolve) => setTimeout(resolve, 1000));

    if (!this.authService.obtenerToken()) {
      await esperaMinima;
      await this.authService.logout();
      return;
    }

    try {
      await Promise.all([this.authService.autorizar(), esperaMinima]);
      await this.router.navigateByUrl('/publicaciones');
    } catch {
      await esperaMinima;
      await this.authService.logout();
    }
  }
}
