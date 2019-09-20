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
import { DOMAIN_STORE_UPDATE } from '../../../core/redux/domain/domain.action';
import { normalizeCv, denormalizeCandidate } from '../../../core/redux/domain/domain.normalization';
import { Experience } from '../../../model/experience.class';
import { Request } from '../../../model/request.class';
import { RequestManagementService } from '../../../request-management/services/request-management.service';
import { select, NgRedux } from 'ng2-redux';
import { Candidate } from '../../../model/candidate.class';
import 'rxjs/add/observable/combineLatest'; // đây là import của riêng combineLatest không xóa.
import { Certification } from '../../../model/certification.class';
import { CertificationService } from '../../../admin/config/certification/services/certification.service';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.css']
})
export class CandidateDetailComponent implements OnInit {

  @Output() submitted$ = new EventEmitter<void>();
  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;

  certificationList: Certification[];
  skillList: Skill[];
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
  // cvFilesCheckResults: CvFileCheckMessage[] = []; // cv check results returned from server
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

  private extensionValid: string[];
  private cvId: number;
  public listRequestHistory: string[];

  private currentCandidate: Candidate;

  public request: Request;
  // public candidate: Candidate;
  public titleValue: string;
  public sourceValue: string;
  public enableEditCandidate: boolean;

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
  }

  ngOnInit() {
    this.sourceValue = '';
    this.titleValue = '';

    this.listRequestHistory = [];

    this.buildForm();
    this.disableContentInForm();

    Observable.combineLatest(
      this.candidates$,
      this.currentCandidateId$,
    ).switchMap(res => {
      this.currentCandidate = denormalizeCandidate(res[0][res[1]], this.ngRedux.getState()['domainStore']);
      this.cv = this.currentCandidate.cvId;
      this.cvId = this.cv.id;

      //bind data to view.
      this.initFormValues();
      this.request = this.currentCandidate.requestId;
      if (this.currentCandidate.source) {
        this.sourceValue = this.currentCandidate.source
      };
      if (this.currentCandidate.title) {
        this.titleValue = this.currentCandidate.title
      }
      this.currentCvUrlCollectionCopy = this.cv.cvUrlCollection;

      return this.cvService.getHistoryMakeCandidateByCv(this.cvId);
    }).subscribe(data => {
      this.requestList = data;
      // hàm con đã bind dữ liệu vào view listRequestHistory. không cần bind dữ liệu vào đây.

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

  public viewFileCv(path: string) {
    this.cvService.viewFileCv(path)
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
      position: new FormControl(),
      address: new FormControl(),
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
    this.dob.setValue(Utils.convertToNgbDatepickerFormat(this.cv.dob));
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

  // khi edit candidate truyền giá trị vào form tắt hết các input.
  disableContentInForm() {
    this.form.disable();
  }

  navCvList() {
    window.history.back();
  }

  //scroll to top after update
  private scrollTop() {
    window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  }

  //update candidate
  candidateUpdateSubmit() {
    this.currentCandidate.title = this.titleValue;
    this.currentCandidate.source = this.sourceValue;

    this.cvService.makeCandidate(this.currentCandidate)
      .subscribe(response => {
        this.messageCreateCvSuccess = 'update canidate success';
        this.scrollTop();
      })
      , error => {
        this.messageCreateCvSuccess = 'update canidate false';
        this.scrollTop();
      };
  }

  candidateClearSubmit() {
    this.titleValue = '';
    this.sourceValue = '';
  }
  candidateCancelSubmit() {
    window.history.back();
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
  get position(){
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
