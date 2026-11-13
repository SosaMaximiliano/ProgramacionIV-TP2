import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
import { UsuarioRespuesta } from '../../modelos/usuario.model';
import { DatePipe } from '@angular/common';

@Component({
  imports: [DatePipe],
  selector: 'app-publicacion-card',
  styleUrl: './publicacion-card.css',
  templateUrl: './publicacion-card.html',
})
export class PublicacionCard {
  usuario = signal<UsuarioRespuesta | null>(null);

  @Input() publicacion!: PublicacionRespuesta;

  @Output() publicacionSeleccionada = new EventEmitter<PublicacionRespuesta>();
  emitirSeleccion() {
    this.publicacionSeleccionada.emit(this.publicacion);
  }
}
