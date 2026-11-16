import { Routes } from '@angular/router';

export const PUBLICACIONES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../publicaciones/publicaciones.component').then((m) => m.PublicacionesComponent),
  },
  {
    path: 'nueva',
    loadComponent: () =>
      import('../publicacion-form/publicacion-form.component').then(
        (m) => m.PublicacionFormComponent,
      ),
  },
  {
    path: ':id/detalle',
    loadComponent: () =>
      import('../detalle-publicacion/detalle-publicacion.component').then(
        (m) => m.DetallePublicacionComponent,
      ),
  },
];
