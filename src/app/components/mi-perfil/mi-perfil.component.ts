import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioRespuesta } from '../../modelos/usuario.model';

@Component({
  imports: [],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.component.css',
  templateUrl: './mi-perfil.component.html',
})
export class MiPerfilComponent {
  usuarioActual: UsuarioRespuesta | null = null;

  constructor(usuarioService: UsuarioService) {
    this.usuarioActual = usuarioService.usuarioActual();
  }

  calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const [yyyy, mm, dd] = fechaNacimiento.split('-').map(Number);

    let edad = hoy.getFullYear() - yyyy;

    const aunNoCumplio =
      hoy.getMonth() + 1 < mm || (hoy.getMonth() + 1 === mm && hoy.getDate() < dd);

    if (aunNoCumplio) {
      edad--;
    }

    return edad;
  }
}
