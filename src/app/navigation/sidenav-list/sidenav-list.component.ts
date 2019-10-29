import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {

  @Output() sideNavClose = new EventEmitter<void>();
  loggedInStatus = false;
  loggedInStatusSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loggedInStatusSubscription = this.authService.isUserLoggedIn.subscribe(status => {
      this.loggedInStatus = status;
    });
  }

  onSideNavClose() {
    this.sideNavClose.emit();
  }

  onLogout() {
    this.onSideNavClose();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.loggedInStatusSubscription.unsubscribe();
  }
}
