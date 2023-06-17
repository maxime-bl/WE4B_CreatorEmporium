import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from 'src/app/classes/comment';
import DatabaseService from 'src/app/services/database.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent {
  productId: string;
  isLoading: boolean = true;
  comments: Comment[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dbService: DatabaseService
  ) {
    this.productId =
      this.activatedRoute.snapshot.paramMap.get('id') || 'undefined';
      this.dbService.getCommentsForProduct(this.productId).subscribe((comments) => {
        this.comments = comments;
        this.isLoading = false;
      })
  }
}
