import { Size } from './../../constants/types.constant';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {

  @Input() src: string;
  @Input() size: Size = 's';
  @Input() isRounded = 'true';
  @Input() noRadius = 'false';
  @Input() square = 'false';

  currentStyles: {};

  constructor() { }

  ngOnInit() {
    this.setCurrentStyles();
  }

  setCurrentStyles() {
    this.currentStyles = {
      'width': this.size === 'x' ? '90px' : this.size === 's' ? '24px' : this.size === 'm' ? '32px' : this.size === 'l' ? '48px' : this.size,
      'height': this.size === 'x' ? '90px' : this.size === 's' ? '24px' : this.size === 'm' ? '32px' : this.size === 'l' ? '48px' : this.size,
      'border-radius': this.noRadius === 'true' ? '0px' : this.isRounded === 'true' ? '50%' : '3px'
    };
  }

}
