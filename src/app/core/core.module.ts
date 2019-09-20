import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, isDevMode } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DevToolsExtension, NgRedux, NgReduxModule } from 'ng2-redux';
import { IRootState, ROOT_INITIAL_STATE, rootReducer } from './redux/root.store';
import { BaseService } from './services/base.service';
import { IdentityService } from './services/identity.service';
import { LocalStorageService } from './services/local-storage.service';
import { NavigationService } from './services/navigation.service';
import { ScriptLoaderService } from './services/script-loader.service';
import { SortService } from './services/sort.service';
import { StoredProcedureService } from './services/stored-procedure.service';
import { ActionCreatorService } from './services/action-creator.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgReduxModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [

  ],
})
export class CoreModule {
  constructor(
    ngRedux: NgRedux<IRootState>,
    devTools: DevToolsExtension
  ) {
    let enhancers = [];
    // ... add whatever other enhancers you want.
    // You probably only want to expose this tool in devMode.
    if (isDevMode() && devTools.isEnabled()) {
      enhancers = [ ...enhancers, devTools.enhancer() ];
    }
    ngRedux.configureStore(
      rootReducer,
      ROOT_INITIAL_STATE,
      [],
      enhancers);
  }
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        BaseService,
        IdentityService,
        NavigationService,
        ScriptLoaderService,
        LocalStorageService,
        SortService,
        StoredProcedureService,
        ActionCreatorService
      ]
    };
  }
}
