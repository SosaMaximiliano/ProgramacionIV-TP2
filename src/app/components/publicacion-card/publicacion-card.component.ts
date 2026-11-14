import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { UsuarioRespuesta } from '../../modelos/usuario.model';
import { DatePipe } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [DatePipe],
  selector: 'app-publicacion-card',
  styleUrl: './publicacion-card.component.css',
  templateUrl: './publicacion-card.component.html',
})
export class PublicacionCard {
  usuario = signal<UsuarioRespuesta | null>(null);

  constructor(public usuarioService: UsuarioService) {}

  @Input() publicacion!: PublicacionRespuesta;

  @Output() eventoPost = new EventEmitter<string>();

  emitirSeleccion() {
    this.eventoPost.emit(this.publicacion._id);
  }

  @Output() eventoEliminar = new EventEmitter<string>();

  emitirEliminar() {
    this.eventoEliminar.emit(this.publicacion._id);
  }
}
