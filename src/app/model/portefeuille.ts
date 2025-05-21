import { Actif } from "./actif";

export interface Portefeuille{   
    montant_total: number;
    actifs: Actif[];
}