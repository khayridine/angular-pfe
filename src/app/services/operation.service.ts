import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Portefeuille } from '../model/portefeuille';
import { EfficientFrontierInput } from '../model/frontiereInput';
import { EfficientFrontierResponse } from '../model/frontierResponse';
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



  savePortefeuille(portefeuille: Portefeuille): Observable<any> {
    return this.http.post<any>(this.apiUrl+'portefeuille/save-portefeuille', portefeuille);
  } 
  
  getPorfeuilles(): Observable<Portefeuille[]> {
    return this.http.get<Portefeuille[]>(this.apiUrl+'portefeuille/portefeuilles');
  }
  getEfficientFrontier(data: EfficientFrontierInput): Observable<EfficientFrontierResponse> {
    return this.http.post<EfficientFrontierResponse>(this.apiUrl + 'efficient-frontier', data);
  }
  submitOptimisation(payload: {
  expected_returns: number[],
  cov_matrix: number[][],
  target_return: number,
  current_weights: number[]
}): Observable<any> {
  return this.http.post<any>('http://localhost:8000/efficient-frontier', payload);
}
applyOptimization(payload: { optimal_weights: number[] }) {
  return this.http.post('http://localhost:8000/apply-optimization', payload);
}

  saveDraft(draftPayload: any): Observable<any> {
    
    return this.http.post<any>('http://localhost:8000/save-draft', draftPayload);
  }
}

