import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { FuseDrawerComponent } from '@fuse/components/drawer';
import {
    FuseConfig,
    FuseConfigService,
    Scheme,
    Theme,
    Themes,
} from '@fuse/services/config';

import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    styles: [
        `
            settings {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media screen and ( min-width: 1280px) {
                [dir="ltr"] empty-layout + settings .settings-cog {
                right: 0 !important;
                left: auto !important;
            }
                [dir="rtl"] empty-layout + settings .settings-cog {
                left: 0 !important;
                right: auto !important;
            }

            }
            
            @media screen and ( max-width: 1280px) {
            
                [dir="ltr"] {
                .settings-cog {
                     border-top-left-radius: 0.5rem; // start
                     border-bottom-left-radius: 0.5rem; // start
                     right: 0 !important;
                }
            }


            [dir="rtl"] {
                .settings-cog {
                    border-top-right-radius: 0.5rem; // start
                  border-bottom-right-radius: 0.5rem; // start
                  left: 0 !important;
                }
            }
            }

            [dir="ltr"] {
                .settings-cog {
                     border-top-left-radius: 0.5rem; // start
                     border-bottom-left-radius: 0.5rem; // start
                }
            }


            [dir="rtl"] {
                .settings-cog {
                    border-top-right-radius: 0.5rem; // start
                  border-bottom-right-radius: 0.5rem; // start
                }
            }


        `,
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        MatIconModule,
        FuseDrawerComponent,
        MatButtonModule,
        NgClass,
        MatTooltipModule,
    ],
})
export class SettingsComponent implements OnInit, OnDestroy {
    config: FuseConfig;
    layout: string;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------


    isRTL: boolean = false;

    private updateDirection(): void {
      const dir = document.documentElement.getAttribute('dir');
      this.isRTL = dir === 'rtl';
    }

    /**
     * On init
     */
    // ngOnInit(): void {
    //     // Subscribe to config changes
    //     this._fuseConfigService.config$
    //         .pipe(takeUntil(this._unsubscribeAll))
    //         .subscribe((config: FuseConfig) => {
    //             // Store the config
    //             this.config = config;
    //         });

    //         this.updateDirection();
    //         const observer = new MutationObserver(() => this.updateDirection());
    //         observer.observe(document.documentElement, {
    //           attributes: true,
    //           attributeFilter: ['dir']
    //         });
    // }
    ngOnInit(): void {
        // Retrieve stored configuration from localStorage
        const storedConfig = localStorage.getItem('themeAppConfig');
        if (storedConfig) {
            this.config = JSON.parse(storedConfig);
            this._fuseConfigService.config = this.config;
        }
    
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                // Store the config
                this.config = config;
    
                // Save the config to localStorage
                localStorage.setItem('themeAppConfig', JSON.stringify(this.config));
            });
    
        // Update direction for RTL/LTR
        this.updateDirection();
        const observer = new MutationObserver(() => this.updateDirection());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['dir'],
        });
    }

    
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the layout on the config
     *
     * @param layout
     */
    setLayout(layout: string): void {
        // Clear the 'layout' query param to allow layout changes
        this._router
            .navigate([], {
                queryParams: {
                    layout: null,
                },
                queryParamsHandling: 'merge',
            })
            .then(() => {
                // Set the config
                this._fuseConfigService.config = { layout };
            });
    }

    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void {
        this._fuseConfigService.config = { scheme };
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void {
        this._fuseConfigService.config = { theme };
    }










    
    saveConfigToLocalStorage(): void {
        localStorage.setItem('themeAppConfig', JSON.stringify(this.config));
    }

    

}
