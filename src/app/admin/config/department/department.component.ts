import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-department',
    template: `
        <router-outlet></router-outlet>
    `
})
export class DepartmentComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}