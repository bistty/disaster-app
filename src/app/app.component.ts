import { Component } from '@angular/core';
import { Post } from './posts/post-create/post-create.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  posts: Post[] = [];

  addPost(post: Post) {
    this.posts.push(post);
  }
}
