import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-comentario-form',
  styleUrl: './comentario-form.component.css',
  templateUrl: './comentario-form.component.html',
})
export class ComentarioFormComponent {
  comentarios = signal<string[]>([]);
  comentario = '';

  @Output() comentarioEnviado = new EventEmitter<string>();

  publicar(formulario: NgForm) {
    if (formulario.invalid) return;
    const texto = this.comentario.trim();
    if (!texto) return;
    this.comentarioEnviado.emit(texto);
    formulario.resetForm();
  }
}
