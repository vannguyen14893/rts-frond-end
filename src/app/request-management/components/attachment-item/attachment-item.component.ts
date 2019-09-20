import { denormalizeCandidate } from './../../../core/redux/domain/domain.normalization';
import { Observable } from 'rxjs/Observable';
import { IRootState } from './../../../core/redux/root.store';
import { Candidate } from './../../../model/candidate.class';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { select, NgRedux } from 'ng2-redux';
import { RequestCenterService } from '../../services/request-center.service';
import { Interview } from '../../../model/interview.class';
import { CvService } from "../../../cv/service/cv.service"
import { CvUrl } from '../../../model/cv-url.class';

@Component({
  selector: 'app-attachment-item',
  templateUrl: './attachment-item.component.html',
  styleUrls: ['./attachment-item.component.css']
})
export class AttachmentItemComponent implements OnInit {

  @select((s: IRootState) => s.appStore.requestCenterStore.currentCandidateId) currentCandidateId$;
  @select((s: IRootState) => s.domainStore.candidates) candidates$;

  currentCandidate: Candidate;
  cvUrls: CvUrl[];
  pathImge: string;

  constructor(
    private cvService: CvService,
    private ngRedux: NgRedux<IRootState>,
  ) { }

  ngOnInit() {
    this.cvUrls = [];
    this.pathImge = '../.././../../assets/img/icons/'
    Observable.combineLatest(
      this.candidates$,
      this.currentCandidateId$
    ).subscribe(res => {
      if (res[1] !== 0) {
        this.currentCandidate = denormalizeCandidate(res[0][res[1]], this.ngRedux.getState()['domainStore']);
        this.currentCandidate.cvId.cvUrlCollection.forEach(element => {
          element.path = this.showIcon(element.url)
        });
        this.cvUrls = this.currentCandidate.cvId.cvUrlCollection;
      }
    });
  }

  public showIcon(fileName: string): string {
    let i = fileName.lastIndexOf('.');
    if (i > 0) {
      let extension = fileName.substring(i).toLowerCase()
      if ('.doc' === extension)
        return this.pathImge + 'word-icon.png';
      else if ('.docx' === extension)
        return this.pathImge + 'word-icon.png';
      else if ('.excel' === extension)
        return this.pathImge + 'excel-icon.png';
      else if ('.pdf' === extension)
        return this.pathImge + 'pdf-icon.png';
    }
  }

  public viewFileCv(path: string) {
    this.cvService.viewFileCv(path)
  }

}
