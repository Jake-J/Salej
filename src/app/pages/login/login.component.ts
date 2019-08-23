import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginTemplate = {
    login: null,
    password: null,
  }

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  onLogin() {
    this.api.postData('login', this.loginTemplate).subscribe(resp => console.log(resp));
  }

}
