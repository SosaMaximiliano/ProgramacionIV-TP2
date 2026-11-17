import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComentarioRespuesta } from '../../modelos/comentario.model';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  imports: [DatePipe, FormsModule],
  selector: 'app-comentario-card',
  styleUrl: './comentario-card.component.css',
  templateUrl: './comentario-card.component.html',
})
export class ComentarioCardComponent {
  editando = false;
  texto = '';

  constructor(public usuarioService: UsuarioService) {}

  get puedeEditar(): boolean {
    return this.usuarioService.usuarioActual()?._id === this.comentario.usuario._id;
  }

  @Input() comentario!: ComentarioRespuesta;

  @Output() eventoEditar = new EventEmitter<{ idComentario: string; texto: string }>();

  emitirEdicion() {
    const texto = this.texto.trim();
    if (!texto) return;

    this.eventoEditar.emit({
      idComentario: this.comentario._id,
      texto,
    });

    this.editando = false;
  }

  iniciarEdicion() {
    this.texto = this.comentario.comentario;
    this.editando = true;
  }

  cancelarEdicion() {
    this.texto = this.comentario.comentario;
    this.editando = false;
  }
}
