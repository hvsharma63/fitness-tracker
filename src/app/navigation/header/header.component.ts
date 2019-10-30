import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() sideNavToggle = new EventEmitter<void>();
  loggedInStatus = false;
  loggedInStatusSubscription: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loggedInStatusSubscription = this.authService.isUserLoggedIn.subscribe(status => {
      this.loggedInStatus = status;
    });
  }

  onSideNavToggle() {
    this.sideNavToggle.emit();
  }

  onLogout() {
    this.onSideNavToggle();
    this.authService.logout();
  }


  ngOnDestroy() {
    this.loggedInStatusSubscription.unsubscribe();
  }
}
