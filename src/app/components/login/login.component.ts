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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    const params = this.activatedRoute.snapshot.queryParams;
    if (params['redirectURL']) {
      this.redirectUrl = params['redirectURL'];
    }
  }

  async submitForm() {
    this.loading = true;

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.loginAsync(email, password, '').then(() => {
      this.errorMsg = "Incorrect email address or password."
      this.loading = false;
    });
  }
}
