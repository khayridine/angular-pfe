import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../services/operation.service';
import { NgChartsModule } from 'ng2-charts'; 
import { ChartType } from 'chart.js'; 
import { CryptoService } from '../../services/crypto.service'; // Import du service

@Component({
  selector: 'app-portfeuille',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './portfeuille.component.html',
  styleUrls: ['./portfeuille.component.scss']
})
export class PortfeuilleComponent implements OnInit {
  operations: any[] = [];
  cryptoPrices: any = {}; // Pour stocker les prix des crypto-monnaies
  isBrowser: boolean;
  
  // Déclaration unique du constructeur
  constructor(private operationService: OperationService, private cryptoService: CryptoService) {
    // Vérifie si le code est exécuté côté client (navigateur)
    this.isBrowser = typeof window !== 'undefined';
  }

  chartData = {
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      backgroundColor: [] as string[],
    }]
  };

  chartType: ChartType = 'bar';  // Graphique en barres

  // Autres configurations de graphiques
  chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const  // Assurez-vous que la valeur est 'top', 'left', 'right', 'bottom', 'center', ou 'chartArea'
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
    // Récupérer les opérations
    this.operationService.getOperations().subscribe((data) => {
      this.operations = data;
      this.updateChartData();
    });

    // Appeler l'API des prix des crypto-monnaies
    this.cryptoService.getCryptoPrices().subscribe((data) => {
      this.cryptoPrices = data;
      // Préparer les données pour le graphique des crypto-monnaies
      this.chartData.labels = Object.keys(this.cryptoPrices); // Bitcoin, Ethereum, etc.
      this.chartData.datasets[0].data = Object.values(this.cryptoPrices); // Les prix
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
}
