import { UserService } from './../../services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { DisastersService } from 'src/app/services/disaster.service';
import * as auth from 'firebase/auth';
import { switchMap } from 'rxjs/operators';
import { AppUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-disaster-list',
  templateUrl: './disaster-list.component.html',
  styleUrls: ['./disaster-list.component.scss'],
})
export class DisasterListComponent implements OnInit {
  disasterArray: any;
  userDisasterArray;
  userData$: Observable<auth.User>;
  isAdmin;
  uid: string;

  constructor(
    private disasterService: DisastersService,
    public authService: AuthService,
    public userService: UserService
  ) {
    this.authService.user$
      .pipe(switchMap((user) => this.authService.getUserData(user?.uid)))
      .subscribe((appUser: AppUser) => {
        this.isAdmin = appUser?.isAdmin;
      });

    this.authService.user$.subscribe((user) => {
      this.uid = user.uid;
    });
  }

  ngOnInit(): void {
    this.disasterService.loadData().subscribe((val) => {
      this.disasterArray = val;
      this.userDisasterArray = this.disasterArray.filter((disaster) => {
        return disaster.data.uid == this.uid;
      });
      console.log(this.userDisasterArray);
    });
  }

  onDelete(disasterImgPath, id) {
    this.disasterService.deleteImage(disasterImgPath, id);
  }

  onFeatured(id, value) {
    const featuredData = {
      isFeatured: value,
    };

    this.disasterService.markFeatured(id, featuredData);
  }
}
