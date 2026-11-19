import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recortarTexto',
  standalone: true,
})
export class RecortarTextoPipe implements PipeTransform {
  transform(texto: string | null | undefined, limite = 100): string {
    if (!texto) return '';

    const limiteSeguro = Math.max(1, Math.floor(limite));
    if (texto.length <= limiteSeguro) return texto;

    return `${texto.slice(0, limiteSeguro).trimEnd()}…`;
  }
}
