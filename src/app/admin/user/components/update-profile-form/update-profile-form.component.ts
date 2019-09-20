import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-update-profile-form',
  templateUrl: './update-profile-form.component.html',
  styleUrls: ['./update-profile-form.component.css']
})
export class UpdateProfileFormComponent implements OnInit {
  @Input() isAdmin;
  @Input() user;
  @Input() role;
  constructor() { }

  ngOnInit() {
  }

}
