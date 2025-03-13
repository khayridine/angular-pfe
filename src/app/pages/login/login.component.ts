import { CommonModule } from '@angular/common';
import { Component, OnInit, } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
      email: ['', Validators.required, Validators.email],// Ensures valid email format    
      password: ['', Validators.required, Validators.minLength(6)]// Minimum 6 characters for password  
    })    
  };
 



login() {
  console.log("this.form ", this.loginForm.value);

  if (this.loginForm.invalid) {
    console.log("this.form ", this.loginForm.value);

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
