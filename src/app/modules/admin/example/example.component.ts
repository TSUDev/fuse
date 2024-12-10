import { Component, ViewEncapsulation } from '@angular/core';
import { TranslocoModule } from "@ngneat/transloco"

import { MatButton } from '@angular/material/button';
import { APIService } from 'app/core/STC/services/api.service';

@Component({
    selector: 'example',
    standalone: true,
    templateUrl: './example.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [TranslocoModule,MatButton]
})
export class ExampleComponent {
    /**
     * Constructor
     */
    constructor(private _apiServce: APIService) {
    }


    testApi(): void {

        let args: any = {
            email: "123",
            password: "222222222"
        }

        this._apiServce.getCardsDetailsList(args).subscribe({
            next: (response) => {
                // Handle successful API Call response
                console.log('API Call successful .response:');
                console.log(response);
            },
            error: (error) => {
                // Handle error (already logged in the service)
                console.error('API Call failed .error:');
                console.log(error);
            }
        });

    }

}
