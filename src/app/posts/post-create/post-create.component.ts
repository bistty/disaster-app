import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AppUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

import { CategoriesService } from 'src/app/services/category.service';
import { DisastersService } from 'src/app/services/disaster.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  disasterForm: FormGroup;
  imgSrc: any = 'assets/placeholder-image.jpg';
  userSub: Subscription;
  uid: string;
  selectedImg: any;
  userName;
  categories: any;

  disaster: any;

  formStatus: string = 'Add New';

  docId: string;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private disasterService: DisastersService,
    private authservice: AuthService,
    private route: ActivatedRoute
  ) {
    this.authservice.user$
      .pipe(switchMap((user) => this.authservice.getUserData(user?.uid)))
      .subscribe((appUser: AppUser) => {
        this.userName = appUser?.userName;
      });
    this.route.queryParams.subscribe((val) => {
      this.docId = val.id;

      if (this.docId) {
        this.disasterService.loadOneData(val.id).subscribe((disaster) => {
          this.disaster = disaster;

          this.disasterForm = this.fb.group({
            title: [
              this.disaster.title,
              [Validators.required, Validators.minLength(10)],
            ],
            excerpt: [
              this.disaster.excerpt,
              [Validators.required, Validators.minLength(50)],
            ],
            category: [
              `${this.disaster.category.categoryId}-${this.disaster.category.category}`,
              Validators.required,
            ],
            disasterImg: ['', Validators.required],
            content: [this.disaster.content, Validators.required],
          });

          this.imgSrc = this.disaster.disasterImgPath;
          this.formStatus = 'Edit';
        });
      } else {
        this.disasterForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          disasterImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });

    this.userSub = this.authservice.user$.subscribe((user) => {
      this.uid = user.uid;
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
    });
  }

  get dc() {
    return this.disasterForm.controls;
  }

  onTitleChanged($event) {
    const title = $event.target.value;
  }

  showPreview($event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target.result;
    };

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    let splitted = this.disasterForm.value.category.split('-');
    console.log(splitted);

    const disasterData = {
      title: this.disasterForm.value.title,
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      disasterImgPath: '',
      excerpt: this.disasterForm.value.excerpt,
      content: this.disasterForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      uid: this.uid,
      userName: this.userName,
      createdAt: new Date(),
    };

    this.disasterService.uploadImage(
      this.selectedImg,
      disasterData,
      this.formStatus,
      this.docId
    );
    this.disasterForm.reset();
    this.imgSrc = './assets/placeholder-image.jpg';
    console.log(disasterData);
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
