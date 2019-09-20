import { Component, OnInit } from '@angular/core';
import { IdentityService } from '../core/services/identity.service';

@Component({
    selector: 'app-report',
    template: `
        <div *ngIf="isHrManager || isGroupLead || isHrMember">
            <app-report-hrmanager></app-report-hrmanager>
        </div>
        `
})
export class ReportComponent implements OnInit {
    isHrManager = false;
    isHrMember = false;
    isGroupLead = false;
  
    constructor(identityService: IdentityService,) { 
      this.isHrManager = identityService.isHrManager();
      this.isHrMember = identityService.isHrMember();
      this.isGroupLead = identityService.isGroupLead();
    }
  
    ngOnInit() {
    }
}