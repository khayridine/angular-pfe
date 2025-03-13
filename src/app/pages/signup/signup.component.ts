import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserData } from '@app/entity/user-data';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errorMessage: string | null = null;
  signUpForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      nom: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(24)])
    });
  }

  signup(): void {
    if (this.signUpForm.invalid) {
      console.log("Formulaire invalide");
      return;
    }

    const signupParams: UserData ={
      nom:this.signUpForm.get('nom')?.value,
      prenom:this.signUpForm.get('prenom')?.value,
      email:this.signUpForm.get('email')?.value,
      mot_de_passe:this.signUpForm.get('password')?.value,
      num_tel:this.signUpForm.get('phone')?.value,

    }
    
    //this.signUpForm.value;
    console.log("signup param ", signupParams);

    this.authService.signup(signupParams).subscribe(
      (response) => {
        if (response)
          this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error.error.detail || "Une erreur s'est produite.";
      }
    );
  }
}
