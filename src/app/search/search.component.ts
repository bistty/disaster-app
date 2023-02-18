import { Component, OnInit } from '@angular/core';
import { DisastersService } from '../services/disaster.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  disasterArray: any;
  id;
  constructor(private disasterService: DisastersService) {}

  ngOnInit(): void {
    this.disasterArray = this.disasterService.searchedArray;
  }

  ReadMore(id) {
    this.disasterService.loadOneData(id).subscribe((val) => {
      this.id = val;
    });
  }
}
