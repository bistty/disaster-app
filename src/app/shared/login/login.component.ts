import { Component, OnInit } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  // login() {
  //   this.afAuth.signInWithRedirect(new auth.GoogleAuthProvider());
  // }

  onSubmit(formValue) {
    this.authService.login(formValue.email, formValue.password);
  }
}
