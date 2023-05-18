import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";

export class UserValidators {//用內建，沒事別自己造輪子

  static account(control: FormControl): ValidationErrors | null {
    if (control.value === null)  // 1. 提供required驗證 2. 避免初始化就調用底下執行錯誤
      return {'required': true};

    const pattern: RegExp = /^[a-zA-Z0-9]{2,20}$/
    if (!pattern.test(control.value))
      return {'pattern': true}
    return null;
  }

  static password(control: FormControl): ValidationErrors | null {
    if (control.value === null)
      return {'required': true};

    const pattern: RegExp = /^(?!\S*?(.)\1{3})(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,12}$/
    if (!pattern.test(control.value))
      return {'pattern': true}
    return null;
  }

  static username(control: FormControl): ValidationErrors | null {
    if (control.value === null)
      return {'required': true};

    const pattern: RegExp = /^[\u4e00-\u9fa5a-zA-Z0-9]{1,20}$/
    if (!pattern.test(control.value))
      return {'pattern': true}
    return null;
  }

  static birthday(control: FormControl): ValidationErrors | null {
    const input = control.value //不合法的日期自動變成''
    if (input === '' || new Date(input) > new Date()) {
      return {'pattern': true};
    }
    return null;
  }

}

export function showErrorMsg(control: AbstractControl, errorKey: string): boolean {
  return !!(control.touched && control.invalid && control.errors[errorKey]);
}
