import { AbstractControl } from '@angular/forms';

const reEmail = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g;
const minPasswordLength = 6;
const allowedInputValues: any[] = [null, ''];

export class CustomValidators {
  public static required(controlName: string): any {
    return (control: AbstractControl) => {
      return control.value && control.value.trim() ? null : {
        required: {
          message: `${controlName} is required`,
        },
      };
    };
  }

  public static password(control: AbstractControl): any {
    return allowedInputValues.includes(control.value) || control.value.length >= minPasswordLength ? null : {
      password: {
        message: `Password should be longer than ${minPasswordLength} characters`,
      },
    };
  }

  public static email(control: AbstractControl): any {
    return allowedInputValues.includes(control.value) || !control.value.replace(reEmail, '') ? null : {
      email: {
        message: 'Email is not valid',
      },
    };
  }
}
