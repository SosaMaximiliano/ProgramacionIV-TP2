import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

export const adminGuard: CanActivateFn = () => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  return usuarioService.usuarioActual()?.perfil === 'administrador'
    ? true
    : router.createUrlTree(['/publicaciones']);
};
