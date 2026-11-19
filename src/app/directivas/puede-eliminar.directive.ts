import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';

//Muestra el botón de eliminar según los permisos calculados por la tarjeta.
@Directive({
  selector: '[appPuedeEliminar]',
})
export class PuedeEliminarDirective {
  private vistaCreada = false;
  private plantilla = inject(TemplateRef);
  private contenedor = inject(ViewContainerRef);

  @Input()
  set appPuedeEliminar(puedeEliminar: boolean) {
    if (puedeEliminar && !this.vistaCreada) {
      this.contenedor.createEmbeddedView(this.plantilla);
      this.vistaCreada = true;
    } else if (!puedeEliminar && this.vistaCreada) {
      this.contenedor.clear();
      this.vistaCreada = false;
    }
  }
}
