import { Directive, signal } from '@angular/core';

//Anima el gradiente de la cabecera cuando pasás el cursor por la tarjeta. Se usa en publicaciones.
@Directive({
  selector: '[appGradienteHover]',
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[class.gradiente-hover-activo]': 'isHovered()',
  },
})
export class GradienteHoverDirective {
  protected isHovered = signal(false);
}
