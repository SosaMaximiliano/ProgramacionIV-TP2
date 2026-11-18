import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.obtenerToken()) return router.createUrlTree(['/login']);
  if (auth.sesionValidada()) return true;

  try {
    await auth.autorizar();
    return true;
  } catch {
    auth.limpiarSesion();
    return router.createUrlTree(['/login']);
  }
};
