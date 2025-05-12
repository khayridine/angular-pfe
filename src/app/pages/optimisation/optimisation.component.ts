import { Component } from '@angular/core';
import { CommonModule ,isPlatformBrowser} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-optimisation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,NgChartsModule],
  templateUrl: './optimisation.component.html',
  styleUrls: ['./optimisation.component.scss']
})
export class OptimisationComponent {
  expectedReturns: number[] = [];
  covarianceMatrix: number[][] = [];
  targetReturn = 0;

  assetsCount = 3; // tu peux changer dynamiquement
  result: any = null;
  isBrowser: boolean;
  

 

  constructor(private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object) {
    this.initMatrix();
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  initMatrix() {
    this.expectedReturns = Array(this.assetsCount).fill(0);
    this.covarianceMatrix = Array.from({ length: this.assetsCount }, () =>
      Array(this.assetsCount).fill(0)
    );
  }

  submit() {
    const payload = {
      expected_returns: this.expectedReturns,
      cov_matrix: this.covarianceMatrix,
      target_return: this.targetReturn
    };

    this.http.post<any>('http://localhost:8000/efficient-frontier', payload).subscribe({
        next: (res) => {
          console.log("Réponse backend :", res);
          this.chartData.labels = res.risks;
          this.chartData.datasets[0].data = res.returns;
        },
        error: (err) => {
          console.error("Erreur HTTP :", err);
        }
      });
  }
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Frontière efficiente',
        borderColor: 'blue',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        pointRadius: 2,
        fill: false,
      }
    ]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Risque (Écart-type)' } },
      y: { title: { display: true, text: 'Rentabilité espérée' } }
    }
  };

  getFrontiere() {
  const payload = {
    expected_returns: this.expectedReturns,
    cov_matrix: this.covarianceMatrix
  };

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
