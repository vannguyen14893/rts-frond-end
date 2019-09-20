import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'elapsedTime'
})
export class ElapsedTimePipe implements PipeTransform {

  transform(value: any, args?: any): string {
    // const datetimeRegex = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
    // if (!value || (typeof(value) === 'string' && !String(value).match(datetimeRegex)) ) {
    //   return 'unkown time';
    // }
    // const datetimeSegments = String(value).split(' ');
    // const dateSegments = datetimeSegments[0].split('/');
    // const timeSegments = datetimeSegments[1].split(':');

    const current = new Date().valueOf();
    // const input = new Date(
    //   parseInt(dateSegments[2], 10),
    //   parseInt(dateSegments[1], 10),
    //   parseInt(dateSegments[0], 10),
    //   parseInt(timeSegments[0], 10),
    //   parseInt(timeSegments[1], 10),
    //   parseInt(timeSegments[2], 10))
    //   .valueOf();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - value;

    if (elapsed < msPerMinute) {
      return ' Just a minute ago';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return 'about ' + Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
      return 'about ' + Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
      console.log('inside the if condition', elapsed);
      return 'about ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
  }

}
