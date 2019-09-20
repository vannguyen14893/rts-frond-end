import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { DuLeadGuard } from '../shared/guards/du-lead.guard';
import { DuMemberGuard } from '../shared/guards/du-member.guard';
import { HrManagerGuard } from '../shared/guards/hr-manager.guard';
import { HrMemberGuard } from '../shared/guards/hr-member.guard';
import { GroupLeadGuard } from '../shared/guards/group-lead.guard';
import { AdminGuard } from '../shared/guards/admin.guard';
import { NotificationService } from './header/notification.service';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
  ],
  declarations: [
    LayoutComponent,
    AsideNavComponent,
    FooterComponent,
    HeaderComponent,
    ScrollTopComponent,
  ],
  providers: [
    DuLeadGuard,
    DuMemberGuard,
    HrManagerGuard,
    HrMemberGuard,
    GroupLeadGuard,
    AdminGuard,
    NotificationService,
  ]
})
export class LayoutModule { }
