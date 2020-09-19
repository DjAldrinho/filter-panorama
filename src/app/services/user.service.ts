import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = `${environment.apiUrl}/users/`;

  constructor(
    private http: HttpClient
  ) {
  }

  public getUsers(): Observable<any> {
    return this.http.get(this.usersUrl).pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  private handleError(error): any {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
