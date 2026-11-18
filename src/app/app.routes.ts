import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/inicio/inicio.component').then((m) => m.InicioComponent),
    pathMatch: 'full',
  },
  { path: 'inicio', redirectTo: '', pathMatch: 'full' },
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
    loadChildren: () =>
      import('./components/publicaciones/publicaciones.routes').then((m) => m.PUBLICACIONES_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'mi-perfil',
    loadComponent: () =>
      import('./components/mi-perfil/mi-perfil.component').then((m) => m.MiPerfilComponent),
    canActivate: [authGuard],
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
