import { Component, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { PublicacionCard } from '../publicacion-card/publicacion-card.component';

@Component({
  imports: [PublicacionCard],
  selector: 'app-mi-perfil',
  styleUrl: './mi-perfil.component.css',
  templateUrl: './mi-perfil.component.html',
})
export class MiPerfilComponent {
  publicaciones = signal<PublicacionRespuesta[]>([]);
  constructor(
    public usuarioService: UsuarioService,
    private publicacionesService: PublicacionesService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.publicaciones.set(
      await this.publicacionesService.traerUltimasPorUsuario(
        this.usuarioService.usuarioActual()?._id ?? '',
      ),
    );
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
