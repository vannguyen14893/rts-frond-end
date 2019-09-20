import { ActionCreatorService } from './../core/services/action-creator.service';
import { IRootState } from './../core/redux/root.store';
import { ScriptLoaderService } from '../core/services/script-loader.service';
import { Helpers } from './../helpers';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { select } from 'ng2-redux';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { StoredProcedureService } from '../core/services/stored-procedure.service';
import { SwalCategory } from '../model/my-types';

declare let mApp: any;
declare let mUtil: any;
declare let mLayout: any;
@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit {
    @select((s: IRootState) => s.uiStore.globalUiStore.showSwal) showSwal$;
    @ViewChild('unauthorizedSwal') private unauthorizedSwal: SwalComponent;

    private swalCategory = '';

    constructor(
        private _script: ScriptLoaderService,
        private _router: Router,
        private ac: ActionCreatorService,
        private sp: StoredProcedureService,
    ) { }
    ngOnInit() {
        this._router.events.subscribe((route) => {
            if (route instanceof NavigationStart) {
                // (<any>mLayout).closeMobileAsideMenuOffcanvas();
                (<any>mLayout).closeMobileHorMenuOffcanvas();
                (<any>mApp).scrollTop();
                Helpers.setLoading(true);
                // hide visible popover
                (<any>$('[data-toggle="m-popover"]')).popover('hide');
            }
            if (route instanceof NavigationEnd) {
                // init required js
                (<any>mApp).init();
                (<any>mUtil).init();
                Helpers.setLoading(false);
                // content m-wrapper animation
                let animation = 'm-animate-fade-in-up';
                $('.m-wrapper').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(e) {
                    $('.m-wrapper').removeClass(animation);
                }).removeClass(animation).addClass(animation);
            }
        });
        this.showSwal$.subscribe(show => {
            this.swalCategory = this.sp.getSwalCategory();
            if (show) {
                switch (this.swalCategory) {
                    case SwalCategory.Unauthorized:
                        this.unauthorizedSwal.show();
                        break;
                    default: return;
                }
            }
        });
    }
    closeSwal() {
        this.ac.closeSwal();
    }
}
