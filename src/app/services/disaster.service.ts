import { Disaster, DisasterData } from './../models/disaster.model';
import { AuthService } from 'src/app/services/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisastersService {
  uid!: string;
  searchedArray;
  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    private toastr: ToastrService,
    private router: Router,
    private auth: AuthService
  ) {
    this.auth.user$.subscribe((user) => {
      this.uid = user?.uid;
    });
  }

  uploadImage(selectedImage, disasterData, formStatus, id) {
    const filePath = `disasterIMG/${Date.now()}`;
    console.log(filePath);

    this.storage.upload(filePath, selectedImage).then(() => {
      console.log('disaster image uploaded successfully');

      this.storage
        .ref(filePath)
        .getDownloadURL()
        .subscribe((URL) => {
          disasterData.disasterImgPath = URL;
          console.log(disasterData);

          if (formStatus == 'Edit') {
            this.updateData(id, disasterData);
          } else {
            this.saveData(disasterData);
          }
        });
    });
  }

  saveData(disasterData) {
    this.afs
      .collection('disasters')
      .add(disasterData)
      .then((docRef) => {
        this.toastr.success('Data Insert Successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadData() {
    return this.afs
      .collection('disasters')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadOneData(id) {
    return this.afs.doc(`disasters/${id}`).valueChanges();
  }

  updateData(id, disasterData) {
    this.afs
      .doc(`disasters/${id}`)
      .update(disasterData)
      .then(() => {
        this.toastr.success('Data Updated Successfully');
        this.router.navigate(['/disasters']);
      });
  }

  deleteImage(disasterImgPath, id) {
    this.storage.storage
      .refFromURL(disasterImgPath)
      .delete()
      .then(() => {
        this.deleteData(id);
      });
  }

  deleteData(id) {
    this.afs
      .doc(`disasters/${id}`)
      .delete()
      .then(() => {
        this.toastr.warning('Data Deleted ..!');
      });
  }

  markFeatured(id, featuredData) {
    this.afs
      .doc(`disasters/${id}`)
      .update(featuredData)
      .then(() => {
        this.toastr.info('Featured Status Updated');
      });
  }

  loadFeatured() {
    return this.afs
      .collection('disasters', (ref) => ref.where('isFeatured', '==', true))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadUserDisaster() {
    return this.afs
      .collection('disasters', (ref) => ref.where('uid', '==', this.uid))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }

  loadSearch(searched) {
    this.searchedArray = searched;
    console.log(searched);
  }

  loadCategoryDisasters(categoryId) {
    return this.afs
      .collection('disasters', (ref) =>
        ref.where('category.categoryId', '==', categoryId).limit(4)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, data };
          });
        })
      );
  }
}
