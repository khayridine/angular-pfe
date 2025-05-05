import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class FormulaireComponent {
  form = {
    nom: '',
    age: 0,
    revenu: 0,
    capital: 0,
    objectif: ''
  };

  profil: string | null = null;

  calculerProfil(): void {
    const { age, revenu, capital, objectif } = this.form;

    let score = 0;

    if (age < 20) score += 2;
    else if (age < 50) score += 1;

    if (revenu > 5000) score += 2;
    else if (revenu > 3000) score += 1;

    if (capital > 5000) score += 2;
    else if (capital > 2000) score += 1;

    if (objectif === 'croissance') score += 2;
    else if (objectif === 'achat') score += 1;

    if (score >= 7) this.profil = 'Dynamique';
    else if (score >= 4) this.profil = 'Équilibré';
    else this.profil = 'Prudent';
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
}
