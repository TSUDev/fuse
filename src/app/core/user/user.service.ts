

//// moved to AuthService 


// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { User } from 'app/core/user/user.types';
// import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class UserService {
//     private _httpClient = inject(HttpClient);
//     // private _user: ReplaySubject<User> = new ReplaySubject<User>(1);
//     private _user: BehaviorSubject<User>;
//     public user$: Observable<User>;

//     constructor() {
//         // Get the current user from localStorage
//         const userLS = localStorage.getItem('userData') || null;
//         const storedUser = userLS ? JSON.parse(userLS) : null;
//         this._user = new BehaviorSubject<User>(storedUser);
//         this.user$ = this._user.asObservable();
//     }


//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Setter & getter for user
//      *
//      * @param value
//      */
//     set user(value: User) {
//         // Store the value
//         this._user.next(value);

//         localStorage.setItem('userData', JSON.stringify(value));
//     }

//     // get user$(): Observable<User> {
//     //     return this._user.asObservable();
//     // }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Get the current signed-in user data
//      */
//     get(): Observable<User> {
//         return this._httpClient.get<User>('api/common/user').pipe(
//             tap((user) => {
//                 this._user.next(user);
//             })
//         );
//     }

//     /**
//      * Update the user
//      *
//      * @param user
//      */
//     update(user: User): Observable<any> {
//         return this._httpClient.patch<User>('api/common/user', { user }).pipe(
//             map((response) => {
//                 this._user.next(response);

//                 localStorage.setItem('userData', JSON.stringify(response));
//             })
//         );
//     }


//     // getUser(): User | null {
//     //     const userData = localStorage.getItem('userData');
//     //     return userData ? JSON.parse(userData) : null;
//     // }

// }
