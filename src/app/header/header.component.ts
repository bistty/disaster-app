import { UserService } from './../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { switchMap } from 'rxjs/operators';
import { AppUser } from '../models/user.model';
import { DisastersService } from '../services/disaster.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAdmin: boolean;
  disasterArray;
  filterDisasters;
  subscription: Subscription;
  showList = false;
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public disasterService: DisastersService,
    public afAuth: AngularFireAuth
  ) {
    this.subscription = this.authService.user$
      .pipe(switchMap((user) => this.authService.getUserData(user?.uid)))
      .subscribe((appUser: AppUser) => {
        this.isAdmin = appUser?.isAdmin;
      });

    this.subscription = this.disasterService.loadFeatured().subscribe((val) => {
      this.filterDisasters = this.disasterArray = val;
      console.log(val);
    });
  }

  ngOnInit(): void {
    this.disasterService.loadSearch(this.filterDisasters);
  }

  filter(query: string) {
    if (query) {
      this.showList = true;
    } else {
      this.showList = false;
    }
    this.filterDisasters = query
      ? this.disasterArray.filter((disaster) => {
          return disaster.data.title
            .toLowerCase()
            .includes(query.toLowerCase());
        })
      : this.disasterArray;
  }

  logout() {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
