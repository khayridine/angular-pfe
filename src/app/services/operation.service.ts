import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Portefeuille } from '../model/portefeuille';
export interface Operation {
  id: number;
  type: string;
  date: string;
  statut: string;
  montant: number;
  taxe: number;
  frais: number;
}

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private apiUrl = 'http://localhost:8000/'; 

  constructor(private http: HttpClient) {}

  getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(this.apiUrl+'operations');
  }

  savePortefeuille(portefeuille: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'save-portefeuille', portefeuille);
  } 
  
}
