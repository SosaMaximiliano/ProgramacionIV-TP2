import { Directive } from '@angular/core';

//Da estilo a la etiqueta “Editado” de los comentarios.
@Directive({
  selector: '[appResaltarEditado]',
  host: {
    '[style.background-color]': '"var(--accent-soft)"',
    '[style.color]': '"var(--brand)"',
    '[style.border-radius]': '"999px"',
    '[style.padding]': '"2px 8px"',
  },
})
export class ResaltarEditadoDirective {}
