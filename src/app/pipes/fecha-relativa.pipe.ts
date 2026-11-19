import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaRelativa',
  standalone: true,
})
export class FechaRelativaPipe implements PipeTransform {
  private formato = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });

  transform(valor: string | Date | null | undefined): string {
    if (!valor) return '';

    const fecha = valor instanceof Date ? valor : new Date(valor);
    if (Number.isNaN(fecha.getTime())) return '';

    const diferenciaSegundos = (fecha.getTime() - Date.now()) / 1000;
    const segundos = Math.abs(diferenciaSegundos);
    const direccion = diferenciaSegundos < 0 ? -1 : 1;

    if (segundos < 60) return 'ahora';
    if (segundos < 3600) return this.formato.format(Math.round(diferenciaSegundos / 60), 'minute');
    if (segundos < 86400) return this.formato.format(Math.round(diferenciaSegundos / 3600), 'hour');
    if (segundos < 604800) return this.formato.format(Math.round(diferenciaSegundos / 86400), 'day');
    if (segundos < 2592000) return this.formato.format(Math.round(diferenciaSegundos / 604800), 'week');

    return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(fecha);
  }
}
