import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actif, Portefeuille } from '../model/portefeuille';
import { EfficientFrontierInput } from '../model/frontiereInput';
import { EfficientFrontierResponse } from '../model/frontierResponse';
import { OptimisationResponse } from '../model/optimisation';

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
    return this.http.get<Operation[]>(`${this.apiUrl}operations`);
  }

  savePortefeuille(portefeuille: Portefeuille): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}portefeuille/save-portefeuille`, portefeuille);
  }

  getPortefeuilles(): Observable<Portefeuille[]> {
    return this.http.get<Portefeuille[]>(`${this.apiUrl}portefeuille/portefeuilles`);
  }

  getEfficientFrontier(data: EfficientFrontierInput): Observable<EfficientFrontierResponse> {
    return this.http.post<EfficientFrontierResponse>(`${this.apiUrl}efficient-frontier`, data);
  }

  // Cette méthode semble doublon avec optimiserPortefeuille, choisir une seule
  submitOptimisation(payload: {
    expected_returns: number[],
    cov_matrix: number[][],
    target_return: number,
    current_weights: number[]
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}efficient-frontier`, payload);
  }

  applyOptimization(payload: { optimal_weights: number[] }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}apply-optimization`, payload);
  }

  saveDraft(draftPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}save-draft`, draftPayload);
  }

  getNombreActifsParPortefeuille(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}portefeuilles/nb-actifs`);
  }

  comparerPortefeuilles(portefeuilleIds: number[], tauxSansRisque: number = 7.5): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}portefeuille/comparer?taux_sans_risque=${tauxSansRisque}`, portefeuilleIds);
  }

  getActifs(portefeuilleId: number): Observable<Actif[]> {
    return this.http.get<Actif[]>(`${this.apiUrl}portefeuilles/${portefeuilleId}/actifs`);
  }

  // Méthode principale d’optimisation
  optimiserPortefeuille(portefeuilleId: number, matrice: number[][]): Observable<OptimisationResponse> {
    return this.http.post<OptimisationResponse>(`${this.apiUrl}optimiser-portefeuille`, {
      portefeuille_id: portefeuilleId,
      covariance_matrix: matrice 
    });
  }
  deletePortefeuille(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}portefeuille/${id}`);
}
}
