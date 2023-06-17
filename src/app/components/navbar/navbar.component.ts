import { Component } from '@angular/core';
import { User } from 'src/app/classes/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(private auth: AuthService) {
    auth.getCurrentUserAsObservable().subscribe(
      res => {
        this.currentUser = res;
        console.log(this.currentUser)
      }
    )
  }

  logout(){
    this.auth.logout();
  }
}
