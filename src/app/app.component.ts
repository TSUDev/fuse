import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
    /**
     * Constructor
     */
    constructor(private _translocoService: TranslocoService) {}

    ngOnInit():void{
        this.getStoredLang();
    }
    
    getStoredLang(): void {

        // Retrieve the saved language or default to 'en'
        const savedLang = localStorage.getItem('language') || 'en';

        // Set the active language
        this._translocoService.setActiveLang(savedLang);

        const direction = ['ar', 'he', 'fa', 'ur'].includes(savedLang) ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', direction);

        document.documentElement.setAttribute('lang', savedLang);

    }


}
