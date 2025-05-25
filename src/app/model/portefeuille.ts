

export interface Portefeuille{   
    montant_total: number;
    actifs: Actif[];
}
export interface Actif {

    nom: string;
    categorie: string;
    type: string;
    pourcentage: number;
    rendement: number;
    volatilite: number;
  }
  