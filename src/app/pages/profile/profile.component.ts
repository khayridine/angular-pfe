import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{


  ngOnInit(): void {
    localStorage.setItem('test', 'test data');
    console.log('test get from', localStorage.getItem('test'));
  }

}
