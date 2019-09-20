import { Comment } from './../../../model/comment.class';
import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../model/user.class';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  @Input() comment: Comment;

  constructor() {
  }

  ngOnInit() {
  }

}
