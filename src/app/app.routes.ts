import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./components/home-component/home-component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login-component/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./components/registro-component/registro-component').then((m) => m.RegistroComponent),
  },
  {
    path: 'publicaciones',
    loadComponent: () =>
      import('./components/publicaciones-component/publicaciones-component').then(
        (m) => m.PublicacionesComponent,
      ),
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('./components/mi-perfil-component/mi-perfil-component').then(
        (m) => m.MiPerfilComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
