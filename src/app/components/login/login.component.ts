import { Component, OnInit } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreError } from '@angular/fire/firestore';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMsg = '';
  redirectUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    const params = this.activatedRoute.snapshot.queryParams;
    if (params['redirectURL']) {
      this.redirectUrl = params['redirectURL'];
      console.log('redirection vers: %s', this.redirectUrl);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  submitForm() {
    //this.loading = true;
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    console.log('email : %s, mdp : %s', email, password);

    this.authService
      .login(email, password, this.redirectUrl)
      .subscribe((msg) => (this.errorMsg = msg));
  }
}
