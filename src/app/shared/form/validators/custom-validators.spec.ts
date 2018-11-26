import { CustomValidators } from './custom-validators';
import { FormControl, AbstractControl} from '@angular/forms';

describe('CustomValidators', () => {
  const formControlWithNull = new FormControl(null);
  const formControlWithEmptyValue = new FormControl('');

  describe('Required validator', () => {
    const formControlName = 'bar';
    const formControlWithValue = new FormControl('foo');

    const controlNotValidObj = {
      required: {
        message: `${formControlName} is required`,
      },
    };

    describe('when correct data is sent', () => {
      it('should return null, which means formControl contains value', () => {
        const res = CustomValidators.required(formControlName)(formControlWithValue);
        expect(res).toEqual(null);
      });
    });

    describe('when incorrect data is sent', () => {
      it('should error object, which means formControl doesn\'t contain value', () => {
        const res = CustomValidators.required(formControlName)(formControlWithEmptyValue);
        expect(res).toEqual(controlNotValidObj);
      });
    });
  });

  describe('Email validator', () => {
    const emailControl = new FormControl('foo@foo.com');
    const wrongEmailControl1 = new FormControl('@#@##@@#');
    const wrongEmailControl2 = new FormControl('foo');

    const controlNotValidObj = {
      email: {
        message: 'Email is not valid',
      },
    };

    describe('when incorrect data is sent', () => {
      it('should return error object', () => {
        [wrongEmailControl1, wrongEmailControl2].forEach((control: AbstractControl) => {
          expect(CustomValidators.email(control)).toEqual(controlNotValidObj);
        });
      });
    });

    describe('when correct data is sent', () => {
      it('should return null', () => {
        [formControlWithNull, emailControl, formControlWithEmptyValue].forEach((control: AbstractControl) => {
          expect(CustomValidators.email(control)).toBe(null);
        });
      });
    });
  });

  describe('Password validator', () => {
    const passwordControl = new FormControl('test12345');
    const wrongPasswordControl = new FormControl('fff');

    const controlNotValidObj = {
      password: {
        message: 'Password should be longer than 6 characters',
      },
    };

    describe('when incorrect data is sent', () => {
      it('should return error object', () => {
        expect(CustomValidators.password(wrongPasswordControl)).toEqual(controlNotValidObj);
      });
    });

    describe('when correct data is sent', () => {
      it('should return null', () => {
        [formControlWithNull, passwordControl, formControlWithEmptyValue].forEach((control: AbstractControl) => {
          expect(CustomValidators.password(control)).toBe(null);
        });
      });
    });
  });
});
