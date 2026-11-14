import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./components/registro/registro.component').then((m) => m.RegistroComponent),
  },
  {
    path: 'publicaciones',
    loadComponent: () =>
      import('./components/publicaciones/publicaciones.component').then(
        (m) => m.PublicacionesComponent,
      ),
  },
  {
    path: 'publicaciones/nueva',
    loadComponent: () =>
      import('./components/publicacion-form/publicacion-form.component').then(
        (m) => m.PublicacionFormComponent,
      ),
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('./components/mi-perfil/mi-perfil.component').then((m) => m.MiPerfilComponent),
  },
  {
    path: 'error',
    loadComponent: () => import('./components/error/error.component').then((m) => m.ErrorComponent),
  },
  {
    path: '**',
    redirectTo: 'error',
  },
];
