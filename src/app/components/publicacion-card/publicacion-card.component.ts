import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { UsuarioRespuesta } from '../../modelos/usuario.model';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [DatePipe],
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

  get usuarioDioLike(): boolean {
    const idUsuario = this.usuarioService.usuarioActual()?._id;
    return !!idUsuario && this.publicacion.likes.includes(idUsuario);
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
