import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output() sideNavClose = new EventEmitter<void>();
  loggedInStatus$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
  ) { }

  ngOnInit() {
    this.loggedInStatus$ = this.store.select(fromRoot.getIsAuth);
  }

  onSideNavClose() {
    this.sideNavClose.emit();
  }

  onLogout() {
    this.onSideNavClose();
    this.authService.logout();
  }

}
