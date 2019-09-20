import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavigationService } from '../../../core/services/navigation.service';
import { ReportService } from '../../service/report.service';
import { Project } from '../../../model/project.class';
import { IdentityService } from '../../../core/services/identity.service';

@Component({
  selector: 'app-report-hrmember',
  templateUrl: './report-hrmember.component.html',
  styleUrls: ['./report-hrmember.component.css']
})
export class ReportHrMemberComponent implements OnInit, OnDestroy {

  isHrMember = false;

  listProjectHrMember: Project[];

  subListProjectHrMember: Subscription;

  constructor(
    private reportService: ReportService,
    private navigationService: NavigationService,
    identityService: IdentityService,
  ) {
    this.isHrMember = identityService.isHrMember();
   }

  ngOnInit() {
    this.getListProject();
}

  getListProject() {
    this.subListProjectHrMember = this.reportService.getAllProjectHrMember()
      .subscribe(response => {
        this.listProjectHrMember = response;
      });
  }

  navCvStatusList() {
    this.navigationService.navCvStatusList();
  }

  ngOnDestroy() {
    if (this.subListProjectHrMember) {
      this.subListProjectHrMember.unsubscribe();
    }
  }
}
