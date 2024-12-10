//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';//inject,
import { Translation, TranslocoLoader } from '@ngneat/transloco';
import { Observable, of } from 'rxjs';

import { locale as arLang } from '../../../../public/i18n/ar';
import { locale as enLang } from '../../../../public/i18n/en';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
    // private _httpClient = inject(HttpClient);


    getTranslation(lang: string): Observable<Translation> {

        if (lang === 'ar') {
            // Return the statically imported translation as an observable
            return of(arLang);
        }

        if (lang === 'en') {
            // Return the statically imported translation as an observable
            return of(enLang);
        }

        // return this._httpClient.get<Translation>(`./i18n/${lang}.json`);
    }
}
