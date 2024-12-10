import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})

export class ValidationService {

    match(controlName: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const passwordControl = control.root.get(controlName);
            if (passwordControl && control.value !== passwordControl.value) {
                return { mismatch: true };
            }
            return null;
        };
    }

    phoneValidation(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const phoneNumberRegex = /^\d+$/;
            if (phoneNumberRegex.test(control.value)) {
                return null; // Validation passed
            } else {
                return { invalidPhoneNumber: true };
            }
        };
    }
}