import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../services/operation.service';

import { Portefeuille } from '../../model/portefeuille'; //
import { CryptoService } from '../../services/crypto.service'; // Import du service
import { Router } from '@angular/router';
import { HeaderComponent } from '@app/components/header/header.component';

@Component({
  selector: 'app-portfeuille',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './portfeuille.component.html',
  styleUrls: ['./portfeuille.component.scss']
})
export class PortfeuilleComponent implements OnInit {

  portefeuilles: Portefeuille[] = [];


  constructor(private operationService: OperationService, private cryptoService: CryptoService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {


  }



  ngOnInit(): void {
    this.operationService.getPortefeuilles().subscribe((data) => {
      this.portefeuilles = data;
    });
  }

  getPortefeuilles() {
    this.operationService.getPortefeuilles().subscribe((data) => {
      this.portefeuilles = data; // ✅ correct
    });
  }

  modifier(portefeuille: Portefeuille) {
    this.router.navigate(['/modifier-portefeuille', portefeuille.id]);
  }

  supprimer(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce portefeuille ?')) {

      console.log('Suppression demandée pour id', id);
    }
  }

  goToFormulaire(): void {
    this.router.navigate(['/formulaire']);
  }
}

