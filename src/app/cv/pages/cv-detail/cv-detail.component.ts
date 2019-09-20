import { IRootState } from './../../../core/redux/root.store';
import { Component, OnInit, AfterViewInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CvService } from '../../service/cv.service';
import { Skill } from '../../../model/skill.class';
import { Subscription } from 'rxjs/Subscription';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { API_URL } from '../../../shared/constants/api.constant';
import { Cv } from '../../../model/cv.class';
import { validateDob } from '../../../shared/custom-validator/dob.validator';
import Utils from '../../../shared/helpers/util';
import { ScriptLoaderService } from '../../../core/services/script-loader.service';
import { forEach } from '@angular/router/src/utils/collection';
import { GetAllService } from '../../../core/services/get-all.service';
import { CONFIG } from '../../../shared/constants/configuration.constant';
import { NavigationService } from '../../../core/services/navigation.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../model/user.class';
import { CommonValidator } from '../../../shared/custom-validator/common.validator';
import { REGEX } from '../../../shared/constants/regex.constant';
import { CvUrl } from '../../../model/cv-url.class';
import { Observable } from 'rxjs/Observable';
import { NgRedux } from 'ng2-redux';
import { DOMAIN_STORE_UPDATE } from '../../../core/redux/domain/domain.action';
import { normalizeCv } from '../../../core/redux/domain/domain.normalization';
import { Experience } from '../../../model/experience.class';
import { Request } from '../../../model/request.class';
import { RequestManagementService } from '../../../request-management/services/request-management.service';
import { Candidate } from '../../../model/candidate.class';
import { Certification } from '../../../model/certification.class';
import { CertificationService } from '../../../admin/config/certification/services/certification.service';

declare var $: any;
@Component({
  selector: 'app-cv-detail',
  templateUrl: './cv-detail.component.html',
  styleUrls: ['./cv-detail.component.css']
})
export class CvDetailComponent implements OnInit, OnDestroy {
  @Output() submitted$ = new EventEmitter<void>();
  skillList: Skill[];
  certificationList: Certification[];
  experienceList: Experience[];
  requestList: Request[];
  form: FormGroup;


  constraints = {
    varcharMaxLength: CONFIG.VARCHAR_MAX_LENGTH,
    facebookMaxLength: 500,
    unicodeMaxLength: 2000,
    phoneMaxLength: 20,
    avatarMaxSize: 3145728, // 3MB
    cvFileMaxSize: 5242880, // 5MB
    nameMinLength: 2,
    nameMaxLength: CONFIG.VARCHAR_MAX_LENGTH
  };

  loading = false;

  // Messages
  messageChooseImage = '';
  messageCreateCvSuccess = '';
  messageCreateCvError = '';
  messageErrorUploadException = '';

  // For avatar upload
  avatarBase64: any; // To convert Image file to base64 and display on HTML.
  selectedAvatarFiles: File[] = []; // Files chosen by user
  validAvatarFilesToUpload: File[] = []; // An array of avatar which passes all validations.

  // For CV files upload
  cvFilesCheckResults: CvFileCheckMessage[] = []; // cv check results returned from server
  selectedCvFiles: File[] = []; // Files chosen by user
  validCvFilesToUpload: File[] = []; // Files that were checked by server and will be uploaded.
  currentCvUrlCollectionCopy: CvUrl[];

  // To initialize calendar dob
  maxDate: NgbDateStruct;

  // subscription
  subSkill: Subscription;
  subExperience: Subscription;
  subFinal: Subscription;
  subRequest: Subscription;
  subCertification: Subscription;

  // To store id of duplicate CV
  duplicateEmailCvId: number;
  duplicateFacebookCvId: number;
  duplicateSkypeCvId: number;
  duplicateLinkedinCvId: number;

  cv: Cv; // get cv from service and display on view.

  private extensionValid = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];
  private cvId: number;
  public listRequestHistory: string[];

  //
  constructor(
    private cvService: CvService,
    private router: Router,
    private _script: ScriptLoaderService,
    private httpClient: HttpClient,
    private getAllService: GetAllService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private ngRedux: NgRedux<IRootState>,
    private certificationService: CertificationService,

  ) {
    if (this.cvService.cv) {
      this.cv = cvService.cv;
      this.currentCvUrlCollectionCopy = this.cv.cvUrlCollection;
    }
  }


  ngOnInit() {

    this.listRequestHistory = [];

    this.maxDate = this.getFourteenYearsAgo();
    this.buildForm();

    this.route.paramMap.switchMap(params => {
      const id = +params.get('id');
      if (!this.cv || this.cv.id !== id) {
        return this.cvService.getOne(id);
      }
      this.cvId = id; // tham số dùng cho chức năng lấy lịch sử make candidate.
      this.initFormValues();
      // console.log('Current cv in service', this.cv);
      return null;
    }).switchMap(cv => {
      this.cv = cv;  // this.cv biến đc bind ra view. nếu trong service không có đc lấy từ API.
      this.cvId = cv.id;
      this.currentCvUrlCollectionCopy = this.cv.cvUrlCollection;
      this.initFormValues();

      // đồng bộ hóa lấy lịch sử make canidate 
      return this.cvService.getHistoryMakeCandidateByCv(cv.id);
    }).subscribe(data => {
    }, err => console.error(err));

    this.subSkill = this.getAllService.getAllSkills().subscribe(data => {
      this.skillList = data;
    }, err => console.error(err));
    this.subExperience = this.getAllService.getAllExperiences().subscribe(data => {
      this.experienceList = data;
    }, err => console.error(err));
    this.subCertification = this.certificationService.findAll().subscribe(data => {
      this.certificationList = data.content;
    }, err => console.error(err));
    this.subRequest = this.cvService.getHistoryMakeCandidateByCv(this.cvId).subscribe(data => {
      this.requestList = data;
      if (this.requestList && this.requestList.length > 0) {
        this.requestList.forEach((element: Request) => {
          this.listRequestHistory.push(element.title);
        });
      }
    }, err => console.error(err));


  }

  private getFourteenYearsAgo(): NgbDateStruct {
    const now = new Date();
    const fourteenYearsAgo = { year: now.getFullYear() - 14, month: now.getMonth() + 1, day: now.getDate() };
    // console.log('14: ', fourteenYearsAgo);
    return fourteenYearsAgo;
  }

  openAvatarBrowser() {
    document.getElementById('uploadAvatar').click();
  }
  openCvBrowser() {
    document.getElementById('cvUrl').click();
  }

  buildForm() {
    const fullNameRegex = new RegExp(REGEX.NAME);
    const phoneRegex = new RegExp(REGEX.PHONE);
    // tslint:disable-next-line:max-line-length
    const emailRegex = new RegExp(REGEX.EMAIL);
    this.form = new FormGroup({
      fullName: new FormControl('', [
        CommonValidator.required(),
        CommonValidator.minlength(this.constraints.nameMinLength),
        CommonValidator.pattern(fullNameRegex)
      ]),
      dob: new FormControl(),
      gender: new FormControl(),
      phone: new FormControl('', [
        CommonValidator.pattern(phoneRegex, 1)
      ]),
      email: new FormControl('', [
        CommonValidator.pattern(emailRegex, 1)
      ]),
      profileImg: new FormControl(),
      address: new FormControl(),
      position: new FormControl(),
      education: new FormControl(),
      experience: new FormControl(),
      cvUrlCollection: new FormControl(),
      skillCollection: new FormControl(this.skillList),
      certificationColection: new FormControl(this.certificationList),
      note: new FormControl(),
      skype: new FormControl(),
      facebook: new FormControl(),
      linkedin: new FormControl(),
    });
  }

  private initFormValues() {
    this.fullName.setValue(this.cv.fullName);
    if (this.cv.dob) {
      this.dob.setValue(Utils.convertToNgbDatepickerFormat(this.cv.dob));
    }
    this.gender.setValue(this.cv.gender ? '1' : '0');
    this.phone.setValue(this.cv.phone);
    this.email.setValue(this.cv.email);
    this.profileImg.setValue(this.cv.profileImg);
    this.address.setValue(this.cv.address);
    this.education.setValue(this.cv.education);
    this.experience.setValue(this.cv.experienceId ? this.cv.experienceId.id : null);
    this.skillCollection.setValue(this.convertSkillCollectionToNgSelectValues(this.cv.skillCollection));
    this.certificationColection.setValue(this.convertCertificationCollectionToNgSelectValues(this.cv.certificationCollection));
    this.note.setValue(this.cv.note);
    this.skype.setValue(this.cv.skype);
    this.facebook.setValue(this.cv.facebook);
    this.linkedin.setValue(this.cv.linkedin);
  }
  private convertSkillCollectionToNgSelectValues(skills: Skill[]): number[] {
    const skillIds = [];
    if (!skills || skills.length === 0) {
      return [];
    }
    for (const s of skills) {
      skillIds.push(s.id);
    }
    return skillIds;
  }
  private convertCertificationCollectionToNgSelectValues(certifications: Certification[]): number[] {
    const certificationIds = [];
    if (!certifications || certifications.length === 0) {
      return [];
    }
    for (const s of certifications) {
      certificationIds.push(s.id);
    }
    return certificationIds;
  }


  /**
  * WhatItDoes handles avatar file selection
  * CreatedBy ldthien
  * CreatedAt 2018/03/26
  */
  onChangeAvatar(event) {
    this.messageCreateCvError = '';
    this.messageCreateCvSuccess = '';
    this.selectedAvatarFiles = [];
    const selectedAvatar = event.target.files[0];

    if (selectedAvatar.size > this.constraints.avatarMaxSize) {
      this.messageChooseImage = `File size more than ${this.constraints.avatarMaxSize / 1024 / 1024}MB`;
    } else {
      this.selectedAvatarFiles.push(selectedAvatar);
      // Read Image and display on HTML
      const reader = new FileReader();
      reader.readAsDataURL(selectedAvatar);
      reader.onload = (event: any) => {
        this.avatarBase64 = event.target.result; // To display on view
      };

      // Check image existence
      this.checkImageExist(selectedAvatar);
    }
  }
  checkImageExist(fileImage: File) {
    this.messageChooseImage = '';
    this.validAvatarFilesToUpload = [];

    this.cvService.checkFileExistence([fileImage.name]).subscribe((res: any[]) => {
      for (const item of res) {
        if (item.exist) {
          this.messageChooseImage = item.fileName + ' exists. Please choose another one.';
        } else {
          this.validAvatarFilesToUpload.push(fileImage);
        }
      }
    }, err => {
      console.error(err);
      this.messageChooseImage = 'Internal Server Error.';
    });
  }

  // if true extention valid
  private checkExtentionValid(file: File): boolean {
    let i = file.name.lastIndexOf('.');
    let extension: string;
    if (i > 0) {
      extension = file.name.substring(i).toLowerCase();
      return (this.extensionValid.includes(extension))
    }
    return false;
  }

  onChangeCvFile(event) {
    this.messageCreateCvError = '';
    this.messageCreateCvSuccess = '';
    this.messageErrorUploadException = '';
    this.validCvFilesToUpload = [];
    if (event.target.files) {
      this.cvFilesCheckResults = [];
      this.selectedCvFiles = event.target.files;

      for (const file of this.selectedCvFiles) {
        if (file.size > this.constraints.cvFileMaxSize) {
          const cvCheckResult = new CvFileCheckMessage();
          cvCheckResult.name = file.name;
          cvCheckResult.message = `File size exceeds ${this.constraints.cvFileMaxSize / 1024 / 1024} MB`;
          this.cvFilesCheckResults.push(cvCheckResult);
        } else {
          if (this.checkExtentionValid(file)) {
            this.checkCvExist(file);
          } else {
            const cvCheckResult = new CvFileCheckMessage();
            cvCheckResult.name = file.name;
            cvCheckResult.message = `File type invalid`;
            this.cvFilesCheckResults.push(cvCheckResult);
          }
        }
      }
    }
  }

  checkCvExist(file: File) {
    this.cvService.checkFileExistence([file.name]).subscribe((res: any[]) => {
      if (!res[0].exist) {
        this.validCvFilesToUpload.push(file);
        this.cvFilesCheckResults.push(new CvFileCheckMessage(file.name, 'valid'));
      } else {
        this.cvFilesCheckResults.push(new CvFileCheckMessage(file.name, 'exist'));
      }
    }, err => {
      this.cvFilesCheckResults.push(new CvFileCheckMessage(file.name, 'Internal server error'));
      console.error('Error during checking cv existence', err);
    });
  }

  // Validate email, skype, facebook and linkedin
  checkEmail() {
    if (this.email.dirty
      && this.email.valid
      && this.email.value
      && this.email.value.trim().length > 0
      && this.email.value !== this.cv.email
    ) {
      // this.email.setValidators(Validators.email);
      const contacts = {
        email: this.email.value,
      };
      this.cvService.checkContact(contacts).subscribe(res => {
        this.email.setErrors({ exist: res });
        this.duplicateEmailCvId = parseInt(res, 10);
      });

    }
  }
  checkSkype() {
    if (this.skype.touched
      && this.skype.valid
      && this.skype.value
      && this.skype.value.trim().length > 0
      && this.skype.value !== this.cv.skype
    ) {
      const contacts = {
        skype: this.skype.value,
      };
      this.cvService.checkContact(contacts).subscribe(res => {
        this.skype.setErrors({ exist: res });
        this.duplicateSkypeCvId = parseInt(res, 10);
      });

    }
  }
  checkFacebook() {
    if (this.facebook.touched
      && this.facebook.valid
      && this.facebook.value
      && this.facebook.value.trim().length > 0
      && this.facebook.value !== this.cv.facebook
    ) {
      const contacts = {
        facebook: this.facebook.value,
      };
      this.cvService.checkContact(contacts).subscribe(res => {
        this.facebook.setErrors({ exist: res });
        this.duplicateFacebookCvId = parseInt(res, 10);
      });

    }
  }
  checkLinkedin() {
    if (this.linkedin.touched
      && this.linkedin.valid
      && this.linkedin.value
      && this.linkedin.value.trim().length > 0
      && this.linkedin.value !== this.cv.linkedin
    ) {
      const contacts = {
        linkedin: this.linkedin.value,
      };
      this.cvService.checkContact(contacts).subscribe(res => {
        this.linkedin.setErrors({ exist: res });
        this.duplicateLinkedinCvId = parseInt(res, 10);
      });
    }
  }

  viewCvDetailDuplicateEmail() {
    window.open('#/cv/' + this.duplicateEmailCvId);
  }
  viewCvDetailDuplicateFacebook() {
    window.open('#/cv/' + this.duplicateFacebookCvId);
  }
  viewCvDetailDuplicateSkype() {
    window.open('#/cv/' + this.duplicateSkypeCvId);
  }
  viewCvDetailDuplicateLinkedin() {
    window.open('#/cv/' + this.duplicateLinkedinCvId);
  }

  // Click events

  // Toggle 'tobeDeleted' value of CvUrl
  toggleCvUrl(item: CvUrl) {
    const index = this.cv.cvUrlCollection.findIndex(c => c.id === item.id);
    if (index > -1) {
      this.cv.cvUrlCollection[index].tobeDeleted = !this.cv.cvUrlCollection[index].tobeDeleted;
    }
  }

  onSubmit() {
    this.messageChooseImage = '';
    this.messageCreateCvError = '';
    this.messageCreateCvSuccess = '';
    this.messageErrorUploadException = '';

    let obsUploadAvatar = null;
    let obsUploadCv = null;
    let combined = null;
    if (this.validAvatarFilesToUpload && this.validAvatarFilesToUpload.length > 0) {
      obsUploadAvatar = this.cvService.uploadAvatar(this.validAvatarFilesToUpload);
    }
    if (this.validCvFilesToUpload && this.validCvFilesToUpload.length > 0) {
      obsUploadCv = this.cvService.uploadCVFiles(this.validCvFilesToUpload);
    }
    if (this.form.valid) {
      if (obsUploadAvatar && obsUploadCv) {
        combined = Observable.combineLatest(
          obsUploadAvatar,
          obsUploadCv
        );
      } else if (obsUploadAvatar) {
        combined = Observable.combineLatest(
          obsUploadAvatar
        );
      } else if (obsUploadCv) {
        combined = Observable.combineLatest(
          obsUploadCv
        );
      }
      let obsFinal = null;
      if (combined) {
        obsFinal = combined.switchMap(res => {
          return this.cvService.updateCv(this.getFormData());
        });
      } else {
        obsFinal = this.cvService.updateCv(this.getFormData());
      }
      this.subFinal = obsFinal.subscribe(res => {
        this.scrollTop();
        this.messageCreateCvSuccess = 'Update CV successfully.';

        // Remove message và data.
        this.messageChooseImage = '';
        this.avatarBase64 = '';
        this.cvFilesCheckResults = [];
        this.selectedAvatarFiles = [];
        this.selectedCvFiles = [];
        this.validAvatarFilesToUpload = [];
        this.validCvFilesToUpload = [];
        // TODO: Reset cv files input
        this.cvService.getOne(this.cv.id).subscribe(cv => {
          this.cv = cv;
          // Update domain store
          this.ngRedux.dispatch({
            type: DOMAIN_STORE_UPDATE,
            payload: normalizeCv(this.cv)
          });
          // Emit event để đóng modal ở Component cha
          this.submitted$.emit();
        }, err => {
          console.error(err);
        });
      }, err => {
        this.scrollTop();
        this.messageCreateCvError = 'Fail to update CV.';
        console.error('>>>> err: ', err);
      });
    }
  }

  private getFormData(): Cv {
    const cv = this.cv;
    const ngbDob = this.dob.value;
    if (ngbDob) {
      cv.dob = Utils.dateToString(Utils.createDate(ngbDob.year, ngbDob.month, ngbDob.day));
    }
    cv.fullName = this.fullName.value.trim();
    cv.gender = +this.gender.value === 1 ? true : false;
    cv.phone = this.phone.value;
    cv.email = (this.email.value || '').trim();
    cv.address = (this.address.value || '').trim();
    cv.experienceId = (this.experience.value) ? new Experience(this.experience.value) : null;
    const skillIdCollection = this.skillCollection.value || [];
    cv.skillCollection = [];
    if (skillIdCollection.length > 0) {
      for (const skillId of skillIdCollection) {
        cv.skillCollection.push(new Skill(skillId));
      }
    }
    const cerCollection = this.certificationColection.value || [];
    cv.certificationCollection = [];
    if (cerCollection.length > 0) {
      for (const certificationId of cerCollection) {
        cv.certificationCollection.push(new Certification(certificationId));
      }
    }
    cv.education = (this.education.value || '').trim();
    cv.facebook = (this.facebook.value || '').trim();
    cv.skype = (this.skype.value || '').trim();
    cv.linkedin = (this.linkedin.value || '').trim();
    cv.note = (this.note.value || '').trim();
    if (this.validAvatarFilesToUpload.length > 0) {
      cv.profileImg = this.validAvatarFilesToUpload[0].name;
    }
    if (this.validCvFilesToUpload.length > 0) {
      for (const file of this.validCvFilesToUpload) {
        const cvUrl = new CvUrl(file.name, false);
        cv.cvUrlCollection.push(cvUrl);
      }
    }
    console.log('CHECKING IF CV IS CHANGED', this.cv);
    return cv;
  }

  viewFileCv(path: string) {
    this.cvService.viewFileCv(path)
    // window.open(environment.baseUrl + '/public/' + path);
  }

  onReset() {
    this.validAvatarFilesToUpload = [];
    this.validCvFilesToUpload = [];
    this.cvFilesCheckResults = [];
    this.avatarBase64 = null;
    this.messageChooseImage = '';
    this.messageCreateCvError = '';
    this.messageCreateCvSuccess = '';
    this.messageErrorUploadException = '';
    this.initFormValues();
  }
  onCancel() {
    this.navigationService.navCvList();
  }
  navCvList() {
    this.navigationService.navCvList();
  }

  // scroll to top after update
  private scrollTop() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  // Getting Form Controls
  get email() {
    return this.form.get('email');
  }
  get facebook() {
    return this.form.get('facebook');
  }
  get skype() {
    return this.form.get('skype');
  }
  get linkedin() {
    return this.form.get('linkedin');
  }
  get skillCollection() {
    return this.form.get('skillCollection');
  }
  get fullName() {
    return this.form.get('fullName');
  }
  get dob() {
    return this.form.get('dob');
  }
  get gender() {
    return this.form.get('gender');
  }
  get phone() {
    return this.form.get('phone');
  }
  get profileImg() {
    return this.form.get('profileImg');
  }
  get address() {
    return this.form.get('address');
  }
  get education() {
    return this.form.get('education');
  }
  get experience() {
    return this.form.get('experience');
  }
  get cvUrlCollection() {
    return this.form.get('cvUrlCollection');
  }
  get note() {
    return this.form.get('note');
  }
  get position() {
    return this.form.get('position');
  }
  get certificationColection() {
    return this.form.get('certificationColection');
  }

  ngOnDestroy() {
    if (this.subExperience) {
      this.subExperience.unsubscribe();
    }
    if (this.subSkill) {
      this.subSkill.unsubscribe();
    }
    if (this.subFinal) {
      this.subFinal.unsubscribe();
    }
    if (this.subRequest) {
      this.subRequest.unsubscribe();
    }
    if (this.subCertification) {
      this.subCertification.unsubscribe();
    }
  }

}
export class CvFileCheckMessage {
  constructor(
    public name?: string,
    public message?: string) {
  }
}
