import { AppUser } from './../models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  admin: boolean;
  constructor(public auth: AuthService) {}

  ngOnInit() {}

  // get isAdmin() {
  //   return this.auth.user$.pipe(
  //     switchMap((user) => this.auth.getUserData(user.uid)),
  //     map((appUser: AppUser) => appUser.isAdmin)
  //   );
  // }
}
