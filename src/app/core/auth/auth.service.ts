import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { environment } from 'environments/environment';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from 'app/core/user/user.types';
@Injectable({ providedIn: 'root' })
export class AuthService {
    private _httpClient = inject(HttpClient);

    private _authenticated: boolean = false;
    private _user: BehaviorSubject<User>;
    public user$: Observable<User>;
    private apiUrl = environment.apiUrl;



    constructor() {
        // Get the current user from localStorage
        const userLS = localStorage.getItem('userData');
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        try {
            const parseduserLS = JSON.parse(userLS)

            if (userLS && parseduserLS && accessToken && refreshToken) {
                this._authenticated = true;
                this._user = new BehaviorSubject<User>(JSON.parse(userLS));
                this.user$ = this._user.asObservable();
            }
            else {
                this._user = new BehaviorSubject<User>(null);
                this.user$ = this._user.asObservable();
                this.signOut();
            }

        } catch {
            this._user = new BehaviorSubject<User>(null);
            this.user$ = this._user.asObservable();
            this.signOut();
        }



    }

    set user(value: User) {
        // Store the value
        this._user.next(value);

        localStorage.setItem('userData', JSON.stringify(value));
    }

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }


    resetPassword(NewPassword: string, CurrentPassword: string): Observable<any> {
        return this._httpClient.post(this.apiUrl + 'Auth/resetMyAccountPassword',
            {
                CurrentPassword: CurrentPassword,
                NewPassword: NewPassword
            });
    }


    signIn(credentials: { username: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(this.apiUrl + 'Auth/login', credentials).pipe(
            switchMap((response: any) => {
                console.log(response);

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                this.refreshToken = response.refreshToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this.user = response.userData;
         
               console.log( this.user );

                // Return a new observable with the response
                return of(response);
            }),
            catchError(err => {

                // Return an observable with a user-facing error message.
                return throwError(() => err);

            })
        );
    }


    signOut(): Observable<any> {
        // Remove the access token from the local storage

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('cachedData');

        // Set the authenticated flag to false
        this._authenticated = false;

        this._user.next(null);

        // Return the observable
        return of(true);
    }


    getNewAccessTokenUsingRefreshToken(): Observable<any> {

        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            return this._httpClient.post(this.apiUrl + "Auth/refreshToken", { refreshToken })
        }

        // Return null if no refresh token is available
        return of(null);
    }


    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {

        if (this._authenticated) {
            return of(true);
        } else {
            return of(false);
        }

        // // Check if the user is logged in
        // if (this._authenticated) {
        //     return of(true);
        // }

        // // Check the access token availability
        // if (!this.accessToken) {
        //     return of(false);
        // }

        // // Check the access token expire date
        // if (AuthUtils.isTokenExpired(this.accessToken)) {
        //     return of(false);
        // }
        AuthUtils.isTokenExpired(this.accessToken)
        // // // If the access token exists, and it didn't expire, sign in using it
        // // return this.signInUsingToken();
    }


    isLoggedIn(): boolean {

        return this._authenticated;

        // if (this._authenticated) {
        //     return true;
        // }

        // if (!this.accessToken) {
        //     return false;
        // }

        // if (AuthUtils.isTokenExpired(this.accessToken)) {
        //     return false;
        // }

        // return true;

    }




    //#region 

    // get user$(): Observable<User> {
    //     return this._user.asObservable();
    // }

    get(): Observable<User> {
        return this._httpClient.get<User>('api/common/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);

                localStorage.setItem('userData', JSON.stringify(response));
            })
        );
    }


    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }



    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    if (response.refreshToken) {
                        this.refreshToken = response.refreshToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }


    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }


    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }
    //#endregion




}


