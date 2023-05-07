import {FormControl, ValidationErrors} from "@angular/forms";

export class UserValidators {

  static account(control: FormControl): ValidationErrors | null {
    const pattern: RegExp = /^[a-zA-Z0-9]{2,20}$/
    if (!pattern.test(control.value))
      return {'pattern': true}
    return null;
  }
}
