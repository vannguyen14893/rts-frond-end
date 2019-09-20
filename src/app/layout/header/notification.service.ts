import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Notification } from '../../model/notification.class';

@Injectable()
export class NotificationService {

  constructor(private http:HttpClient) { }

  private notificationUrl = environment.baseUrl + '/notifications';

  public getNotifications(id: number) {
    return this.http.get<Notification[]>(this.notificationUrl + '/' + id);
  }

}
