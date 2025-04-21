import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '@app/components/header/header.component';
import { CoinsComponent } from './components/coins/coins.component';
@Component({
  selector: 'app-home',
  imports: [CommonModule, HeaderComponent, CoinsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  message: string = '';

  constructor(private router: Router,) {
   
  }


 

}


