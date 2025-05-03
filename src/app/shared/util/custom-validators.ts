import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static repeatPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value.password;
      const repeatPassword = control.value.repeatPassword;

      return password != repeatPassword
        ? { repeatPassword: { value: control.value } }
        : null;
    };
  }
}
