import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUsername]'
})
export class UsernameDirective {

  // Allow letter and number only, starts with letter.
//   private regex: RegExp = new RegExp(/(^[a-z])+[a-z0-9]*$/i);
  private regex: RegExp = new RegExp(/^[a-z0-9]*$/i);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight' ];

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', [ '$event' ])
  onKeyDown(event: KeyboardEvent) {
      // Allow Backspace, tab, end, and home keys
      if (this.specialKeys.indexOf(event.key) !== -1) {
          return;
      }
      // Do not use event.keycode this is deprecated.
      // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
      const current: string = this.el.nativeElement.value;
      // We need this because the current value on the DOM element
      // is not yet updated with the value from this event
      const next: string = current.concat(event.key);
      if (next && !String(next).match(this.regex)) {
          event.preventDefault();
      }
  }

}
