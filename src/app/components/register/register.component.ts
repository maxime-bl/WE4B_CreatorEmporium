import { Component } from '@angular/core';
import { connectStorageEmulator } from '@angular/fire/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  errorMsg = '';
  registerForm: FormGroup;
  loading = false;
  userType = 1;
  redirectUrl = '';

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: [''],
    });

    const params = this.activatedRoute.snapshot.queryParams;
    if (params['redirectURL']) {
      this.redirectUrl = params['redirectURL'];
    }
  }

  async submitForm() {
    this.loading = true;

    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const displayName = this.registerForm.get('displayName')?.value;

    if (this.userType == 1) {
      this.authService
        .createUser(email, password, this.redirectUrl)
        .then((msg) => {
          this.errorMsg = msg;
          this.loading = false;
        });
    } else if (this.userType == 2) {
      this.authService
        .createSeller(email, password, displayName, this.redirectUrl)
        .then((msg) => {
          if (msg.toLowerCase().includes('display')){
            this.errorMsg = "Erreur: ce nom d'affichage est déjà utilisée"
          } else if (msg.toLowerCase().includes('fire')){
            this.errorMsg = 'Erreur: cet adresse email est déja utilisée'
          } else {
            this.errorMsg = 'Création du compte impossible.'
          }
          
          this.loading = false;
        });
    }
  }

  setUserType(val: number) {
    this.userType = val;
  }

  isInputValid(inputName : string): boolean {
    const input = this.registerForm.controls[inputName];
    if (input.touched && input.errors) {
      return false;
    } else {
      return true;
    }
  }
}
