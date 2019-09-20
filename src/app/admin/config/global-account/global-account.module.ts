import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalAccountComponent } from './global-account.component';
import { CreateComponent } from './pages/create/create.component';
import { SharedModule } from '../../../shared/shared.module';
import { NgbModule } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { GlobalAccountService } from './service/global-account.service';
import { GlobalAccountCreateGuard } from './guards/global-account-create.guard';
import { GlobalAccountRoutingModule } from './global-account-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    GlobalAccountRoutingModule,
  ],
  declarations: [
    GlobalAccountComponent,
    CreateComponent,
  ],
  providers: [
    GlobalAccountService,
    GlobalAccountCreateGuard,
  ],
})
export class GlobalAccountModule { }
