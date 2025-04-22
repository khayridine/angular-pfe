import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      console.log("Formulaire invalide :", this.loginForm.value);
      return;
    }

    const { email, mot_de_passe } = this.loginForm.value;

    this.auth.login(email, mot_de_passe).subscribe({
      next: (result: any) => {
        if (result && result.access_token) {
          localStorage.setItem('access_token', result.access_token);

          this.auth.getProfile().subscribe({
            next: (user) => {
              localStorage.setItem('user', JSON.stringify(user));
              this.router.navigate(['/home']);
            },
            error: (err) => {
              console.error('Erreur récupération utilisateur', err);
              this.errorMessage = 'Erreur lors de la récupération du profil.';
            }
          });
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        }
      },
      error: (err) => {
        console.error('Erreur login', err);
        this.errorMessage = 'Identifiants invalides.';
      }
    });
  }

  signup() {
    this.router.navigate(['/signup']);
  }
}
