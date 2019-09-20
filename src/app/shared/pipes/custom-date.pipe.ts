import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  /**
   * sử dụng custom date bắt buộc phải truyển thêm tham số, không có case mặc định.
   */

  transform(value: any, args?: any): any {
    const newDate = new Date(value);
    switch(args) {
      case "dd-MM-yyyy": {
        return `${(newDate.getDate() < 10) ? '0'+newDate.getDate() : newDate.getDate()}/`+
        `${(newDate.getMonth() < 10) ? '0'+newDate.getMonth() : newDate.getMonth()}/`+
        `${newDate.getFullYear()}`;
      }
      case "dd-MM-yyyy hh:mm": {
        return `${(newDate.getDate() < 10) ? '0' + newDate.getDate() : newDate.getDate()}/` +
        `${(newDate.getMonth() < 10) ? '0' + newDate.getMonth() : newDate.getMonth()}/` +
        `${newDate.getFullYear()} ` +
        `${(newDate.getHours() < 10) ? '0' + newDate.getHours() : newDate.getHours()}:` +
        `${(newDate.getMinutes() < 10) ? '0' + newDate.getMinutes() : newDate.getMinutes()}:`;
      }
    }
  }

}
