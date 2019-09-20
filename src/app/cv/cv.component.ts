import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cv',
    template: `
        <router-outlet></router-outlet>
    `
})
export class CvComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}