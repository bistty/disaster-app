import { AppUser } from './../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User, UserCredential } from 'firebase/auth';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;
  user$: Observable<User>;
  constructor(
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private afs: AngularFirestore
  ) {
    this.user$ = afAuth.authState;
  }

  login(email, password) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((logRef) => {
        this.toastr.success('Logged In Successfully');
        this.loadUser();

        this.loggedIn.next(true);
        this.isLoggedInGuard = true;

        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.toastr.warning(e);
      });
  }

  signup(userName, email, password) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((logRef) => {
        this.toastr.success('Signed Up Successfully');
        this.loadUser();
        this.SetUserData(logRef.user, userName);
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        console.log(logRef);

        this.router.navigate(['/']);
      })
      .catch((e) => {
        this.toastr.warning(e);
      });
  }

  SetUserData(user: any, userName) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData = {
      uid: user.uid,
      email: user.email,
      isAdmin: false,
      userName: userName,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  getUserData(uid: string) {
    return this.afs.doc(`users/${uid}`).valueChanges();
  }

  loadUser() {
    this.afAuth.authState.subscribe((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      console.log(user);
    });
  }

  logOut() {
    this.afAuth.signOut().then(() => {
      this.toastr.success('User Logged Out Successfully');
      localStorage.removeItem('user');

      this.loggedIn.next(false);
      this.isLoggedInGuard = false;

      this.router.navigate(['/login']);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get isAdmin() {
    return;
    // return this.user$.pipe(switchMap((user) => this.getUserData(user.uid)));
  }
}
