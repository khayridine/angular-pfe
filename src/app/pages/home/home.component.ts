import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '@app/components/header/header.component';
import { CoinsComponent } from './components/coins/coins.component';
import { ChartComponent } from './components/chart-portefeuille/chart.component';  // Corrige ici
import { DividendesComponent } from './components/dividendes/dividendes.component';
import { BulkQuotesComponent } from './components/bulk-quotes/bulk-quotes.component';
import { TitleComponent } from '@app/components/title/title.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    HeaderComponent, 
    CoinsComponent, 
    ChartComponent,
    DividendesComponent ,
    BulkQuotesComponent,
    TitleComponent]
})
export class HomeComponent {
  message: string = '';
  operations = [  
    { id: 1, type: 'Achat', date: '2025-04-29', montant: 300 },
    { id: 2, type: 'Vente', date: '2025-04-30', montant: 150 },
    { id: 3, type: 'Vente', date: '2025-04-30', montant: 200 },
    { id: 4, type: 'Achat', date: '2025-05-01', montant: 500 }
  ];

  constructor(private router: Router) {}
  goToPortefeuille(): void  {
    this.router.navigate(['/portfeuille']);
  }
  
  goToOptimisation(): void  {
    this.router.navigate(['/optimisation']);
    
    
  }
}
