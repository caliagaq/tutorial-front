import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Client } from './model/Client';
@Injectable({
  providedIn: 'root'
})
export class ClientService {
  
  constructor(
    private http: HttpClient
  ) { }
  
  getClients() {
    return this.http.get<Client[]>('http://localhost:8080/client');
  }
  
  saveClient(client: Client): Observable<Client> {
    let url = 'http://localhost:8080/client/';
    if (client.id != null) {
      url += client.id;
    }
    return this.http.put<Client>(url, client).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);

    }
   
    return throwError(error);
  }
  
  deleteClient(id: number): Observable<Client> {
    return this.http.delete<Client>('http://localhost:8080/client/' + id);
  }

}
