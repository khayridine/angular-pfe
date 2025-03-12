import { CommonModule } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  public errorMessage: string = ''
  loginForm!: FormGroup;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }




  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }



  login() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement.';
      return;
    }

    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe((result: any) => {
      if (result) {
        this.router.navigate(['/home'])

      } else {
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    })
  }
  signup() {
    this.router.navigate(['/signup']);
  }





}
