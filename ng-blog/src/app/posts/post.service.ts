import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Post } from './post';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  postsCollection: AngularFirestoreCollection<Post>;
  postDoc: AngularFirestoreDocument<Post>;

  constructor(
    private afs: AngularFirestore,
  ) {
    this.postsCollection = this.afs.collection('posts');

  }

  getPosts(): Observable<Post[]> {
    return this.postsCollection.snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data: Post = a.payload.doc.data();
          const id: string = a.payload.doc.id;

          return { id, ...data }
        })),
        map(x => x.sort((a: Post, b: Post) => new Date(b.published.seconds * 1000).getTime() - new Date(a.published.seconds * 1000).getTime()))
      )
  }

  private _getPost(id: string): AngularFirestoreDocument<Post> {
    return this.postDoc = this.afs.doc<Post>(`posts/${id}`);
  }

  getPostData(id: string): Observable<Post> {
    this._getPost(id);
    return this.postDoc.valueChanges();
  }


  create(data: Post) {
    this.postsCollection.add(data);
  }

  delete(id: string) {
    return this._getPost(id).delete();
  }

  update(id: string, data: Post) {
    return this._getPost(id).update(data);
  }
}
