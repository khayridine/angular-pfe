import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OperationService } from '@app/services/operation.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-comparer-portefeuilles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparer-portefeuilles.component.html',
  styleUrl: './comparer-portefeuilles.component.scss'
})
export class ComparerPortefeuillesComponent implements OnInit {
  portefeuilles: any[] = [];
  meilleur: any = null;
  chartActifs: any;
  chartCompare: any;

  constructor(private operationService: OperationService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.operationService.getPortefeuilles().subscribe((data: any[]) => {
      const ids = data.map(p => p.id);
      this.operationService.comparerPortefeuilles(ids).subscribe(result => {
        this.portefeuilles = result.portefeuilles;
        this.meilleur = result.meilleur;

        // Attendre que le DOM ait le temps de rendre les canvas
        setTimeout(() => {
          this.renderCharts();
        }, 0);
      });
    });
  }

  renderCharts(): void {
    // Nettoyer les anciens graphiques
    if (this.chartActifs) this.chartActifs.destroy();
    if (this.chartCompare) this.chartCompare.destroy();

    // Bar Chart 1 : Nombre d’actifs
    const canvasActifs = document.getElementById('barChartActifs') as HTMLCanvasElement;
    if (!canvasActifs) return;
    const ctx1 = canvasActifs.getContext('2d');
    if (!ctx1) return;
    const topPortefeuilles = [...this.portefeuilles]
      .sort((a, b) => b.sharpe - a.sharpe)
      .slice(0, 10)
    this.chartActifs = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: topPortefeuilles.map(p => 'Portefeuille ' + p.id),
        datasets: [{
          label: 'Nombre d’actifs',
          data: topPortefeuilles.map(p => p.nombre_actifs),
          backgroundColor: '#4caf50'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Top 10 : Nombre d’actifs par portefeuille (par Sharpe)' }
        }
      }
    });
    // Bar Chart 2 : Comparaison des indicateurs
    const canvasCompare = document.getElementById('barChartCompare') as HTMLCanvasElement;
    if (!canvasCompare) return;
    const ctx2 = canvasCompare.getContext('2d');
    if (!ctx2) return;

    this.chartCompare = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Rendement', 'Risque', 'Sharpe'],
        datasets: topPortefeuilles.map(p => ({
          label: 'PF ' + p.id,
          data: [p.rendement, p.risque, p.sharpe],
          backgroundColor: this.meilleur && p.id === this.meilleur.id ? '#4caf50' : '#2196f3'
        }))
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 10 : Comparaison des indicateurs clés (par Sharpe)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => value + '%'
            }
          }
        }
      }
    });

  }
}
