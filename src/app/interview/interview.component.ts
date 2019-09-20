import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-interview',
    template: `
        <router-outlet></router-outlet>
    `
})
export class InterviewComponent implements OnInit {
    constructor() { }
    ngOnInit() { }
}
