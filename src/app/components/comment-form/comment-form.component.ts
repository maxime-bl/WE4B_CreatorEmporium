import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { Data, Router } from '@angular/router';
import DatabaseService from 'src/app/services/database.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent {
  @Input() productID: string = 'undefined';
  user: User | null = null;
  canComment = false;

  isLoading = false;

  commentForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    text: new FormControl(''),
    grade: new FormControl('', [Validators.required]),
  });

  constructor(
    private dbService: DatabaseService,
    private auth: AuthService,
    private router: Router
  ) {
    this.user = auth.getCurrentUser()
    this.checkCommentAutorisation();

    auth.getCurrentUserAsObservable().subscribe(
      (res) => {
        this.user = res;
        this.checkCommentAutorisation();
      }
    )
  }

  async checkCommentAutorisation(){
    if (this.user !== null && !this.user.isSeller){
      const alreadyCommented = await this.dbService.checkForExistingComment(this.user.uid, this.productID);
      console.log(alreadyCommented);
      this.canComment = !alreadyCommented;
    } else {
      this.canComment = false;
    }
  }

  async submit() {  
    if (this.isFormValid() && this.canComment) {
      this.isLoading = true;

      const title = this.commentForm.get('title')?.value;
      const text = this.commentForm.get('text')?.value;
      const grade = Number(this.commentForm.get('grade')?.value);

      this.dbService
        .addComment(
          this.productID,
          this.user!.uid,
          this.user!.displayName,
          title!,
          text!,
          grade!
        )
        .then(() => {
          this.isLoading = false;
          location.reload()
        })
        .catch((error) => {
          console.log(error);
          this.isLoading = false;
        });
    }
  }

  isInputValid(inputName: string): boolean {
    const input = this.commentForm.get(inputName)!;
    if (input.touched && input.errors) {
      return false;
    } else {
      return true;
    }
  }

  isFormValid(): boolean {
    return this.commentForm.valid;
  }
}
