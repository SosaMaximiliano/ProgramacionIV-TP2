import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iniciales',
  standalone: true,
})
export class InicialesPipe implements PipeTransform {
  transform(nombre: string | null | undefined): string {
    const palabras = nombre?.trim().split(/\s+/u).filter(Boolean) ?? [];
    if (palabras.length === 0) return '?';

    return palabras
      .slice(0, 2)
      .map((palabra) => palabra[0].toLocaleUpperCase('es-AR'))
      .join('');
  }
}
