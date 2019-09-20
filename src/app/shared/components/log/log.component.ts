import { User } from './../../../model/user.class';
import { Log } from './../../../model/log.class';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  @Input() log: Log;
  message = '';
  arr : string[];

  constructor() { }

  ngOnInit() {
    this.message = this.getMessage();
    this.arr = this.log.content.split("\n");
    // console.log('str: ', this.arr[1])
  }

  getMessage() {
    switch (this.log.action) {
      case 'create':
        return 'created this ' + this.log.tableName;
      case 'delete':
        return 'delete this ' + this.log.tableName;
      case 'update':
        return 'updated this ' + this.log.tableName;
      default:
        return '';
    }
  }
}
