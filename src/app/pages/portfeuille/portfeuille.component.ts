import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationService } from '../../services/operation.service';

@Component({
  selector: 'app-portfeuille',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfeuille.component.html',
  styleUrls: ['./portfeuille.component.scss']
})
export class PortfeuilleComponent implements OnInit {
  operations: any[] = [];

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.operationService.getOperations().subscribe((data) => {
      this.operations = data;
    });
  }
}
