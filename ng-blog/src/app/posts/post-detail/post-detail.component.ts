import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../post.service';
import { Post } from './../post';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss']
})
export class PostDetailComponent implements OnInit {
  post: Post;
  id: string;
  editing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    public auth: AuthService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getPost();
  }

  getPost() {
    return this.postService.getPostData(this.id)
      .subscribe((data: Post) => this.post = data)
  }

  delete() {
    this.postService.delete(this.id);
    this.router.navigate(['/blog'])
  }

  updatePost() {
    const formData: Post = {
      title: this.post.title,
      content: this.post.content,
    }
    this.postService.update(this.id, formData);
    this.editing = false;
  }
}
