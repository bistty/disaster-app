import { AuthService } from 'src/app/services/auth.service';
import { not } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';

import { on } from 'cluster';
import { time } from 'console';
import { of } from 'rxjs';
import { DisastersService } from '../services/disaster.service';
import { switchMap } from 'rxjs/operators';
import { AppUser } from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  disasterArray: any;
  filterDisasters;
  id;
  constructor(private disasterService: DisastersService) {}

  ngOnInit(): void {
    this.disasterService.loadFeatured().subscribe((val) => {
      this.filterDisasters = this.disasterArray = val;
      console.log(val);
    });
    //this.disasterArray = this.disasterService.loadSearch;
  }
  ReadMore(id) {
    this.disasterService.loadOneData(id).subscribe((val) => {
      this.id = val;
    });
  }

  filter(query: string) {
    this.filterDisasters = query
      ? this.disasterArray.filter((disaster) => {
          return disaster.data.title
            .toLowerCase()
            .includes(query.toLowerCase());
        })
      : this.disasterArray;
  }
}
