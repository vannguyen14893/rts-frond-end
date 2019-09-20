import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { NavigationService } from '../../../core/services/navigation.service';
import { ReportService } from '../../service/report.service';
import { Project } from '../../../model/project.class';
import { IdentityService } from '../../../core/services/identity.service';

@Component({
  selector: 'app-report-hrmanager',
  templateUrl: './report-hrmanager.component.html',
  styleUrls: ['./report-hrmanager.component.css']
})
export class ReportHrmanagerComponent implements OnInit, OnDestroy {

  isHrManager = false;

  listProject: Project[];

  subListProject: Subscription;

  constructor(
    private reportService: ReportService,
    private navigationService: NavigationService,
    identityService: IdentityService,
  ) {
    this.isHrManager = identityService.isHrManager();
   }

  ngOnInit() {
    this.getListProject();
}

  getListProject() {
    this.subListProject = this.reportService.getAllProject()
      .subscribe(response => {
        this.listProject = response;
      });
  }

  navCvStatusList() {
    this.navigationService.navCvStatusList();
  }

  ngOnDestroy() {
    if (this.subListProject) {
      this.subListProject.unsubscribe();
    }
  }
}
