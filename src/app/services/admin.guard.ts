import { AppUser } from '../models/user.model';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user$.pipe(
      switchMap((user) => this.authService.getUserData(user.uid)),
      map((appUser: AppUser) => appUser.isAdmin)
    );

    // if (this.authService.isAdmin) {
    //   console.log('Admin Access Granted ..');
    //   return true;
    // } else {
    //   this.toastr.warning(
    //     'You dont have admin permission to access this page ..'
    //   );
    //   this.router.navigate(['/disasters']);
    //   return false;
    // }
  }
}
