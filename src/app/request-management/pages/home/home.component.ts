import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../../../core/services/identity.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isAdmin: boolean;

  constructor(
    identityService: IdentityService
  ) {
    this.isAdmin = identityService.isAdmin();
  }

  ngOnInit() {
  }

}
