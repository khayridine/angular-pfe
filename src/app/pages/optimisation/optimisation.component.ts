import { Component, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '@app/components/header/header.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OperationService } from '@app/services/operation.service';


@Component({
  selector: 'app-optimisation',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgChartsModule, HeaderComponent, MatTooltipModule],
  templateUrl: './optimisation.component.html',
  styleUrls: ['./optimisation.component.scss']
})



export class OptimisationComponent {
   isBrowser = true;
  assetsCount = 3;
  expectedReturns: number[] = [];
  covarianceMatrix: number[][] = [];
  targetReturn = 0;
  currentWeights: number[] = [0.3, 0.4, 0.3];

  
  result: any = null;
  draftName: string = '';

 

  constructor(
    private operationService: OperationService,
    @Inject(PLATFORM_ID) private platformId: Object ,  
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.initData();
  }
  initData() {
  this.expectedReturns = Array(this.assetsCount).fill(0);
  this.currentWeights = Array(this.assetsCount).fill(1 / this.assetsCount);
  this.covarianceMatrix = Array.from({ length: this.assetsCount }, (_, i) =>
    Array.from({ length: this.assetsCount }, (_, j) => (i === j ? 1 : 0))
  );
}

  submit() {
    const payload = {
      expected_returns: this.expectedReturns,
      cov_matrix: this.covarianceMatrix,
      target_return: this.targetReturn,
      current_weights: this.currentWeights
    };

    this.operationService.submitOptimisation(payload).subscribe({
      next: (res) => {
        this.result = res;
        if (res.returns && res.risks) {
          this.chartData.labels = res.returns.map((r: number) => r.toFixed(3));
          this.chartData.datasets[0].data = res.risks.map((r: number) => r.toFixed(3));
        }
        console.log('Résultat optimisation reçu:', this.result);
      },
      error: (err) => console.error('Erreur HTTP:', err)
      
    });
  }

  getFrontiere() {
    const payload = {
      expected_returns: this.expectedReturns,
      cov_matrix: this.covarianceMatrix,
      target_return: this.targetReturn,
      current_weights: this.currentWeights
    };

    this.operationService.getEfficientFrontier(payload).subscribe({
      next: (res) => {
        this.chartData.labels = res.risks;
        this.chartData.datasets[0].data = res.returns;
      },
      error: (err) => console.error('Erreur HTTP (frontière):', err)
    });
    
  }

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Frontière efficiente',
      borderColor: 'blue',
      backgroundColor: 'rgba(168, 67, 226, 0.2)',
      pointRadius: 2,
      fill: false,
    }]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Risque (σ)' } },
      y: { title: { display: true, text: 'Rentabilité attendue' } }
    }
  };

  
  applyOptimization() {
  const payload = {
    optimal_weights: this.result.optimal_weights
  };

  

  this.operationService.applyOptimization(payload).subscribe({
    next: () => alert('Optimisation appliquée avec succès.'),
    error: (err) => console.error('Erreur application optimisation:', err)
  });
}

saveDraft() {
  if (!this.draftName) {
    alert("Veuillez entrer un nom pour le brouillon.");
    return;
  }

  const draftPayload = {
    expected_returns: this.expectedReturns,
    cov_matrix: this.covarianceMatrix,
    target_return: this.targetReturn,
    current_weights: this.currentWeights,
    optimal_weights: this.result?.optimal_weights || [],
    draft_name: this.draftName  // 👈 Nom du brouillon
  };

  this.operationService.saveDraft(draftPayload).subscribe({
    next: () => alert('Brouillon sauvegardé.'),
    error: (err) => console.error('Erreur sauvegarde brouillon:', err)
    
  });
}


}
