import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class APIService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  ping() {
    return this.http.get<any>(this.apiUrl + 'Auth/ping');
  }

  getCardsDetailsList(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'getCardsDetailsList', data);
  }






}

/*
login(username: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
    map(response => response.token),           // Extract token
    tap(token => localllllllStorage.setItem('authToken', token)), // Save to locallllllStorage
    switchMap(token => this.http.get(`profile?token=${token}`)), // Fetch user profile
    catchError(error => {
      console.error('Error during login:', error);
      return throwError(() => error);
    }),
    finalize(() => console.log('Login request finished')) // Cleanup
  );
}



  // get<T>(endpoint: string): Observable<T> {
  //   return this.http.get<T>(`${this.apiUrl}/${endpoint}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // post<T>(endpoint: string, data: any): Observable<T> {
  //   return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // put<T>(endpoint: string, data: any): Observable<T> {
  //   return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  // delete<T>(endpoint: string): Observable<T> {
  //   return this.http.delete<T>(`${this.apiUrl}/${endpoint}`).pipe(
  //     // catchError(this.handleError)
  //   );
  // }

  // // Handle API errors
  // private handleError(error: any) {
  //   // Log the error to the console or send to a logging service
  //   console.error('API error:', error);
  //   return throwError(() => new Error(error));
  // }


*/