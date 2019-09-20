import { LOCAL_STORAGE } from '../../../../shared/constants/local-storage.constant';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { LoginService } from '../../../../auth/services/login.service';
import { ModalMessage } from '../../../../model/modal-message.class';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../../../model/user.class';
import { IdentityService } from '../../../../core/services/identity.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CvService } from '../../../../cv/service/cv.service';
import { API_URL } from '../../../../shared/constants/api.constant';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  public isAdmin = false;
  public user: User;
  public role = '';
  avatarBase64: any;
  constraints = {
    avatarMaxSize: 3145728, // 3MB
    fileNameMaxLength: 255
  };
  isSubmitted = false;
  form: FormGroup;
  messageChangeAvatar: ModalMessage = new ModalMessage();

  private validAvatarNames = [];
  // Open or destroy modal message
  openModal = false;

  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private identityService: IdentityService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.isAdmin = this.identityService.isAdmin();
    this.user = this.identityService.getCurrentUser();
    this.role = this.identityService.getTopRole();
  }

  onCancel() {
  }

  openAvatarBrowser() {
    document.getElementById('uploadAvatar').click();
  }

  onChangeAvatar(event) {
    // console.log('AVATAR ON CHANGE');
    const selectedFileNames = [];
    const selectedFile: File = event.target.files[0];

    if (selectedFile.size > this.constraints.avatarMaxSize) {
      this.messageChangeAvatar.type = 'error';
      this.messageChangeAvatar.message = `File size exceeds ${this.constraints.avatarMaxSize / 1024 / 1024}MB`;
      this.openModal = true;
    } else if (selectedFile.name.length > this.constraints.fileNameMaxLength) {
      this.messageChangeAvatar.type = 'error';
      this.messageChangeAvatar.message = `File name exeeds ${this.constraints.fileNameMaxLength} characters.`;
      this.openModal = true;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.avatarBase64 = event.target.result; // To display on view
        // console.log('event', this.avatarBase64);
        selectedFileNames.push(selectedFile.name);
        if (selectedFileNames.length > 0) {
          this.uploadFile(selectedFile);
        }
      };
    }
  }

  private uploadFile(fileImage: File) {
    const formData = new FormData();
      formData.append("avatar", fileImage);
      // console.log('>>>> avatar ', formData);
    this.httpClient.post(environment.baseUrl + API_URL.UPLOAD_AVATAR, formData,
      {
        headers: this.userService.createHeaders(),
        responseType: 'text'
      }
    ).subscribe((res) => {
      this.messageChangeAvatar.type = 'success';
      this.messageChangeAvatar.message = 'Avatar changed.';
      this.openModal = true;
      this.identityService.getCurrentUserFromApiServer().subscribe( user => {
        this.user = user[0];
        this.localStorageService.setItem(LOCAL_STORAGE.CURRENT_USER, JSON.stringify(user[0]));
      });
    }, err => {
      if (err.status === 400) {
        this.messageChangeAvatar.type = 'error';
        this.messageChangeAvatar.message = 'File already exists. Please choose another one.';
      } else {
        this.messageChangeAvatar.type = 'error';
        this.messageChangeAvatar.message = 'Internal Server Error';
      }
      this.openModal = true;
    });
  }

  modalClosed($event) {
    console.log('modal closed');
    this.openModal = false;
  }

  @HostListener('window:beforeunload', ['$event'])  
  unloadNotification($event: any) {
    return !this.hasUnsavedData();
  }

  hasUnsavedData() {
    return !(this.isSubmitted || !this.form.dirty);
  }
}
