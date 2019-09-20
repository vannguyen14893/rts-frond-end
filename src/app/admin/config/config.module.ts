import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigHomeComponent } from './config-home/config-home.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigRoutingModule
  ],
  declarations: [ConfigHomeComponent]
})
export class ConfigModule { }
