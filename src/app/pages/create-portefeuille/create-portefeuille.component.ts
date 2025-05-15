// create-portefeuille.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts' 
import { Actif } from 'src/app/model/actif';
import { OperationService } from 'src/app/services/operation.service';
 
@Component({
  selector: 'app-create-portefeuille',
  templateUrl: './create-portefeuille.component.html',
  imports: [FormsModule, CommonModule, NgChartsModule],
  standalone: true,
})
export class CreatePortefeuilleComponent {
  montantTotal: number = 0;
  actifs: Actif[] = [];
  messageRendement: string = '';
  afficherResultats: boolean = false;
  messageRendementTitre: string = '';
  messageRendementTexte: string = '';

  constructor(private OperationService:OperationService , private  router:Router){}

  chartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#FF7043'],
      },
    ],
  };
  afficherAnalyse() {
    this.mettreAJourGraphique();
    this.calculerRendement();
    this.afficherResultats = true;
  }

  ajouterActif() {
    this.actifs.push({ nom: '', categorie: '',type:'', pourcentage: 0, rendement: 0, volatilite: 0 });
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
    console.log('Formulaire réinitialisé');
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
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton portefeuille est trop exposé à des actifs en perte. Un rééquilibrage rapide est recommandé pour limiter les risques de perte de capital.`
      };
    } else if (r >= -5 && r < 0) {
      return {
        titre: '⚠️ Attention : Performance négative',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton capital pourrait légèrement diminuer au fil du temps. Il serait utile d’analyser les actifs sous-performants et de rééquilibrer ton portefeuille pour viser un rendement positif plus stable.`
      };
    } else if (r >= 0 && r < 4) {
      return {
        titre: '✅ Stabilité : Faible croissance',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton portefeuille est relativement stable, avec une faible croissance. Il protège ton capital contre l’inflation, mais il pourrait être optimisé pour générer plus de valeur à long terme.`
      };
    } else if (r >= 4 && r < 8) {
      return {
        titre: '✨ Équilibre : Bonne performance maîtrisée',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que ton portefeuille offre un bon équilibre entre performance et stabilité. Il est adapté à un profil équilibré, avec une croissance progressive et un risque modéré.`
      };
    } else if (r >= 8 && r < 15) {
      return {
        titre: '💰 Dynamique : Forte croissance attendue',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que tu vises une croissance importante de ton capital, avec une prise de risque modérée à élevée. Ce type de portefeuille est adapté à un investisseur dynamique, prêt à accepter des fluctuations à court terme.`
      };
    } else { // r >= 15
      return {
        titre: '⚡️ Spéculatif : Objectif ambitieux, vigilance requise',
        texte: `Ton rendement total estimé annuel pour ce portefeuille est ${rendement} %. Cela signifie que tu poursuis un objectif de rendement très ambitieux. Ce niveau élevé implique souvent une forte volatilité et un risque important : il est essentiel de bien surveiller les performances, de rester informé sur les marchés, et de diversifier pour limiter les pertes potentielles.`
      };
    }
  }

  goBackWithFlash(): void {
    const backIcon = document.querySelector('.back-icon') as HTMLElement;
    if (backIcon) {
      backIcon.classList.add('flash');


      setTimeout(() => {
        backIcon.classList.remove('flash');
        window.history.back();
      }, 300);
    }
  }
  savePortefeuille(): void {
    console.log('Sauvegarde du portefeuille...');
    try {
      const portefeuille = {
        montantTotal: this.montantTotal,
        actifs: this.actifs.map(actif => ({
          nom: actif.nom,
          categorie: actif.categorie,
          type: actif.type,
          pourcentage: actif.pourcentage,
          rendement: actif.rendement,
          volatilite: actif.volatilite
        })) 
      };
      console.log('Portefeuille sauvegardé :', portefeuille);
      this.OperationService.savePortefeuille(portefeuille).subscribe({
        next: (response) => { 
          console.log('Portefeuille sauvegardé avec succès :', response);
          this.resetForm(); // Réinitialiser le formulaire après la sauvegarde
        }
        , error: (error) => {       
          console.error('Erreur lors de la sauvegarde du portefeuille :', error);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du portefeuille :', error);
    }


  }
}