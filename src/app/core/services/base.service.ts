import { LOCAL_STORAGE } from '../../shared/constants/local-storage.constant';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Token } from '../../model/token.class';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/throw';

/**
* @WhatItDoes defines all common services to api servers
* @Author LDThien
* @Date 2018/02/27
*/
@Injectable()
export class BaseService {

  constructor(
    public httpClient: HttpClient,
  ) { }

  handleError(err) {
    if (err.status === 401) {
      this.logout();
      return Observable.empty();
    } else {
      throw err;
    }
  }

  logout() {
    localStorage.removeItem(LOCAL_STORAGE.CURRENT_USER);
    localStorage.removeItem(LOCAL_STORAGE.TOKENS);
    this.refresh();
  }

  refresh() {
    window.location.reload();
  }

  get(url: string, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.get(url, {
          headers: this.createHeaders(),
          params,
          responseType: 'text',
        })
          .catch((err: HttpErrorResponse) => {
            return this.handleError(err);
          });
      case 'blob':
        return this.httpClient.get(url, {
          headers: this.createHeaders(),
          params,
          responseType: 'blob',
        });
      default:
        return this.httpClient.get(url, {
          headers: this.createHeaders(),
          params
        })
          .catch((err: HttpErrorResponse) => {
            return this.handleError(err);
          });
    }
  }

  /**
   * Create a new entity.
   * @param url the api url
   * @param data the entity to create
   */
  post(url: string, data: any, params?: {}, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.post(url, data, {
          headers: this.createHeaders() || {},
          responseType: 'text',
          params
        });
      default:
        return this.httpClient.post(url, data, {
          headers: this.createHeaders() || {},
          params
        });
    }
  }

  /**
   * Update an entity.
   * @param url the api url
   * @param data the entity to be updated
   */
  put(url: string, data: any, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.put(url, data, {
          headers: this.createHeaders() || {},
          responseType: 'text'
        });
      default:
        return this.httpClient.put(url, data, {
          headers: this.createHeaders() || {},
        });
    }
  }

  /**
   * Delete an entity.
   * @param url the api url
   * @param id the entity id to be deleted
   */
  delete(url: string, id: any, responseType?: string): Observable<any> {
    switch (responseType) {
      case 'text':
        return this.httpClient.delete(url, {
          headers: this.createHeaders() || {},
          responseType: 'text'
        });
      default:
        return this.httpClient.delete(url, {
          headers: this.createHeaders() || {},
        });
    }
  }

  public createHeaders() {
    // Why "authorization": see CustomLogoutSuccessHandler on server
    return new HttpHeaders().set('Authorization', 'Bearer ' + this.getToken().access_token);
  }
  private getToken(): Token {
    return <Token>JSON.parse(localStorage.getItem(LOCAL_STORAGE.TOKENS));
  }
}
