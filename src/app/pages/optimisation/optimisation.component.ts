import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Actif, Portefeuille } from '@app/model/portefeuille';
import { OptimisationResponse } from '@app/model/optimisation';
import { OperationService } from '@app/services/operation.service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-portefeuille-optimisation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './optimisation.component.html',
  styleUrl: './optimisation.component.scss'
})
export class PortefeuilleOptimisationComponent implements OnInit {

  portefeuilles: Portefeuille[] = [];
  actifs: Actif[] = [];
  selectedPortefeuilleId: number | null = null;
  matriceForm: FormGroup;
  loadingActifs = false;
  loadingOptimisation = false;
  erreurMessage = '';
  optimisationResult: OptimisationResponse | null = null;
  chartInstance: Chart | null = null;

  tooltipCovariance = `Comment remplir la matrice ? ...`;

  constructor(
    private operationService: OperationService,
    private fb: FormBuilder
  ) {
    this.matriceForm = this.fb.group({
      covarianceMatrix: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.operationService.getPortefeuilles().subscribe(data => {
      this.portefeuilles = data;
    });
  }

  onPortefeuilleChange() {
    if (this.selectedPortefeuilleId !== null) {
      this.loadingActifs = true;
      this.optimisationResult = null;
      this.erreurMessage = '';
      this.operationService.getActifs(this.selectedPortefeuilleId).subscribe(actifs => {
        this.actifs = actifs;
        this.initMatriceCovariance();
        this.loadingActifs = false;
      }, err => {
        this.loadingActifs = false;
        this.erreurMessage = 'Erreur lors du chargement des actifs.';
      });
    } else {
      this.actifs = [];
      this.resetMatriceForm();
    }
  }

  initMatriceCovariance() {
    this.resetMatriceForm();
    const n = this.actifs.length;
    const matriceFA = this.matriceForm.get('covarianceMatrix') as FormArray;
    for (let i = 0; i < n; i++) {
      const rowFA = this.fb.array([]);
      for (let j = 0; j < n; j++) {
        const value = (i === j) ? 1 : 0;
        rowFA.push(this.fb.control({ value, disabled: i === j }, [
          Validators.required,
          Validators.min(-1),
          Validators.max(1)
        ]));
      }
      matriceFA.push(rowFA);
    }
  }

  resetMatriceForm() {
    const matriceFA = this.matriceForm.get('covarianceMatrix') as FormArray;
    while (matriceFA.length !== 0) {
      matriceFA.removeAt(0);
    }
  }

  getRowControls(rowIndex: number) {
    const matriceFA = this.matriceForm.get('covarianceMatrix') as FormArray;
    return (matriceFA.at(rowIndex) as FormArray).controls;
  }

  onCovarianceChange(i: number, j: number) {
    const matriceFA = this.matriceForm.get('covarianceMatrix') as FormArray;
    if (i !== j) {
      const val = matriceFA.at(i).get(j.toString())?.value;
      const symControl = matriceFA.at(j).get(i.toString());
      if (symControl && symControl.value !== val) {
        symControl.setValue(val, { emitEvent: false });
      }
    }
  }

  getMatriceValeurs(): number[][] {
    const matriceFA = this.matriceForm.get('covarianceMatrix') as FormArray;
    return matriceFA.controls.map(rowFA => {
      return (rowFA as FormArray).controls.map(ctrl => Number(ctrl.value));
    });
  }

  lancerOptimisation() {
    if (!this.selectedPortefeuilleId) return;
    this.erreurMessage = '';
    this.optimisationResult = null;

    const matrice = this.getMatriceValeurs();
    if (!this.validerMatrice(matrice)) return;

    this.loadingOptimisation = true;
    this.operationService.optimiserPortefeuille(this.selectedPortefeuilleId, matrice).subscribe(
      result => {
        this.optimisationResult = result;
        this.loadingOptimisation = false;
        this.afficherGraphique(); // déplacer ici après réception du résultat
      },
      err => {
        this.erreurMessage = err.error?.detail || 'Erreur lors de l’optimisation.';
        this.loadingOptimisation = false;
      }
    );
  }

  validerMatrice(matrice: number[][]): boolean {
    const n = matrice.length;
    for (let i = 0; i < n; i++) {
      if (matrice[i].length !== n) {
        this.erreurMessage = "La matrice doit être carrée";
        return false;
      }
      for (let j = 0; j < n; j++) {
        const val = matrice[i][j];
        if (val < -1 || val > 1) {
          this.erreurMessage = `Valeur hors limites (-1 à 1) en position [${i + 1},${j + 1}]`;
          return false;
        }
        if (i === j && val !== 1) {
          this.erreurMessage = `La diagonale doit être égale à 1 en position [${i + 1},${j + 1}]`;
          return false;
        }
        if (i > j && val !== matrice[j][i]) {
          this.erreurMessage = `La matrice doit être symétrique : [${i + 1},${j + 1}] ≠ [${j + 1},${i + 1}]`;
          return false;
        }
      }
    }
    return true;
  }

  afficherGraphique(): void {
    const ctx = document.getElementById('frontiereChart') as HTMLCanvasElement;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const dataPoints = this.optimisationResult?.frontiere_efficiente?.map((point: any) => ({
      x: point.risque * 100,
      y: point.rendement * 100
    })) || [];

    this.chartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Frontière efficiente',
            data: dataPoints,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            pointBackgroundColor: '#2563eb',
            pointRadius: 5,
            showLine: true,
            tension: 0.3,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#1f2937',
              font: {
                size: 14
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const raw = context.raw as { x: number, y: number };
                const x = raw.x.toFixed(2);
                const y = raw.y.toFixed(2);
                return ` Risque: ${x}%, Rendement: ${y}%`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Risque (%)',
              color: '#111827'
            },
            ticks: {
              color: '#374151'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Rendement (%)',
              color: '#111827'
            },
            ticks: {
              color: '#374151'
            }
          }
        }
      }
    });
  }

  getCovarianceRow(i: number): FormGroup {
    return this.matriceForm.get('covarianceMatrix')?.get(i.toString()) as FormGroup;
  }

  getRowControl(i: number, j: number): FormControl {
    return this.matriceForm.get('covarianceMatrix')?.get(i.toString())?.get(j.toString()) as FormControl;
  }
}
