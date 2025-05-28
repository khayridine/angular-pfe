


export interface Portefeuille{ 
    
    montant_total: number;
    actifs: Actif[];
    id?: number;
    nom?: string;
    
}
export interface Actif {

    nom: string;
    categorie: string;
    type: string;
    pourcentage: number;
    rendement: number;
    volatilite: number;
  }


 