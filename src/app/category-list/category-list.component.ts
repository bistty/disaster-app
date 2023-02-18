import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisastersService } from '../services/disaster.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
})
export class CategoryListComponent implements OnInit {
  categoryObj;
  disastersArray;
  constructor(
    private route: ActivatedRoute,
    private disasterService: DisastersService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      console.log(val);
      this.categoryObj = val;

      this.disasterService.loadCategoryDisasters(val.id).subscribe((post) => {
        this.disastersArray = post;
        console.log(post);
      });
    });
  }
}
