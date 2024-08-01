import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Observable,
  catchError,
} from 'rxjs';
import Swal from 'sweetalert2';
import { IResponse, Product } from '../../model/bank-model';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  apiUrl: any = 'http://localhost:3002/';

  constructor(private _httpClient: HttpClient) { }

  saveProduct(data: Product) {
    let urlEndpointGenerate =
      this.apiUrl + 'bp/products';
    return this._httpClient.post<any>(urlEndpointGenerate, data).pipe(
      catchError(this.handleError)
    );
  }

  getProducts() {
    let urlEndpointGenerate =
      this.apiUrl + 'bp/products';
    return this._httpClient.get<Response>(urlEndpointGenerate).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(id: any) {
    let urlEndpointGenerate =
      this.apiUrl + 'bp/products/';
    return this._httpClient.get<any>(urlEndpointGenerate + id).pipe(
      catchError(this.handleError)
    );
  }

  updateProduct(data: Product) {
    let urlEndpointGenerate = `${this.apiUrl}bp/products/${data.id}`;
    return this._httpClient.put<any>(urlEndpointGenerate, data).pipe(
      catchError(error => this.handleError(error))
    );
  }


  deleteProduct(id: string) {
    let urlEndpointGenerate = `${this.apiUrl}bp/products/${id}`;
    return this._httpClient.delete<any>(urlEndpointGenerate).pipe(
      catchError(this.handleError)
    );
  }

  verifyProduct(id: string) {
    let urlEndpointGenerate = `${this.apiUrl}bp/products/verification/${id}`;

    return this._httpClient.get<Response>(urlEndpointGenerate).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<any> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `error: ${error.status}, ` + `: ${error.error}`;
    }

    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Oops...',
      html: `Error: ${errorMessage}. Intenta nuevamente!`,
      showConfirmButton: false,
      timer: 1500
    });
    return new Observable<any>();
  }


}
