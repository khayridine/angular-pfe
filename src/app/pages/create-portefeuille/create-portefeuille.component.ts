import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '@app/components/header/header.component';
import { Actif, Portefeuille } from '@app/model/portefeuille';

import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

import { OperationService } from 'src/app/services/operation.service';


@Component({
  selector: 'app-create-portefeuille',
  templateUrl: './create-portefeuille.component.html',
  imports: [FormsModule, CommonModule, NgChartsModule,HeaderComponent],
  standalone: true,
})
export class CreatePortefeuilleComponent implements OnInit {

  user: any;
  montantTotal: number = 0;
  actifs: Actif[] = [];
  messageRendement: string = '';
  afficherResultats: boolean = false;
  messageRendementTitre: string = '';
  messageRendementTexte: string = '';
  messageErreur: string = '';
  chartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043'],
      },
    ],
  };
  portefeuillesList: Portefeuille[]= [];

  constructor(
    private operationService: OperationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        window.location.href = '/login';
      } else {
        this.user = JSON.parse(user);
      }
    }  
    this.getPortefeuilles();
  }

 getPortefeuilles() {
    this.operationService.getPortefeuilles().subscribe({     
      next: (response) => {
        
        this.portefeuillesList = response;
        console.log('Portefeuilles:', this.portefeuillesList[2].actifs[0].nom);
        
        
        for (let index = 0; index < this.portefeuillesList.length; index++) {
          const element = this.portefeuillesList[index];
          console.log('Portefeuille', index , ' : ', element);

          
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des portefeuilles :', error);
      },
    });
  }
  
  afficherAnalyse() {
    this.messageErreur = ''; // Reset

    if (this.actifs.length === 0) {
      this.messageErreur = "Veuillez ajouter au moins un actif avant d'analyser le portefeuille.";
      return;
    }

    for (const actif of this.actifs) {
      if (
        !actif.nom?.trim() ||
        !actif.categorie?.trim() ||
        actif.pourcentage == null || actif.pourcentage <= 0 || actif.pourcentage > 100 ||
        actif.rendement == null ||
        actif.volatilite == null || actif.volatilite <= 0
      ) {
        this.messageErreur = "Veuillez remplir correctement tous les champs de chaque obligatoires actif avant d'analyser.";
        return;
      }

      const regexDeuxDecimales = /^\d+(\.\d{1,2})?$/;
      if (
        !regexDeuxDecimales.test(actif.pourcentage.toString()) ||
        !regexDeuxDecimales.test(actif.rendement.toString()) ||
        !regexDeuxDecimales.test(actif.volatilite.toString())
      ) {
        this.messageErreur = "Les valeurs numériques doivent avoir au maximum 2 chiffres après la virgule.";
        return;
      }
    }

    this.mettreAJourGraphique();
    this.calculerRendement();
    this.afficherResultats = true;
  }


  ajouterActif() {
    //TODO check pourcentageof all actifs not > 100
    if (this.actifs.length > 0) {
      const totalPourcentage  = this.actifs.reduce((acc, actif) => acc + actif.pourcentage, 0);
      if (totalPourcentage >= 100) {
        this.messageErreur = 'La somme des pourcentages des actifs ne doit pas dépasser 100%.';
        return;
      }
    } 
    this.actifs.push({ nom: '', categorie: '', type: '', pourcentage: 0, rendement: 0, volatilite: 0 });
  }

  supprimerActif(index: number) {
    this.actifs.splice(index, 1);
    this.mettreAJourGraphique();
  }

  resetForm() {
    this.montantTotal = 0;
    this.actifs = [];
    this.chartData.labels = [];
    this.chartData.datasets[0].data = [];
    this.messageRendement = '';
    this.messageErreur = '';
    this.afficherResultats = false;
  }

  mettreAJourGraphique() {
    this.chartData.labels = this.actifs.map((a) => a.nom);
    this.chartData.datasets[0].data = this.actifs.map((a) => a.pourcentage);
  }

  calculerRendement() {
    let total = 0;
    for (let actif of this.actifs) {
      total += (actif.pourcentage / 100) * actif.rendement;
    }
    const rendement = parseFloat(total.toFixed(2));
    const message = this.getMessageRendement(rendement);
    this.messageRendementTitre = message.titre;
    this.messageRendementTexte = message.texte;
  }

  getMessageRendement(r: number): { titre: string; texte: string } {
    const rendement = r.toFixed(2);
    if (r < -5) {
      return {
        titre: '❌ Alerte : Perte importante attendue',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton portefeuille est trop exposé à des actifs en perte. Un rééquilibrage rapide est recommandé pour limiter les risques de perte de capital.`,
      };
    } else if (r >= -5 && r < 0) {
      return {
        titre: '⚠️ Attention : Performance négative',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton capital pourrait légèrement diminuer au fil du temps. Il serait utile d’analyser les actifs sous-performants et de rééquilibrer ton portefeuille pour viser un rendement positif plus stable.`,
      };
    } else if (r >= 0 && r < 4) {
      return {
        titre: '✅ Stabilité : Faible croissance',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton portefeuille est relativement stable, avec une faible croissance. Il protège ton capital contre l’inflation, mais il pourrait être optimisé pour générer plus de valeur à long terme.`,
      };
    } else if (r >= 4 && r < 8) {
      return {
        titre: '✨ Équilibre : Bonne performance maîtrisée',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton portefeuille offre un bon équilibre entre performance et stabilité. Il est adapté à un profil équilibré, avec une croissance progressive et un risque modéré.`,
      };
    } else if (r >= 8 && r < 15) {
      return {
        titre: '💰 Dynamique : Forte croissance attendue',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que tu vises une croissance importante de ton capital, avec une prise de risque modérée à élevée. Ce type de portefeuille est adapté à un investisseur dynamique, prêt à accepter des fluctuations à court terme.`,
      };
    } else {
      return {
        titre: '⚡️ Spéculatif : Objectif ambitieux, vigilance requise',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que tu poursuis un objectif de rendement très ambitieux. Ce niveau élevé implique souvent une forte volatilité et un risque important : il est essentiel de bien surveiller les performances, de rester informé sur les marchés, et de diversifier pour limiter les pertes potentielles.`,
      };
    }
  }

  savePortefeuille(): void {
    if(this.montantTotal <= 0) {
      this.messageErreur = 'Veuillez entrer un montant total supérieur à 0.';   
      return;
    }
    if (this.actifs.length === 0) { 
      this.messageErreur = 'Veuillez ajouter au moins un actif avant de sauvegarder.';
      return;
    }
     
    for (const actif of this.actifs) {
      if (
        !actif.nom?.trim() ||
        !actif.categorie?.trim() ||
        actif.pourcentage == null || actif.pourcentage <= 0 || actif.pourcentage > 100 ||
        actif.rendement == null ||
        actif.volatilite == null || actif.volatilite <= 0
      ) {
        this.messageErreur = 'Veuillez remplir correctement tous les champs obligatoires avant de sauvegarder.';
        return;
      }

      const regexDeuxDecimales = /^\d+(\.\d{1,2})?$/;
      if (
        !regexDeuxDecimales.test(actif.pourcentage.toString()) ||
        !regexDeuxDecimales.test(actif.rendement.toString()) ||
        !regexDeuxDecimales.test(actif.volatilite.toString())
      ) {
        this.messageErreur = 'Les valeurs numériques doivent avoir au maximum 2 chiffres après la virgule.';
        return;
      }
    }

    try {
      const portefeuille :Portefeuille = {
        montant_total: this.montantTotal,
         actifs: this.actifs 
      };
      console.log('Portefeuille envoyé :', portefeuille); 
      this.operationService.savePortefeuille(portefeuille).subscribe({
        next: (response) => {
          console.log('Portefeuille sauvegardé avec succès :', response);
          this.portefeuillesList.push(portefeuille); // Ajout du portefeuille à la liste
          this.resetForm();
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde du portefeuille :', error);
        },
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du portefeuille :', error);
    }
  }
  calculerRisque(): number {
  let variance = 0;
  for (const actif of this.actifs) {
    const poids = actif.pourcentage / 100;
    variance += Math.pow(poids, 2) * Math.pow(actif.volatilite / 100, 2);
  }
  const volatilite = Math.sqrt(variance) * 100;
  return parseFloat(volatilite.toFixed(2));
}
calculerSharpe(rendement: number, volatilite: number, tauxSansRisque: number = 7.5): number {
  const sharpe = (rendement - tauxSansRisque) / volatilite;
  return parseFloat(sharpe.toFixed(2));
}
calculerRendementFrom(pf: Portefeuille): number {
  let total = 0;
  for (let actif of pf.actifs) {
    total += (actif.pourcentage / 100) * actif.rendement;
  }
  return parseFloat(total.toFixed(2));
}

calculerRisqueFrom(pf: Portefeuille): number {
  let variance = 0;
  for (let actif of pf.actifs) {
    const poids = actif.pourcentage / 100;
    variance += Math.pow(poids, 2) * Math.pow(actif.volatilite / 100, 2);
  }
  return parseFloat((Math.sqrt(variance) * 100).toFixed(2));
}


  
}
