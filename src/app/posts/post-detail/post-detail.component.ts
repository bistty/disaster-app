import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisastersService } from 'src/app/services/disaster.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  disasterData: any;
  constructor(
    private route: ActivatedRoute,
    private disasterService: DisastersService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      this.disasterService.loadOneData(val.id).subscribe((disaster) => {
        this.disasterData = disaster;
      });
    });
  }
}
