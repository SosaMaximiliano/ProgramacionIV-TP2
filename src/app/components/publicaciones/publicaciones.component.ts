import { Component, signal } from '@angular/core';
import { PublicacionCard } from '../publicacion-card/publicacion-card';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionRespuesta } from '../../modelos/publicacion.model';
@Component({
  imports: [PublicacionCard],
  selector: 'app-publicaciones',
  styleUrl: './publicaciones.component.css',
  templateUrl: './publicaciones.component.html',
})
export class PublicacionesComponent {
  publicaciones = signal<PublicacionRespuesta[]>([]);
  orden = signal<'fecha' | 'likes'>('fecha');
  offset = signal(0);
  readonly limit = 10;
  haySiguiente = signal(false);

  constructor(private publicacionesService: PublicacionesService) {}

  ngOnInit() {
    this.cargarPagina();
  }

  async cargarPagina() {
    // Pedimos una publicación extra para saber si existe una página siguiente.
    const resultados = await this.publicacionesService.traerPagina(
      this.orden(),
      this.offset(),
      this.limit + 1,
    );

    this.haySiguiente.set(resultados.length > this.limit);
    this.publicaciones.set(resultados.slice(0, this.limit));
  }

  async cambiarOrden(evento: Event) {
    const selector = evento.target as HTMLSelectElement;
    this.orden.set(selector.value as 'fecha' | 'likes');
    this.offset.set(0);
    await this.cargarPagina();
  }

  async paginaAnterior() {
    if (this.offset() === 0) return;

    this.offset.update((valor) => valor - this.limit);
    await this.cargarPagina();
  }

  async paginaSiguiente() {
    if (!this.haySiguiente()) return;

    this.offset.update((valor) => valor + this.limit);
    await this.cargarPagina();
  }
}
