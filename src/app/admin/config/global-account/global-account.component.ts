import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-global-account',
  template: `
    <router-outlet></router-outlet>
  `
})
export class GlobalAccountComponent implements OnInit {
  constructor() { }
  ngOnInit() {
  }
}
