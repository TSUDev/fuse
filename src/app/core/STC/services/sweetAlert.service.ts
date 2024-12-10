import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
// import { text } from 'stream/consumers';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { APIService } from './api.service';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
    providedIn: 'root',
})
export class SweetAlertService {
    yesTranslation: any;
    noTranslation: any;
    retryTranslation: any;
    confirmText: any;
    connectionTranslation: any;

    constructor(
        private toastr: ToastrService,
        private apiService: APIService,
        private _translocoService: TranslocoService
    ) { }

    // Basic alert
    alertConnection(options: SweetAlertOptions): Promise<SweetAlertResult<any>> {

        this._translocoService.selectTranslate('sweetAlert.retry').subscribe({
            next: (response) => {
                this.retryTranslation = response;
            }
        })

        this._translocoService.selectTranslate('sweetAlert.connectionTranslation').subscribe({
            next: (response) => {
                this.connectionTranslation = response;
            }
        })


        const defaultOptions: SweetAlertOptions =

            Object.assign({

                title: this.connectionTranslation,
                //display text sent from component calling confirm method
                icon: 'warning',
                iconColor: 'var(--sw-color-danger)',
                confirmButtonColor: 'var(--sw-color-primary)',
                confirmButtonText: this.retryTranslation,
                showCancelButton: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                allowOutsideClick: false,
                reverseButtons: true,
                preConfirm: () => {
                    // Custom behavior when "Retry" is clicked
                    Swal.showLoading(); // Show loading indicator

                    return new Promise<void>((resolve) => {
                        // Call the account service ping method
                        this.apiService.ping().subscribe({
                            next: (response: any) => {
                                // Check if there are errors returned from API
                                if (response.error) {
                                    // Handle different error types
                                    if (typeof response.errorMessage === "string") {
                                        this.toastr.error(response.errorMessage);
                                    } else if (response.errorMessage instanceof Array) {
                                        this.toastr.error(response.errorMessage.map((item: any) => item.description).join("\n"));
                                    }
                                    Swal.hideLoading(); // Stop loading indicator
                                    resolve(); // Resolve to keep alert open
                                    return;
                                }

                                // Success case
                                location.reload();


                                // Success case
                                Swal.hideLoading(); // Stop loading indicator
                                this.toastr.success(response.result);
                                resolve(); // Optionally resolve here if you want to close the alert
                            },
                            error: () => {
                                Swal.hideLoading(); // Stop loading on error
                                resolve(); // Resolve to keep alert open
                            }
                        });
                    });
                },
            }, options);

        return Swal.fire({ ...defaultOptions });
    }

    // Confirmation dialog
    confirm(options: SweetAlertOptions): Promise<SweetAlertResult<any>> {

        // get (yes button) text translation
        this._translocoService.selectTranslate('sweetAlert.yes').subscribe({
            next: (response) => {
                this.yesTranslation = response;
            }
        })
        // console.log(this.yesTranslation)

        // get (no button) text translation

        this._translocoService.selectTranslate('sweetAlert.no').subscribe({
            next: (response) => {
                this.noTranslation = response;
            }
        })
        // get (confrim) text translation
        this._translocoService.selectTranslate('sweetAlert.confirm').subscribe({
            next: (response) => {
                this.confirmText = response;
            }
        })
        // console.log(this.confirmText)

        const defaultOptions: SweetAlertOptions =

            Object.assign({

                title: this.confirmText,
                //display text sent from component calling confirm method
                text: this.confirmText,
                icon: 'warning',
                iconColor: 'var(--sw-color-warning)',
                confirmButtonColor: 'var(--sw-color-primary)',
                confirmButtonText: this.yesTranslation,
                showCancelButton: true,
                cancelButtonColor: 'var(--sw-color-danger)',
                cancelButtonText: this.noTranslation,
                allowEscapeKey: false,
                allowEnterKey: false,
                allowOutsideClick: false,
                reverseButtons: true
            },
                options)

        return Swal.fire({ ...defaultOptions });
    }

    // Success message
    success(options: SweetAlertOptions): Promise<SweetAlertResult<any>> {

        const defaultOptions: SweetAlertOptions =

            Object.assign({
                title: 'Success',
                text: "Success",
                icon: 'success',
                iconColor: 'var(--sw-color-success)',
                confirmButtonColor: 'var(--sw-color-primary)',
                confirmButtonText: 'Ok',
                allowEscapeKey: false,
                allowEnterKey: false,
                allowOutsideClick: false,


            },
                options)
        return Swal.fire({ ...defaultOptions });
    }

    // Error message
    error(options: SweetAlertOptions): Promise<SweetAlertResult<any>> {
        const defaultOptions: SweetAlertOptions =
            Object.assign({
                title: 'Error',
                text: 'Error',
                icon: 'error',
                iconColor: 'var(--sw-color-danger)',
                confirmButtonColor: 'var(--sw-color-primary)',
                confirmButtonText: 'Ok',
                allowEscapeKey: false,
                allowEnterKey: false,
                allowOutsideClick: false,
            }, options)
        return Swal.fire({ ...defaultOptions });
    }

}
/*  func(options){
    Object.assign({
        text:'ramez',
        title:'idk'
    },options)
}

if
options ={ text:'Moh'}

((then result will be:))

text:'Moh',
title:'idk'
*/