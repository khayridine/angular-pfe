import { Actif } from "./actif";

export interface Portefeuille{   
    montantTotal: number;
    actifs: Actif[];
}