import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://localhost:35606/api/';

  constructor(private http: HttpClient) {}

  private handleError(error: any) {
    console.error('API Error:', error);
    return throwError(error);
  }

  addDocument(data: any): Observable<any> {
    const addUrl = `${this.apiUrl}Model/CreateOrUpdate`;
    return this.http.post(addUrl, data).pipe(catchError(this.handleError));
  }

  getDocuments(): Observable<any[]> {
    const getUrl = `${this.apiUrl}Model`;
    return this.http.get<any[]>(getUrl).pipe(catchError(this.handleError));
  }

  updateDocument(data: any): Observable<any> {
    const updateUrl = `${this.apiUrl}Model/CreateOrUpdate`;
    return this.http.post(updateUrl, data).pipe(catchError(this.handleError));
  }

  getDepartments(): Observable<any[]> {
    const departmentUrl = `${this.apiUrl}Model/Department`;
    return this.http.get<any[]>(departmentUrl);
  }
}
