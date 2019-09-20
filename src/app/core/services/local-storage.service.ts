import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

/**
* @WhatItDoes defines all functionality regarding the localStorage
* @Author LDThien
* @Date 2018/03/06
*/
@Injectable()
export class LocalStorageService {
  storageSubject = new Subject<any>();

  constructor() { }

  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
    this.storageSubject.next(value);
  }

  removeItem(key) {
    localStorage.removeItem(key);
    this.storageSubject.next('Removed ' + key);
  }


}
