import { Component, OnInit } from '@angular/core';
import { Router,  } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,  // Assure-toi que FormsModule est bien importé
    ],
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  errorMessage: string | null = null;
  signUpForm: FormGroup = new FormGroup({
    nom:  new FormControl(['', Validators.required]),
    prenom:new FormControl(['',Validators.required]) ,
    email: new FormControl(['', [Validators.required,Validators.email]]),
    num_tel: new FormControl(['']),
    motDePasse: new FormControl(['', [Validators.required, Validators.minLength(6), Validators.maxLength(24)]])
  })

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) { }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

 


  signup(): void {
     
    // Validation basique
    if (this.signUpForm.invalid) {
      console.log(" Invalid Form")
      return;
    
    }
const signupParams={
  nom :this.signUpForm.get('nom')?.value,
  prenom :this.signUpForm.get('prenom')?.value,
  email :this.signUpForm.get('email')?.value,
  num_tel:this.signUpForm.get('num_tel')?.value,
  mot_de_passe :this.signUpForm.get('mot_de_passe')?.value,
 
}
    this.authService.signup(this.signUpForm.value).subscribe(
      (response) => {

        this.router.navigate(['/login']);
      },
      (error) => {

        this.errorMessage = error.error.detail || 'Une erreur s\'est produite.';
      }
    );
  }
}
