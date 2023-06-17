import { Component, ElementRef, ViewChild, Input } from '@angular/core';
import { Data } from '@angular/router';
import DatabaseService from 'src/app/services/database.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css']
})
export class CommentFormComponent {

  @Input() productID: string = 'undefined';
  @Input() userID: string = 'undefined';
  @Input() username: string = 'undefined';
  title: string = '';
  text: string = '';
  grade: number = 0;

  isLoading = false;

  isGradeValid = false;

  commentForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    text: new FormControl(''),
    grade: new FormControl('', [Validators.required])
  })

  @ViewChild("successDialog") successDialog!: ElementRef;
  @ViewChild("errorDialog") errorDialog !: ElementRef;

  constructor(private dbService: DatabaseService, private storageService: StorageService, private auth: AuthService){}

  async submit() {
    if (this.isFormValid()){
      this.isLoading=true;

      const title = this.commentForm.get("title")?.value;
      const text = this.commentForm.get("text")?.value;
      const grade = Number(this.commentForm.get("grade")?.value);

      this.dbService.addComment(this.productID!, this.userID!, this.username!, title!, text!, grade!).then(() => {
        this.successDialog.nativeElement.showModal();
        this.isLoading = false;
      }).catch((error) => {
        console.log(error);
        this.errorDialog.nativeElement.showModal();
        this.isLoading = false;
      });

    }
  }

  onGradeChanged(){
    const value = this.commentForm.get('grade')?.value;

    if (Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 5) {
      this.isGradeValid = true;
    } else {
      this.isGradeValid = false;
    }
  }

  isInputValid(inputName : string): boolean {
    const input = this.commentForm.get(inputName)!;
    if (input.touched && input.errors) {
      return false;
    } else {
      return true;
    }
  }

  isFormValid(): boolean {
    return this.commentForm.valid && this.isGradeValid
  }

  isTouched(inputName: string): boolean {
    const input = this.commentForm.get(inputName)!;
    return input.touched;
  }

}
