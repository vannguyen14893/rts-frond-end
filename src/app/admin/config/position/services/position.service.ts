import { Position } from '../../../../model/position.class';
import { Observable } from 'rxjs/Observable';
import { API_URL } from '../../../../shared/constants/api.constant';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '../../../../core/services/base.service';

@Injectable()
export class PositionService extends BaseService {
  positionListUrl = environment.baseUrl + API_URL.GET_ALL_POSITIONS;
  // To pass data to position update component
  private position: Position = new Position();
  getPosition() {
    return this.position;
  }
  setPosition(position) {
    this.position = position;
  }

  findAllUrl = environment.baseUrl + API_URL.FIND_ALL_POSITION;
  findByTitleUrl = environment.baseUrl + API_URL.POSITION_FIND_BY_TITLE;
  createOrUpdateUrl = environment.baseUrl + API_URL.POSITION_CREATE_OR_UPDATE;

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAll(): Observable<any> {
    return this.get(this.positionListUrl);
  }

  findAll(params: {}): Observable<any> {
    return this.get(this.findAllUrl, params);
  }

  findByTitle(title): Observable<any> {
    return this.get(this.findByTitleUrl, title);
  }

  createOrUpdate(params: {}): Observable<any> {
    return this.post(this.createOrUpdateUrl, params);
  }


}
