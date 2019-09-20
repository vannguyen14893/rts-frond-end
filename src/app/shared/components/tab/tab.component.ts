import { IRootState } from './../../../core/redux/root.store';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { select } from 'ng2-redux';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabComponent implements OnInit {
  @Input() tabs: Tab[] = [];
  @Output() tabSelected = new EventEmitter();

  currentTab = '';

  constructor() { }

  ngOnInit() {
    this.currentTab = this.tabs.length > 0 ? this.tabs[0].tabName : '';
    console.log('Tab Component - tabs', this.tabs);
  }

  switchTab(tabName: string) {
    this.tabSelected.emit(tabName);
  }

}

interface Tab {
  tabName: string;
  badgeNumber: number;
  isActive: boolean;
}
