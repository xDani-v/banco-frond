import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServicioAPIService } from '../service/servicio-api.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(ServicioAPIService);
  const router = inject(Router);
  if (authService.isAuth()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
