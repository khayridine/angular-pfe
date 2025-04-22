import { Component, ElementRef, OnInit, ViewChild,  } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  avatar: File | null = null;

  @ViewChild('avatarInput', { static: false }) avatarInput!: ElementRef<HTMLInputElement>;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      window.location.href = '/login';
    } else {
      this.user = JSON.parse(user);
      
    }
  
  }
  

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.avatar = input.files[0];
    }
  }

  getAvatarPreview(): string {
    return this.avatar ? URL.createObjectURL(this.avatar) : 'https://bootdey.com/img/Content/avatar/avatar1.png';
  }

  saveProfile(): void {
    const formData = new FormData();
    if (this.avatar) {
      formData.append('avatar', this.avatar);
    }
    formData.append('nom', this.user.nom);
    formData.append('prenom', this.user.prenom);
    formData.append('email', this.user.email);
    formData.append('num_tel', this.user.num_tel);

    this.authService.updateProfile(formData).subscribe(response => {
      console.log('Profil mis à jour', response);
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  editProfile(): void {
    alert("Fonction de modification à venir !");
  }
    // Fonction pour retourner à la page précédente avec un effet de flash
    goBackWithFlash(): void {
      const backIcon = document.querySelector('.back-icon');
      if (backIcon) {
        backIcon.classList.add('flash');
        setTimeout(() => {
          window.history.back(); // Retour à la page précédente
        }, 300); // Attendre la durée de l'animation
      }}

  goBack(): void {
    window.history.back();
  }
}
