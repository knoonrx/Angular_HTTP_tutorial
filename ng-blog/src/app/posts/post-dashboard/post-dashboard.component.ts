import { Component, OnInit } from '@angular/core';
import { Post } from './../post';
import { AuthService } from 'src/app/core/auth.service';
import { PostService } from './../post.service';
import { Observable } from 'rxjs';
import { AngularFireStorageModule, AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.scss']
})
export class PostDashboardComponent implements OnInit {

  title: string;
  image: string = null;
  content: string;
  buttonText: string = 'Salvar';
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private storage: AngularFireStorage,
  ) { }

  ngOnInit() {
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    const path = `posts/${file.name}`;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, file);

    if (!file.type.includes('image')) {
      return alert('Por favor envie somente imagens');
    }

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges()
      .pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL())
      )
      .subscribe()
      .add(x => {
        this.downloadURL.subscribe(i => this.image = i);
      });
  }

  createPost() {
    const data: Post = {
      author: this.auth.authState.displayName || this.auth.authState.email,
      authorId: this.auth.currentUserID,
      content: this.content,
      image: this.image,
      published: new Date(),
      title: this.title,
    }

    this.postService.create(data);
    this.content = '';
    this.title = '';

    this.buttonText = 'Post created!';

    setTimeout(() => this.buttonText = 'Salvar', 3000);
  }
}
