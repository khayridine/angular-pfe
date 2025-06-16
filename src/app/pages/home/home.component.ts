import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '@app/components/header/header.component';
import { CoinsComponent } from './components/coins/coins.component';
import { ChartComponent } from './components/chart-portefeuille/chart.component';  
import { DividendesComponent } from './components/dividendes/dividendes.component';
import { BulkQuotesComponent } from './components/bulk-quotes/bulk-quotes.component';
import { TitleComponent } from '@app/components/title/title.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    HeaderComponent, 
    CoinsComponent, 
  
    DividendesComponent ,
    BulkQuotesComponent,
    FooterComponent,
    TitleComponent]
})
export class HomeComponent {
  message: string = '';
  
  

  constructor(private router: Router) {}
  
  
  goToOptimisation(): void  {
    this.router.navigate(['/optimisation']);
    }
  goToCreatePortefeuille(): void {
    this.router.navigate(['/create-portefeuille']);
  }
}
