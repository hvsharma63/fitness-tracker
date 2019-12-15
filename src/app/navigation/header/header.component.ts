import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() sideNavToggle = new EventEmitter<void>();
  loggedInStatus$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private store: Store<fromRoot.State>,
  ) { }

  ngOnInit() {
    this.loggedInStatus$ = this.store.select(fromRoot.getIsAuth);
  }

  onSideNavToggle() {
    this.sideNavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

}
