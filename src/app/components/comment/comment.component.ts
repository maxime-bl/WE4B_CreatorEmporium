import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/classes/comment';
import DatabaseService from 'src/app/services/database.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})

export class CommentComponent {
  @Input() comment: Comment = new Comment();
  
  constructor(){
  }
}
