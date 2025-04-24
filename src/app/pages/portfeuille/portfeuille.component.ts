import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../services/operation.service';
import { NgChartsModule } from 'ng2-charts'; 
import { ChartType } from 'chart.js'; 

@Component({
  selector: 'app-portfeuille',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './portfeuille.component.html',
  styleUrls: ['./portfeuille.component.scss']
})
export class PortfeuilleComponent implements OnInit {
  operations: any[] = [];

 
  chartData = {
    labels: [] as string[],
    datasets: [{
      data: [] as number[],
      backgroundColor: [] as string[],
    }]
  };

  chartType: ChartType = 'pie'; 

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.operationService.getOperations().subscribe((data) => {
      this.operations = data;
      this.updateChartData();
      this.chartData = {
        labels: data.map(op => `${op.type} (${op.date})`),
        datasets: [{
          data: data.map(op => op.montant),
          backgroundColor: [
            '#FF5733', // Couleur 1
            '#33FF57', // Couleur 2
            '#3357FF', // Couleur 3
            '#F9A825', // Couleur 4
            '#8E24AA', // Couleur 5
            '#0288D1', // Couleur 6
            '#FF8A65'  // Couleur 7
          ], // Tableau de couleurs personnalisées
          
        }]
      };
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
