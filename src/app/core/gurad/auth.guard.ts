import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  if (localStorage.getItem("currentUser")) {
    return true;
  }
  authService.logout()
  return false;
};
