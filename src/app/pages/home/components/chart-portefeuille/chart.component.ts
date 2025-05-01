import { Component, Input, OnChanges, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Router } from '@angular/router';

interface Operation {
  id: number;
  type: string;
  date: string;
  montant: number;
}

@Component({
  selector: 'app-chart-portefeuille',
  standalone: true,
  templateUrl: './chart.component.html',
  imports: [NgChartsModule]
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() operations: Operation[] = [];
  pieChartLabels: string[] = [];
  pieChartData: number[] = [];
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  pieChartDataSet: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      }
    ]
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.buildChart();
    }
  }

  ngOnChanges() {
    if (isPlatformBrowser(this.platformId)) {
      this.buildChart();
    }
  }

  buildChart() {
    if (!this.operations || this.operations.length === 0) {
      return;
    }

    
    const groupedByType: { [key: string]: number } = {};

    this.operations.forEach(op => {
      
      groupedByType[op.type] = (groupedByType[op.type] || 0) + op.montant;
    });

    
    this.pieChartLabels = Object.keys(groupedByType);
    this.pieChartData = Object.values(groupedByType);

    
    this.pieChartDataSet.labels = this.pieChartLabels;
    this.pieChartDataSet.datasets[0].data = this.pieChartData;
    this.pieChartDataSet.datasets[0].backgroundColor = this.generateColors(this.pieChartLabels.length);
  }

  generateColors(count: number): string[] {
    const colors: string[] = [];
    const predefinedColors = ['#800020','#ffcc00','#28a745', '#003366' ];
    for (let i = 0; i < count; i++) {
      // Générer des couleurs distinctes pour chaque type
      colors.push(predefinedColors[i % predefinedColors.length]);
    }
    return colors;
  }
}
