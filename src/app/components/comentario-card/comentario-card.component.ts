import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComentarioRespuesta } from '../../modelos/comentario.model';

@Component({
  imports: [DatePipe],
  selector: 'app-comentario-card',
  styleUrl: './comentario-card.component.css',
  templateUrl: './comentario-card.component.html',
})
export class ComentarioCardComponent {
  @Input() comentario!: ComentarioRespuesta;
}
