import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  user :any;

  constructor (){ }


  ngOnInit(): void {
    const token =localStorage.getItem('access_token');
    const User= localStorage.getItem('user');

    if (token! || !User){
      window.location.href='/login';

    }else{
      this.user= JSON.parse(User);
    }
  }
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  editProfile(): void {
    // À implémenter plus tard : rediriger vers une page /edit-profile par exemple
    alert("Fonction de modification à venir !");
  }

}
