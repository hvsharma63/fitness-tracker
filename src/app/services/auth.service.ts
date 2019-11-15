import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { AuthData } from '../models/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isUserLoggedIn = new Subject<boolean>();
  private user: User;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) { }

  registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        this.postSuccess();
      }).catch(error => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log(result);
        this.postSuccess();
      }).catch(error => {
        console.log(error);
      });
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
    return this.user != null;
  }

  private postSuccess() {
    this.isUserLoggedIn.next(true);
    this.router.navigate(['/training']);
  }
}
