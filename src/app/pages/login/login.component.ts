import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { error } from 'console';
import { HttpClient, } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  public email:string=''
  public password:string=''
  public errorMessage:string=''
  
  constructor(private auth:AuthService, private router :Router){}



  ngOnInit(): void {
    
  }


  login(){
    //login

    this.auth.login(this.email, this.password).subscribe(data=>{
      if(data){
        this.router.navigate(  ['/home'] )

      }else{
        this.errorMessage = 'Erreur connexion '

      }
    })
  }
  signup() {
    this.router.navigate(['/signup']);
  }
  




}
