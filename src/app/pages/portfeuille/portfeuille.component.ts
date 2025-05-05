import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../services/operation.service';
import { NgChartsModule } from 'ng2-charts'; 
import { ChartType } from 'chart.js'; 
import { TitleComponent } from '../../components/title/title.component'; // Import du composant TitleComponent
import { CryptoService } from '../../services/crypto.service'; // Import du service
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfeuille',
  standalone: true,
  imports: [CommonModule, NgChartsModule,TitleComponent],
  templateUrl: './portfeuille.component.html',
  styleUrls: ['./portfeuille.component.scss']
})
export class PortfeuilleComponent implements OnInit {
  operations: any[] = [];
  cryptoPrices: any = {}; 
  isBrowser: boolean;
  
  
  constructor(private operationService: OperationService, private cryptoService: CryptoService , private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    
    this.isBrowser = typeof window !== 'undefined';
  }

  chartData = {
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      backgroundColor: [] as string[],
    }]
  };

  chartType: ChartType = 'bar';  

  
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const  
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };
  
  ngOnInit(): void {
    
    this.operationService.getOperations().subscribe((data) => {
      this.operations = data;
      this.updateChartData();
    });

    
    this.cryptoService.getCryptoPrices().subscribe((data) => {
      this.cryptoPrices = data;
      
      this.chartData.labels = Object.keys(this.cryptoPrices); 
      this.chartData.datasets[0].data = Object.values(this.cryptoPrices); 
      this.chartData.datasets[0].backgroundColor = this.chartData.labels.map(() => this.getRandomColor());
    });
  }

  updateChartData() {
    const grouped = this.operations.reduce((acc: any, op: any) => {
      acc[op.type] = (acc[op.type] || 0) + op.montant;
      return acc;
    }, {});

    this.chartData.labels = Object.keys(grouped);
    this.chartData.datasets[0].data = Object.values(grouped);
    this.chartData.datasets[0].backgroundColor = this.chartData.labels.map(() => this.getRandomColor());
  }

  getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
  goToFormulaire(): void {
    this.router.navigate(['/formulaire']);
  }
}

