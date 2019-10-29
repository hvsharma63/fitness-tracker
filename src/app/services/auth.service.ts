import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isUserLoggedIn = new Subject<boolean>();
  private user: User;

  constructor(
    private router: Router
  ) { }

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.postSuccess();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.postSuccess();
  }

  logout() {
    this.user = null;
    this.isUserLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return { ...this.user };
  }

  isAuth() {
    return this.user !== null;
  }

  private postSuccess() {
    this.isUserLoggedIn.next(true);
    this.router.navigate(['/training']);
  }
}
