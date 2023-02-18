import { AdminAuthGuard } from './services/admin.guard';
import { CategoriesComponent } from './admin/categories/categories.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';

import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './shared/login/login.component';
import { DisasterListComponent } from './admin/disaster-list/disaster-list.component';

import { SignupComponent } from './shared/signup/signup.component';
import { AuthGuard } from './services/auth.guard';
import { SearchComponent } from './search/search.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';

const routes: Routes = [
  { path: '', redirectTo: '/disasters', pathMatch: 'full' },
  { path: 'disasters', component: HomeComponent },
  {
    path: 'disaster/:id',
    component: PostDetailComponent,
  },

  {
    path: 'category/:category/:id',
    component: CategoryListComponent,
  },

  {
    path: 'disaster-list',
    component: DisasterListComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'disasters/create',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategoriesComponent },
      {
        path: 'disaster-list',
        component: DisasterListComponent,
      },
    ],
    canActivate: [AuthGuard, AdminAuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'register-user', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
