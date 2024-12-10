import { NgTemplateOutlet } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';
import { take } from 'rxjs';

@Component({
    selector: 'languages',
    templateUrl: './languages.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'languages',
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, NgTemplateOutlet],
})
export class LanguagesComponent implements OnInit, OnDestroy {
    availableLangs: AvailableLangs;
    activeLang: string;
    flagCodes: any;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService,
        private _translocoService: TranslocoService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    xPosition = "before"

    private updateDirection(): void {
        const dir = document.documentElement.getAttribute('dir');
        if (dir === 'rtl') {
            this.xPosition = "after";
        } else {
            this.xPosition = "before";
        }

    }
    // ngOnInit(): void {

    //     // Get the available languages from transloco
    //     this.availableLangs = this._translocoService.getAvailableLangs();

    //     // Subscribe to language changes
    //     this._translocoService.langChanges$.subscribe((activeLang) => {
    //         // Get the active lang
    //         this.activeLang = activeLang;


    //         // Update the RTL/LTR direction
    //         this.setRtlDirection(activeLang);

    //         // Update the navigation
    //         this._updateNavigation(activeLang);
    //     });

    //     // Set the country iso codes for languages for flags
    //     this.flagCodes = {
    //         en: 'us',
    //         ar: 'jo',
    //         // tr: 'tr',
    //     };


    //     this.updateDirection();
    //     const observer = new MutationObserver(() => this.updateDirection());
    //     observer.observe(document.documentElement, {
    //         attributes: true,
    //         attributeFilter: ['dir']
    //     });

    // }

    ngOnInit(): void {

        this.getStoredLang();


        // Continue with the rest of the initialization
        this.availableLangs = this._translocoService.getAvailableLangs();
        this.flagCodes = { en: 'us', ar: 'jo' };
        this.updateDirection();

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) => {
            this.activeLang = activeLang;
            this.setRtlDirection(activeLang);
            this._updateNavigation(activeLang);
        });

        // MutationObserver for direction updates
        const observer = new MutationObserver(() => this.updateDirection());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir']
        });




    }

    getStoredLang(): void {

        // Retrieve the saved language or default to 'en'
        const savedLang = localStorage.getItem('language') || 'en';

        // Set the active language
        this._translocoService.setActiveLang(savedLang);
    }


    /**
     * On destroy
     */
    ngOnDestroy(): void { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the active lang
     *
     * @param lang
     */
    setActiveLang(lang: string): void {
        console.log("set active langgggg " + lang);
        // Set the active lang
        this._translocoService.setActiveLang(lang);

        // Save the language in localStorage
        localStorage.setItem('language', lang);

        this.setRtlDirection(lang);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the navigation
     *
     * @param lang
     * @private
     */
    private _updateNavigation(lang: string): void {
        // For the demonstration purposes, we will only update the Dashboard names
        // from the navigation but you can do a full swap and change the entire
        // navigation data.
        //
        // You can import the data from a file or request it from your backend,
        // it's up to you.

        // Get the component -> navigation data -> item
        const navComponent =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                'mainNavigation'
            );

        // Return if the navigation component does not exist
        if (!navComponent) {
            return null;
        }

        // Get the flat navigation data
        const navigation = navComponent.navigation;

        // Get the Project dashboard item and update its title
        const projectDashboardItem = this._fuseNavigationService.getItem(
            'dashboards.project',
            navigation
        );
        if (projectDashboardItem) {
            this._translocoService
                .selectTranslate('Project')
                .pipe(take(1))
                .subscribe((translation) => {
                    // Set the title
                    projectDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }

        // Get the Analytics dashboard item and update its title
        const analyticsDashboardItem = this._fuseNavigationService.getItem(
            'dashboards.analytics',
            navigation
        );
        if (analyticsDashboardItem) {
            this._translocoService
                .selectTranslate('Analytics')
                .pipe(take(1))
                .subscribe((translation) => {
                    // Set the title
                    analyticsDashboardItem.title = translation;

                    // Refresh the navigation component
                    navComponent.refresh();
                });
        }
    }




    private setRtlDirection(lang: string): void {

        const direction = ['ar', 'he', 'fa', 'ur'].includes(lang) ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('dir', direction);

        document.documentElement.setAttribute('lang', lang);
    }
}
