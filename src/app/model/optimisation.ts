export interface PointFrontiere {
  rendement: number;
  risque: number;
}
export interface Point {
  risque: number;
  rendement: number;
}

export interface OptimisationResponse {
  allocation_actuelle: number[];
  allocation_optimisee: number[];
  message: string;
  
  frontiere_efficiente: Point[];
}
