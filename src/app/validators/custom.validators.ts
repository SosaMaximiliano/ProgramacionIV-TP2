import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsIgualesValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const repetirPassword = control.get('repetirPassword')?.value;

  if (password && repetirPassword && password !== repetirPassword) {
    return { passwordsNoCoinciden: true };
  }

  return null;
};
