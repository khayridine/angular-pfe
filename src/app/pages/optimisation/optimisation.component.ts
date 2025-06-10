import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Actif, Portefeuille } from '@app/model/portefeuille';
import { OptimisationResponse } from '@app/model/optimisation';
import { OperationService } from '@app/services/operation.service';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { HeaderComponent } from '@app/components/header/header.component';
import { finalize } from 'rxjs';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-portefeuille-optimisation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './optimisation.component.html',
  styleUrl: './optimisation.component.scss'
})
export class PortefeuilleOptimisationComponent implements OnInit { 
  chartInstance: Chart | null = null;

  portefeuilles: Portefeuille[] = [];
  actifs: Actif[] = [];
  selectedPortefeuilleId: number | null = null;
  matriceForm: FormGroup;
  loadingActifs = false;
  loadingOptimisation = false;
  erreurMessage = '';
  optimisationResult: OptimisationResponse | null = null;


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
        if (i != j) {
          const typeCateg = this.comparerCategories(this.actifs[i].categorie, this.actifs[j].categorie);
          if (typeCateg === 'same') {
            rowFA.push(this.fb.control({ value: 0.7, disabled: false }, [
              Validators.required,
              Validators.min(0.7),
              Validators.max(0.999)
            ]));// Valeur fixe pour les mêmes catégories
          }
          else if (typeCateg === 'different') {
            rowFA.push(this.fb.control({ value: 0, disabled: false }, [
              Validators.required,
              Validators.min(-0.299),
              Validators.max(0.699)
            ]));
          } else {
            rowFA.push(this.fb.control({ value: -0.3, disabled: false }, [
              Validators.required,
              Validators.min(-0.3),
              Validators.max(-1)
            ]));

          }
        }
        else {
          rowFA.push(this.fb.control({ value: 1, disabled: true }));
        }
      }
      matriceFA.push(rowFA);
    }
  }


  comparerCategories(categorie1: string, categorie2: string): string {
    if (categorie1 === categorie2) {
      return 'same';
    } else if ((categorie1 === 'Crypto' && categorie2 === 'Obligation') || (categorie1 === 'Obligation' && categorie2 === 'Crypto')) {
      return 'different';
    } else {
      return 'opposite';
    }

  }

  resetMatriceForm() {
    const matriceFA = this.matriceForm.get('covarianceMatrix') as FormArray;
    while (matriceFA.length !== 0) {
      matriceFA.removeAt(0);
    }
  }

  getRowControls(i: number): FormControl[] {
    const row = this.matriceForm.get('covarianceMatrix') as FormArray;
    const rowControls = row.at(i) as FormArray;
    return rowControls.controls as FormControl[];
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
    this.operationService.optimiserPortefeuille(this.selectedPortefeuilleId, matrice)
    .subscribe(
      result => {
        this.optimisationResult = result;
        this.loadingOptimisation = false;
        setTimeout(()=> {
          this.afficherGraphique()
        }, 500); // Utiliser setTimeout pour s'assurer que le graphique est affiché après la mise à jour du DOM
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
        const typeCteg = this.comparerCategories(this.actifs[i].categorie, this.actifs[j].categorie);
        if (i!==j){
        switch (typeCteg) {
          case 'same':
            if ( val < 0.7 || val > 0.999) {
              this.erreurMessage = `La valeur pour les actifs très similaires doit être entre 0.7 et 0.999 en ligne ${i + 1}, colonne ${j + 1}`;
              return false;
            }
            
            break;
          case 'different':
            if (val < -0.299 || val > 0.699) {
              this.erreurMessage = `La valeur pour les actifs différents doit être entre -0.299 et 0.699 en ligne ${i + 1}, colonne ${j + 1}`;
              return false;
            }

            break;

          default:
            if (val < -1 || val > -0.3) {
              this.erreurMessage = `La valeur pour les actifs opposés doit être entre -1 et -0.3 en ligne ${i + 1}, colonne ${j + 1}`;
              return false;
            }
            break;
        }
        
      }
    }
    }
    return true;
  }

  afficherGraphique(): void {
   if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    let  canvas = document.getElementById('frontiereChartCanvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error("Canvas non disponible");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Impossible d'obtenir le contexte 2D du canvas.");
      return;
    }
  

 

   const dataPoints = this.optimisationResult?.frontiere?.map((point: any) => ({
      x: point.risque * 100,
      y: point.rendement * 100
    })) || [];
  console.log('Data points for chart:', dataPoints);
  
    if (dataPoints.length === 0) {
    this.chartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Frontière efficiente',
          data: dataPoints,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `Risque: ${context.parsed.x.toFixed(2)}%, Rendement: ${context.parsed.y.toFixed(2)}%`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Risque (%)'
            },
            beginAtZero: true
          },
          y: {
            title: {
              display: true,
              text: 'Rendement (%)'
            },
            beginAtZero: true
          }
        }
      }
    });
    }
  }



  getCovarianceRow(i: number): FormGroup {
    return this.matriceForm.get('covarianceMatrix')?.get(i.toString()) as FormGroup;
  }

  getRowControl(i: number, j: number): FormControl {
    return this.matriceForm.get('covarianceMatrix')?.get(i.toString())?.get(j.toString()) as FormControl;
  }
}
