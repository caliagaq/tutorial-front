import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { Loan } from './model/Loan';
import { LoanPage } from './model/LoanPage';
import { LOAN_DATA } from './model/mock-loans';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  
  constructor(
    private httpClient: HttpClient
  ) { }
  
  
  getLoans(pageable: Pageable, gameId?:number, clientId?: number, date?:Date): Observable<LoanPage> {
    return this.httpClient.post<LoanPage>(this.composeFindUrl(gameId, clientId, date), {pageable:pageable});
  }

  deleteLoan(id: number): Observable<void> {
    return this.httpClient.delete<void>('http://localhost:8080/loan/'+ id);
  }
  
  saveLoan(loan: Loan): Observable<void> {
    return this.httpClient.put<void>('http://localhost:8080/loan', loan);
  }

  private composeFindUrl(gameId?:number, clientId?: number, date?:Date) : string {
    let url = 'http://localhost:8080/loan';
    let params = '';

    if(gameId != null) {
      params += "idGame="+ gameId;
    }
    if (clientId != null) {
      if(params != '')
        params += '&'
      
      params += 'idClient=' + clientId;
    }
    if (date != null){
      if(params != '')
        params += '&'
      
      params += 'date=' + date.toLocaleDateString();
    }

    if (params == '')
      return url;
    else return url + '?' + params;
  }
}
