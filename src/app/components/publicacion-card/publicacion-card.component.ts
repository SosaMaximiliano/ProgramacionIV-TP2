import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { GradienteHoverDirective } from '../../directivas/gradiente-hover.directive';
import { PuedeEliminarDirective } from '../../directivas/puede-eliminar.directive';
import { FechaRelativaPipe } from '../../pipes/fecha-relativa.pipe';
import { RecortarTextoPipe } from '../../pipes/recortar-texto.pipe';
import { InicialesPipe } from '../../pipes/iniciales.pipe';

@Component({
  imports: [GradienteHoverDirective, PuedeEliminarDirective, FechaRelativaPipe, RecortarTextoPipe, InicialesPipe],
  selector: 'app-publicacion-card',
  styleUrl: './publicacion-card.component.css',
  templateUrl: './publicacion-card.component.html',
})
export class PublicacionCard {
  constructor(
    public authService: AuthService,
    public usuarioService: UsuarioService,
    private router: Router,
  ) {}

  @Input() publicacion!: PublicacionRespuesta;
  @Input() mostrarBotonEliminar = false;
  @Input() mostrarDescripcionCompleta = false;

  get usuarioDioLike(): boolean {
    const idUsuario = this.usuarioService.usuarioActual()?._id;
    return !!idUsuario && this.publicacion.likes.includes(idUsuario);
  }

  get puedeEliminar(): boolean {
    const usuario = this.usuarioService.usuarioActual();
    if (!usuario) return false;

    return (
      usuario.perfil === 'administrador' ||
      (this.mostrarBotonEliminar && usuario._id === this.publicacion.usuario._id)
    );
  }

  @Output() eventoLike = new EventEmitter<string>();

  emitirLike() {
    this.eventoLike.emit(this.publicacion._id);
  }

  @Output() eventoEliminar = new EventEmitter<string>();

  emitirEliminar() {
    this.eventoEliminar.emit(this.publicacion._id);
  }

  verPublicacion(id: string) {
    this.router.navigateByUrl(`publicaciones/${id}/detalle`);
  }
}
