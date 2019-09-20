import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './auth/guards/auth.guard';
import { CoreModule } from './core/core.module';
import { IdentityService } from './core/services/identity.service';
import { NavigationService } from './core/services/navigation.service';
import { ScriptLoaderService } from './core/services/script-loader.service';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    CoreModule.forRoot(),
    NgbModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      newestOnTop: true,
      maxOpened: 5,
      autoDismiss: true,
      preventDuplicates: true,
      positionClass: 'toast-top-right'
    })
  ],
  providers: [
    ScriptLoaderService,
    NavigationService,
    IdentityService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
