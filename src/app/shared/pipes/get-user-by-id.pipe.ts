import { User } from './../../model/user.class';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getUserById'
})
export class GetUserByIdPipe implements PipeTransform {

  transform(value: User[], userId: number): any {
    if (!value || value === null || value === []) {
      return null;
    }
    const index = value.findIndex(u => u.id === userId);
    return value[index];
  }

}
