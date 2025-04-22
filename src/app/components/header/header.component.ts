import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports:[MatToolbarModule,  // 🔹 Ajout des modules Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  goToProfile() {
    this.router.navigate(['/profile']); // Redirige vers la page profil
  }

  logout() {
    console.log('Déconnexion...');
    // Ajoute ici la logique pour la déconnexion
    localStorage.clear(); // Supprime le token du localStorage
    this.router.navigate(['/login']);
  }
  goToHome() {
    this.router.navigate(['/home']);
  }
  goToportfeuille(){
    this.router.navigate(['/portfeuille']);
  }
}
