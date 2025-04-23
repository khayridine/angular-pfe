import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:8000/operations';

  constructor(private http: HttpClient) {}

  getOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(this.apiUrl);
  }
}
